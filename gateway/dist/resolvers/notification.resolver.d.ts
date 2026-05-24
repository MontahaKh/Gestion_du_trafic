declare class SendNotificationInput {
    userId: string;
    title: string;
    message: string;
}
export declare class NotificationResolver {
    private notificationUrl;
    myNotifications(userId: string): Promise<any>;
    sendNotification(input: SendNotificationInput): Promise<any>;
    markNotificationAsRead(id: string): Promise<any>;
    markAllNotificationsAsRead(userId: string): Promise<any>;
}
export {};
