import { AuthType } from './Authorize';

export interface ICommentPhoto {
    path: string;
    profile: 'original_jpg' | 'scale_1600_jpg' | 'thumbnail_256_jpg';
}

export interface IComment {
    id: string | null;
    parentId: string;
    username: string;
    email: string;
    web: string;
    images: Array<Array<ICommentPhoto>>;
    body: string;
    lastModified: number;
    createdAt: number;
    authType?: AuthType;
    userId?: string;
};

export default class Comment implements IComment {
    id: string | null;
    parentId: string;
    username: string;
    email: string;
    web: string;
    images: Array<Array<ICommentPhoto>>;
    body: string;
    lastModified: number;
    createdAt: number;
    authType?: AuthType;
    userId?: string;

    constructor(obj: IComment) {
        this.id = obj.id;
        this.parentId = obj.parentId;
        this.username = obj.username;
        this.email = obj.email;
        this.web = obj.web;
        this.images = obj.images;
        this.body = obj.body;
        this.lastModified = obj.lastModified;
        this.createdAt = obj.createdAt;
        this.authType = obj.authType;
        this.userId = obj.userId;
    }

    toObject(): IComment {
        let obj = {} as IComment;
        const a = this;
        obj.id = a.id;
        obj.parentId = a.parentId;
        obj.username = a.username;
        obj.email = a.email;
        obj.web = a.web;
        obj.images = a.images;
        obj.body = a.body;
        obj.lastModified = a.lastModified;
        obj.createdAt = a.createdAt;
        return obj;
    }

    toJSONString() {
        const obj = this.toObject();
        return JSON.stringify(obj, null, 2);
    }
}
