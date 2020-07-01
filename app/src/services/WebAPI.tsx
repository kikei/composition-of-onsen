import Resource, { suspender } from '../utils/Resource';
import Analysis, { IAnalysis } from '../models/Analysis';
import Comment, { ICommentPhoto } from '../models/Comment';
import { AuthType } from '../models/Authorize';

type WebAPIResource =
    'analyses' | 'analysis' | 'comments' | 'comment_image' | 'comment_images';
export type WebAPIUrls = {[R in WebAPIResource]: string};

const AnalysesOrderBys = ['timeline', 'identifier'] as const;
export type AnalysesOrderBy = typeof AnalysesOrderBys[number];

const AnalysesDirections = ['desc', 'asc'] as const;
export type AnalysesDirection = typeof AnalysesDirections[number];

/* Validators */
export function isValidOrderBy(x: any): x is AnalysesOrderBy {
    return AnalysesOrderBys.includes(x);
}

export function isValidDirection(x: any): x is AnalysesDirection {
    return AnalysesDirections.includes(x);
}

export interface IAnalysesOptions {
    query?: string;
    page?: number;
    limit?: number;
    orderBy?: AnalysesOrderBy;
    direction?: AnalysesDirection;
}

export interface IAnalysesResponse {
    analyses: Array<Analysis>;
    page: number;
    limit: number;
    total: number;
}

export interface ICommentsOptions {
    query?: string;
    analysisId: string;
    limit?: number;
}

export interface ICommentsResponse {
    comments: Array<Comment>;
    page: number;
    limit: number;
    total: number;
}

interface WithAuth<T> {
    authType: AuthType,
    userId: string,
    token: string;
    value: T;
}

function headerAuthorization(token: string) {
    return {Authorization: `Bearer ${token}`};
}

export default class WebAPI {
    urls: WebAPIUrls;
    token: string | null;

    constructor(options: {urls: WebAPIUrls}) {
        this.urls = options.urls;
        this.token = null;
    }

    setToken(token: string | null): WebAPI {
        this.token = token;
        return this;
    }

    urlAnalyses(options: IAnalysesOptions = {} as any) {
        const query = [
            options.query ? `q=${encodeURIComponent(options.query)}` : null,
            options.page ? `p=${options.page - 1}` : null,
            options.limit ? `l=${options.limit}` : null,
            options.orderBy ? 'o=' + (
                options.orderBy === 'timeline' ? 'l' : 'i'
            ) : null,
            options.direction ? 'd=' + (
                options.direction === 'desc' ? '-1' : '1'
            ) : null
        ].filter(x => !!x).join('&');
        return this.urls['analyses'] + (query ? `?${query}` : '');
    }

    urlAnalysis(id: string) {
        return this.urls['analysis'].replace('{id}', id);
    }

    fetchGetAnalyses(options: IAnalysesOptions = {} as any)
        : Resource<IAnalysesResponse> {
        const url = this.urlAnalyses(options);
        console.log('WebAPI.fetchGetAnalyses, url:', url);
        const promise =
            fetch(url)
                .then(r => r.json())
                .then(obj => {
                    const a =
                        obj.analysis.map((a: IAnalysis) => new Analysis(a));
                    console.log('WebAPI.fetchGetAnalyses done, obj:', obj,
                                'a:', a);
                    return {
                        analyses: a,
                        page: obj.page,
                        limit: obj.limit,
                        total: obj.total
                    };
                })
                .catch(e => {
                    console.warn('WebAPI.fetchGetAnalyses done, error:', e);
                    return {
                        analyses: [],
                        page: 0,
                        limit: 1,
                        total: 0
                    }
                });
        return suspender<IAnalysesResponse, string>(promise);
    }

    fetchGetAnalysis(id: string): Resource<Analysis> {
        const url = this.urlAnalysis(id);
        console.log('WebAPI.fetchGetAnalysis, url:', url);
        const promise =
            fetch(url)
                .then(r => {
                    if (r.ok)
                        return r.json();
                    else
                        throw new Error(`${r.statusText} ${r.status}`);
                })
                .then(obj => {
                    const a = new Analysis(obj);
                    console.log('WebAPI.fetchGetAnalysis done,',
                                'a:', a);
                    return a;
                })
                .catch(e => {
                    console.warn('WebAPI.fetchGetAnalysis done, error:', e);
                    throw e;
                })
        return suspender<Analysis, string>(promise);
    }

    fetchPutAnalysis(a: Analysis): Promise<Analysis> {
        if (!!a.id)
            throw new TypeError('analysis id should be empty');
        const url = this.urlAnalyses();
        console.log('WebAPI.fetchPutAnalysis, url:', url);
        const promise =
            fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                mode: 'cors',
                body: a.toJSONString()
            })
                .then(r => {
                    if (r.ok)
                        return r.json();
                    else
                        throw new Error(`${r.statusText} ${r.status}`);
                })
                .then(obj => {
                    const a = new Analysis(obj);
                    console.log('WebAPI.fetchPutAnalysis done,',
                                'a:', a);
                    return a;
                });
        return promise;
    }

    fetchPostAnalysis(a: Analysis): Promise<Analysis> {
        if (a.id === null)
            throw new TypeError('analysis id cannot be null');
        const url = this.urlAnalysis(a.id);
        console.log('WebAPI.fetchPostAnalysis, url:', url);
        const promise =
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                mode: 'cors',
                body: a.toJSONString()
            })
                .then(r => {
                    if (r.ok)
                        return r.json();
                    else
                        throw new Error(`${r.statusText} ${r.status}`);
                })
                .then(async obj => {
                    const a = new Analysis(obj);
                    console.log('WebAPI.fetchPostAnalysis done,',
                                'a:', a);
                    return a;
                });
        return promise;
    }

    /*
     * Comments
     */
    urlComment(id: string) {
        return `${this.urls['comments']}${id}`;
    }

    urlComments(options: ICommentsOptions = {} as any) {
        const query = [
            ...(options.query ? [`q={encodeURIComponent(options.query}`] : []),
            ...(options.analysisId ? [`a=${options.analysisId}`] : []),
            ...(options.limit ? [`l=${options.limit}`] : [])
        ].join('&');
        return this.urls['comments'] + (query ? `?${query}` : '');
    }

    urlCommentImage(path: string): string {
        return this.urls['comment_image']
                   .replace('{filename}', path);
    }

    urlCommentImages(commentId: string): string {
        return this.urls['comment_images']
                   .replace('{comment}', commentId);
    }

    fetchGetComments(options: ICommentsOptions = {} as any)
        : Resource<ICommentsResponse> {
        const url = this.urlComments(options);
        console.log('WebAPI.fetchGetComments, url:', url);
        const promise =
            fetch(url)
                .then(r => r.json())
                .then(obj => {
                    const a = obj.comments.map((a: any) => {
                        if (a.auth.guest) {
                            a.authType = 'guest';
                            a.userId = a.auth.guest.guestid;
                        } else {
                            a.authType = 'signin';
                            a.userId = a.auth.signin.userid;
                        }
                        return new Comment(a);
                    });
                    console.log('WebAPI.fetchGetComments done, obj:', obj,
                                'a:', a);
                    return {
                        comments: a,
                        page: obj.page,
                        limit: obj.limit,
                        total: obj.total
                    };
                })
                .catch(e => {
                    console.warn('WebAPI.fetchGetComments done, error:', e);
                    return {
                        comments: [],
                        page: 0,
                        limit: 1,
                        total: 0
                    }
                });
        return suspender<ICommentsResponse, string>(promise);
    }

    fetchPostComment(a: Comment): Promise<WithAuth<Comment>> {
        if (!!a.id)
            throw new TypeError('comment id should be empty');
        const url = this.urlComments();
        console.log('WebAPI.fetchPostComment, url:', url);

        const auth = !!this.token ? headerAuthorization(this.token) : {};
        const promise =
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...auth
                },
                mode: 'cors',
                body: a.toJSONString()
            })
                .then(r => {
                    if (r.ok)
                        return r.json();
                    else
                        throw new Error(`${r.statusText} ${r.status}`);
                })
                .then(async obj => {
                    console.log('obj:', obj, 'comment:', obj.comment);
                    if (obj.comment.auth.guest) {
                        obj.comment.authType = 'guest';
                        obj.comment.userId = obj.comment.auth.guest.guestid;
                    } else {
                        obj.comment.authType = 'signin';
                        obj.comment.userId = obj.comment.auth.signin.userid;
                    }
                    const a = new Comment(obj.comment);
                    console.log('WebAPI.fetchPutComment done, obj:', obj,
                                'a:', a);
                    return {
                        value: a,
                        authType: obj.auth_type,
                        userId: obj.userid,
                        token: obj.token
                    };
                });
        return promise;
    }

    fetchPostCommentImages(a: Comment, images: File[]):
        Promise<WithAuth<Array<Array<ICommentPhoto>>>>
    {
        if (!a.id)
            throw new TypeError('comment id must not be empty');
        const url = this.urlCommentImages(a.id!);
        console.log('WebAPI.fetchPostCommentImages, url:', url);
        const form = new FormData();
        images.forEach((e, i) => {
            form.append(`images${i}`, e, e.name);
        });

        const auth = !!this.token ? headerAuthorization(this.token) : {};

        const promise =
            fetch(url, {
                method: 'POST',
                headers: {
                    ...auth
                },
                mode: 'cors',
                body: form
            })
                .then(r => {
                    if (r.ok)
                        return r.json();
                    else
                        throw new Error(`${r.statusText} ${r.status}`);
                })
                .then(async obj => {
                    console.log('obj:', obj, 'comment:', obj.comment);
                    if (obj.comment.auth.guest) {
                        obj.comment.authType = 'guest';
                        obj.comment.userId = obj.comment.auth.guest.guestid;
                    } else {
                        obj.comment.authType = 'signin';
                        obj.comment.userId = obj.comment.auth.signin.userid;
                    }
                    console.log('WebAPI.fetchPutComment done, obj:', obj,
                                'a:', a);
                    return {
                        value: obj.images,
                        authType: obj.auth_type,
                        userId: obj.userid,
                        token: obj.token
                    };
                });
        return promise;
    }

    fetchDeleteComment(id: string): Promise<WithAuth<string>> {
        if (!id)
            throw new TypeError('comment id empty');
        const url = this.urlComment(id);
        console.log('WebAPI.fetchDeleteComment, url:', url);

        const auth = !!this.token ? headerAuthorization(this.token) : {};
        const promise =
            fetch(url, {
                method: 'DELETE',
                headers: {
                    ...auth
                },
                mode: 'cors'
            })
                .then(r => {
                    if (r.ok)
                        return r.json();
                    else
                        throw new Error(`${r.statusText} ${r.status}`);
                })
                .then(async obj => {
                    console.log('WebAPI.fetchDeleteComment done, obj:', obj);
                    return {
                        value: obj.id,
                        token: obj.token,
                        authType: obj.auth_type as AuthType,
                        userId: obj.userid
                    };
                })
                .catch(e => {
                    console.warn('WebAPI.fetchDeleteComments done, error:', e);
                    throw e;
                });
        return promise;
    }

}
