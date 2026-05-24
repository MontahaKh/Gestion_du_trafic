"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
let Notification = class Notification {
};
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Notification.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Notification.prototype, "userId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Notification.prototype, "title", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Notification.prototype, "message", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Boolean)
], Notification.prototype, "read", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Notification.prototype, "createdAt", void 0);
Notification = __decorate([
    (0, graphql_1.ObjectType)()
], Notification);
let SendNotificationInput = class SendNotificationInput {
};
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], SendNotificationInput.prototype, "userId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], SendNotificationInput.prototype, "title", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], SendNotificationInput.prototype, "message", void 0);
SendNotificationInput = __decorate([
    (0, graphql_1.InputType)()
], SendNotificationInput);
let NotificationResolver = class NotificationResolver {
    constructor() {
        this.notificationUrl = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:4004';
    }
    async myNotifications(userId) {
        const resp = await fetch(`${this.notificationUrl}/notifications/my?userId=${encodeURIComponent(userId)}`);
        if (!resp.ok)
            throw new Error('Notification list failed');
        return resp.json();
    }
    async sendNotification(input) {
        const resp = await fetch(`${this.notificationUrl}/notifications`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(input),
        });
        if (!resp.ok)
            throw new Error('Notification send failed');
        return resp.json();
    }
    async markNotificationAsRead(id) {
        const resp = await fetch(`${this.notificationUrl}/notifications/${encodeURIComponent(id)}/read`, {
            method: 'PATCH',
        });
        if (!resp.ok)
            throw new Error('Notification read update failed');
        return resp.json();
    }
    async markAllNotificationsAsRead(userId) {
        const resp = await fetch(`${this.notificationUrl}/notifications/read-all`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId }),
        });
        if (!resp.ok)
            throw new Error('Notifications read update failed');
        return resp.json();
    }
};
exports.NotificationResolver = NotificationResolver;
__decorate([
    (0, graphql_1.Query)(() => [Notification]),
    __param(0, (0, graphql_1.Args)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationResolver.prototype, "myNotifications", null);
__decorate([
    (0, graphql_1.Mutation)(() => Notification),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SendNotificationInput]),
    __metadata("design:returntype", Promise)
], NotificationResolver.prototype, "sendNotification", null);
__decorate([
    (0, graphql_1.Mutation)(() => Notification),
    __param(0, (0, graphql_1.Args)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationResolver.prototype, "markNotificationAsRead", null);
__decorate([
    (0, graphql_1.Mutation)(() => [Notification]),
    __param(0, (0, graphql_1.Args)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationResolver.prototype, "markAllNotificationsAsRead", null);
exports.NotificationResolver = NotificationResolver = __decorate([
    (0, graphql_1.Resolver)()
], NotificationResolver);
//# sourceMappingURL=notification.resolver.js.map