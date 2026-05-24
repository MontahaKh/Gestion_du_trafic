import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
export declare class NotificationService implements OnModuleInit, OnModuleDestroy {
    private readonly pool;
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    send(input: {
        userId: string;
        title: string;
        message: string;
    }): Promise<{
        id: string;
        userId: string;
        title: string;
        message: string;
        read: boolean;
        createdAt: string;
    }>;
    listForUser(userId: string): Promise<any>;
    markAsRead(id: string): Promise<{
        id: string;
        userId: string;
        title: string;
        message: string;
        read: boolean;
        createdAt: string;
    }>;
    markAllAsRead(userId: string): Promise<any>;
    private toNotification;
}
