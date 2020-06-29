import React from 'react';
import { AuthType, IAuthorize } from '../models/Authorize';

type IUpdateAuthorize = { [P in keyof IAuthorize]?: IAuthorize[P] };

export interface IStorageContext {
    auth: IAuthorize,
    updateAuth(auth: IUpdateAuthorize): void;
}

export class DefaultStorageContext implements IStorageContext {
    auth: IAuthorize;

    constructor() {
        this.auth = {
            authType: localStorage.getItem('auth.authType') as AuthType,
            token: localStorage.getItem('auth.token'),
            userId: localStorage.getItem('auth.userId') || '',
            username: localStorage.getItem('auth.username') || '',
            email: localStorage.getItem('auth.email') || '',
            website: localStorage.getItem('auth.website') || '',
        };
    }

    getAuth(): IAuthorize {
        return this.auth;
    }

    updateAuth(auth: IUpdateAuthorize): void {
        this.auth = {...this.auth, ...auth};
        localStorage.setItem('auth.authType', this.auth.authType as AuthType);
        const setItem = (key: string, value: string | null) => {
            if (!!value)
                localStorage.setItem(key, value);
            else
                localStorage.removeItem(key);
        }
        setItem('auth.token', this.auth.token);
        setItem('auth.userId', this.auth.userId);
        setItem('auth.username', this.auth.username);
        setItem('auth.email', this.auth.email);
        setItem('auth.website', this.auth.website);
    }
}

const StorageContext = React.createContext(new DefaultStorageContext());

export default StorageContext;
