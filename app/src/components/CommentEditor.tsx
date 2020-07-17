import React, { useState, useContext, useRef } from 'react';

import Comment from '../models/Comment';
import WebAPI from '../services/WebAPI';
import ConfigContext from '../contexts/ConfigContext';
import StorageContext from '../contexts/StorageContext';

type SaveStatus = 'none' | 'progress' | 'success';

interface IProps extends React.Props<any> {
    analysisId: string;
    onSuccess?: (token: string, comment: Comment) => void;
}

const MAX_FILE_BYTES = 1024 * 1000 * 10; // 10 MB

function checkFile(file: File): boolean {
    console.log('checkFile, file:', file);
    return file.size <= MAX_FILE_BYTES &&
           !!file.type.match(/^image\/(jpeg|png)$/);
}

const CommentEditor: React.FC<IProps> = props => {
    const context = useContext(ConfigContext);
    const storageContext = useContext(StorageContext);

    const { token, username, email, website } = storageContext.getAuth();

    const [saveState, setSaveState] = useState('none');
    const [inputName, setInputName] = useState(username);
    const [inputEmail, setInputEmail] = useState(email);
    const [inputWebsite, setInputWebsite] = useState(website);
    const [inputBody, setInputBody] = useState('');
    const inputFiles = [useRef<HTMLInputElement>(null)];

    const callOnSuccess = (token: string, comment: Comment) => {
        // Reset form
        setInputBody('');
        inputFiles.forEach(ref => {
            if (ref?.current) ref.current.value = '';
        });
        // Callback
        if (typeof props.onSuccess === 'function')
            props.onSuccess(token, comment);
    }

    const submitComment = async () => {
        if (saveState !== 'none')
            return;
        setSaveState('progress');

        const images = inputFiles
            .map(ref => Array.from(ref.current?.files ?? []))
            .flat()
            .filter(f => !!f && checkFile(f));
        const comment = new Comment({
            id: null,
            parentId: props.analysisId,
            username: inputName,
            email: inputEmail,
            web: inputWebsite,
            images: [],
            body: inputBody,
            lastModified: 0,
            createdAt: 0
        });
        console.log('submitComment,', comment, 'and', images.length, 'images',
                    'token:', token);
        const api = new WebAPI(context);
        try {
            api.setToken(token);
            const res = await api.fetchPostComment(comment);
            storageContext.updateAuth({
                token: res.token,
                authType: res.authType,
                userId: res.userId,
                username: inputName,
                email: inputEmail,
                website: inputWebsite
            });
            callOnSuccess(res.token, res.value);
            if (images.length === 0) {
                setSaveState('success');
                setTimeout(() => setSaveState('none'), 1000);
            } else {
                const res1 =
                    await api.fetchPostCommentImages(res.value, images);
                console.log('Uploaded comment images, result:', res1);
                setSaveState('success');
                callOnSuccess(res1.token, res1.value);
                setTimeout(() => setSaveState('none'), 1000);
            }
        } catch (e) {
            console.warn('Failed to submit comment, e:', e);
        }
    };

    return (
        <div className="content">
            <div className="tabs is-centered">
                <ul>
                    <li className="is-active">
                        <a href="?signin">サインイン</a>
                    </li>
                    <li>
                        <a href="?guest">ゲスト</a>
                    </li>
                </ul>
            </div>
            <div className="field">
                ゲストモードでコメントした場合、同じWebブラウザを利用している間だけ、
                そのコメントの編集、削除ができます。
            </div>
            <div className="columns is-multiline field">
                <div className="column is-one-third">
                    <label>
                        <span className="label">Name:</span>
                        <div className="control">
                            <input type="text" name="username"
                                   value={inputName}
                                   onChange={e => setInputName(e.target.value)}
                                   className="input" />
                        </div>
                    </label>
                </div>
                <div className="column is-one-third field">
                    <label>
                        <span className="label">E-mail:</span>
                        <div className="control">
                            <input type="text" name="email"
                                   value={inputEmail}
                                   onChange={e => setInputEmail(e.target.value)}
                                   className="input" />
                        </div>
                    </label>
                </div>
                <div className="column is-one-third field">
                    <label>
                        <span className="label">Website:</span>
                        <div className="control">
                            <input type="text" name="web"
                                   value={inputWebsite}
                                   onChange={e => setInputWebsite(e.target.value)}
                                   className="input" />
                        </div>
                    </label>
                </div>
            </div>
            <div className="field">
                <label>
                    <span className="label">Comment:</span>
                    <div className="control">
                        <textarea placeholder="コメント"
                                  value={inputBody}
                                  onChange={e => setInputBody(e.target.value)}
                                  rows={1 + inputBody.split('\n').length}
                                  className="textarea">
                        </textarea>
                    </div>
                </label>
            </div>
            <div className="field">
                <div className="column is-half-widescreen">
                    <label>
                        <span className="label">写真:</span>
                        <div className="control">
                            <input type="file" name="photo"
                                   accept="image/jpeg,image/png"
                                   ref={inputFiles[0]} />
                        </div>
                    </label>
                </div>
            </div>
            <div className="control">
                {
                    saveState === 'none' ? (
                        <button
                            onClick={submitComment}
                            className="button is-primary is-rounded">
                            送信
                        </button>
                    ) : saveState === 'progress' ? (
                        <button className="button is-loading is-rounded">
                            送信中...
                        </button>
                    ) : saveState === 'success' ? (
                        <button className="button is-success is-rounded">
                            成功!!
                        </button>
                    ) : (
                        <button className="button is-danger is-rounded">
                            Error!
                        </button>
                    )
                }
            </div>
        </div>
    )
};

export default CommentEditor;
