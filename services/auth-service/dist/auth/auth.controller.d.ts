import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(body: {
        name?: string;
        email: string;
        password: string;
        role?: string;
    }): Promise<{
        token: any;
        user: {
            id: string;
            name: string;
            email: string;
            role: string;
        };
    }>;
    login(body: {
        email: string;
        password: string;
    }): Promise<{
        token: any;
        user: {
            id: string;
            name: string;
            email: string;
            role: string;
        };
    }>;
    verify(req: any): any;
}
