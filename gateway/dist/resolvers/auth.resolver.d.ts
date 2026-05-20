declare class RegisterInput {
    email: string;
    password: string;
    name?: string;
    role?: string;
}
declare class LoginInput {
    email: string;
    password: string;
}
export declare class AuthResolver {
    private authUrl;
    me(ctx: {
        req: {
            headers: Record<string, string | string[] | undefined>;
        };
    }): Promise<any>;
    register(input: RegisterInput): Promise<any>;
    login(input: LoginInput): Promise<any>;
}
export {};
