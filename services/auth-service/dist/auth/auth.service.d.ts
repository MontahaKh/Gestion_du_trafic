export declare class AuthService {
    private users;
    private nextId;
    register(name: string, email: string, password: string, role?: string): Promise<{
        token: any;
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
    }>;
    login(email: string, password: string): Promise<{
        token: any;
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
    }>;
    verifyToken(token: string): any;
    private generateToken;
    private safeUser;
}
