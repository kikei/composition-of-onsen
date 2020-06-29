export type AuthType = 'guest' | 'signin';

export interface IAuthorize {
    authType: AuthType | null;
    token: string | null;
    userId: string;
    username: string;
    email: string;
    website: string;
}
