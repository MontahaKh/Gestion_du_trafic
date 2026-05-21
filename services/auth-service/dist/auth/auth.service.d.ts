import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
type SafeUser = {
    id: string;
    name: string;
    email: string;
    role: string;
};
export declare class AuthService implements OnModuleInit, OnModuleDestroy {
    private readonly pool;
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    register(name: string, email: string, password: string, role?: string): Promise<{
        token: any;
        user: SafeUser;
    }>;
    login(email: string, password: string): Promise<{
        token: any;
        user: SafeUser;
    }>;
    verifyToken(token: string): any;
    private generateToken;
    private safeUser;
}
export {};
