import { NotificationService } from './notification.service';
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    send(body: {
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
    myNotifications(userId: string): Promise<any>;
    markAllAsRead(body: {
        userId: string;
    }): Promise<any>;
    markAsRead(id: string): Promise<{
        id: string;
        userId: string;
        title: string;
        message: string;
        read: boolean;
        createdAt: string;
    }>;
}
