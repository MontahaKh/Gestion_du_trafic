export declare class AuthResolver {
    private authUrl;
    me(ctx: any): Promise<any>;
    register(name: string, email: string, password: string, role: string): Promise<any>;
    login(email: string, password: string): Promise<any>;
}
