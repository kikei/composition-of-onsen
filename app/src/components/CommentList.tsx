import React, { Suspense, useState, useContext } from 'react';
import update from 'react-addons-update';

import ConfigContext from '../contexts/ConfigContext';
import StorageContext from '../contexts/StorageContext';
import WebAPI, {ICommentsOptions, ICommentsResponse} from '../services/WebAPI';
import CommentEditor from './CommentEditor';
import Resource from '../utils/Resource';
import Comment, {ICommentPhoto} from '../models/Comment';

interface IProps {
    analysisId: string
}

interface IState {
    comments: Resource<ICommentsResponse> | null
}

export type ICommentsPage =
    {[T in keyof ICommentsOptions]-?: ICommentsOptions[T]};

type IPhotoRoles = {
    thumbnail: ICommentPhoto | null;
    large: ICommentPhoto | null;
};

const commentBody = (body: string) => (
    <React.Fragment>
        {
            body.split('\n').map((t, i) =>
                <span key={i!}>{i !== 0 ? <br /> : ''}{t}</span>
            )
        }
    </React.Fragment>
);

const photoRoles = (photos: Array<ICommentPhoto>): IPhotoRoles => {
    return {
        thumbnail: photos.find(p => p.profile === "thumbnail_256_jpg") ?? null,
        large: photos.find(p => p.profile === "scale_1600_jpg") ?? null
    };
}

const CommentPhoto = (images: ICommentPhoto[][], api: WebAPI) =>
    images.map((profiles, i) => {
        const roles = photoRoles(profiles);
        const href = roles.large ?
                     api.urlCommentImage(roles.large.path) : '?';
        const src = roles.thumbnail ?
                    api.urlCommentImage(roles.thumbnail.path) : '';
        return (
            <li key={i} className="thumbnail">
                <a href={href}>
                    <figure className="image is-96x96">
                        <img src={src} alt="Comment" />
                    </figure>
                </a>
            </li>
        );
    });

const CommentListView: React.FC<{
    options: ICommentsPage,
    comments: ICommentsResponse
}> = props => {
    const context = useContext(ConfigContext);
    const storageContext = useContext(StorageContext);
    const [comments, setComments] = useState(props.comments.comments);

    const api = new WebAPI(context);

    const addedComment = async (token: string, comment: Comment) => {
        const index = comments.findIndex(c => c.id === comment.id);
        if (index === -1) {
            setComments([comment, ...comments]);
        } else {
            setComments(update(comments, { $splice: [[index, 1, comment]] }));
        }
    };

    const deleteComment = async (token: string, id: string) => {
        const res = await api.setToken(token).fetchDeleteComment(id);
        setComments(comments.filter(c => c.id !== res.value));
        storageContext.updateAuth({ token: res.token });
    };

    const { token, userId  } = storageContext.getAuth();
    console.log('CommentListView, token:', token, 'userId:', userId);

    const IconBox = (a: Comment) => (
        <div className="comment-toolbox">
        {
            !!a.email ? (
                <a href={`mailto:${a.email}`}>
                    <i className="fas fa-envelope fa-fw"></i>
                </a>
            ) : null 
        }
        {
            !!a.web ? (
                <a href={encodeURI(a.web)}
                   target="_blank" rel="noopener noreferrer">
                    <i className="fas fa-globe-asia fa-fw"></i>
                </a>
            ) : null
        }
        {
            token && a.userId && a.userId === userId ? (
                <React.Fragment>
                    <a className="button-delete"
                       href="?"
                       onClick={e => {
                           e.preventDefault();
                           deleteComment(token!, a.id!);
                       }}>
                        <i className="fas fa-trash fa-fw"></i>
                    </a>
                    <a className="button-edit" href="?">
                        <i className="fas fa-edit fa-fw"></i>
                    </a>
                </React.Fragment>
            ) : null
        }
            <a className="button-permanent" href={`#${a.id}`}>
                <i className="fas fa-bookmark fa-fw"></i>
            </a>
        </div>
    );

    const CommentDate = (date: Date) => {
        const dd = (x: number) => x >= 10 ? `${x}` : `0${x}`;
        return [
            date.getFullYear(),
            '年',
            date.getMonth(),
            '月',
            date.getDate(),
            '日 ',
            dd(date.getHours()),
            ':',
            dd(date.getMinutes()),
            ':',
            dd(date.getSeconds())
        ].join('')
    };

    const CommentItem = (a: Comment) => {
        return (
            <div id={a.id!} className="comment-item">
                <div className="level">
                    <div className="level-left">
                        <div className="level-item">
                            <div className="comment-user title is-5">
                                <span>{a.username}</span>
                            </div>
                        </div>
                        <div className="level-item">
                            <div className="comment-createdAt">
                                {CommentDate(new Date(a.createdAt * 1000))}
                            </div>
                        </div>
                    </div>
                    <div className="level-right">
                        <div className="level-item">
                            {IconBox(a)}
                        </div>
                    </div>
                </div>
                <div className="columns">
                    <div className="column is-two-thirds comment-body">
                        <div>
                            {a.body ? commentBody(a.body) : '本文無し'}
                        </div>
                    </div>
                    <div className="column">
                        <ul className="comment-images">
                            {CommentPhoto(a.images, api)}
                        </ul>
                    </div>
                </div>
            </div>
        )
    };

    return (
        <div>
            <CommentEditor analysisId={props.options.analysisId}
                           onSuccess={addedComment} />
            <ul className="content comments-list">
                {
                    comments.map((e, i) => (
                        <li key={i}>
                            {CommentItem(e)}
                        </li>
                    ))
                }
            </ul>
        </div>
    );
};

const SuspendedCommentList: React.FC<{
    options: ICommentsPage,
    comments: Resource<ICommentsResponse>
}> = props => 
    <CommentListView
        options={props.options}
        comments={props.comments.read()}
    />;

export default class CommentList
extends React.Component<IProps, IState> {
    static contextType = ConfigContext;

    options: ICommentsPage;

    constructor(props: IProps) {
        super(props);
        this.state = {
            comments: null
        };
        this.options = this.getCommentsOptions();
    }

    componentDidMount() {
        const api = new WebAPI(this.context);
        this.setState({ comments: api.fetchGetComments(this.options) });
    }

    getCommentsOptions(): ICommentsPage {
        const options = {
            analysisId: this.props.analysisId,
            limit: 64
        } as any;
        return options;
    }

    render() {
        const state = this.state;
        return (
            <div className="comment-container">
                <h2>Comments</h2>
                {
                    state.comments ? (
                        <Suspense fallback={<p>Loading...</p>}>
                            <SuspendedCommentList
                                options={this.options}
                                comments={state.comments} />
                        </Suspense>
                    ): null
                }
            </div>
        );
    }
}


