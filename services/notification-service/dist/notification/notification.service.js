"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const pg_1 = require("pg");
const DATABASE_URL = process.env.DATABASE_URL || 'postgres://webuser:webpass@localhost:5432/webservice';
let NotificationService = class NotificationService {
    constructor() {
        this.pool = new pg_1.Pool({ connectionString: DATABASE_URL });
    }
    async onModuleInit() {
        await this.pool.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        is_read BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    }
    async onModuleDestroy() {
        await this.pool.end();
    }
    async send(input) {
        var _a, _b, _c;
        const userId = (_a = input.userId) === null || _a === void 0 ? void 0 : _a.trim();
        const title = (_b = input.title) === null || _b === void 0 ? void 0 : _b.trim();
        const message = (_c = input.message) === null || _c === void 0 ? void 0 : _c.trim();
        if (!userId || !title || !message)
            throw new common_1.BadRequestException('User, title and message are required');
        const result = await this.pool.query(`
        INSERT INTO notifications (user_id, title, message)
        VALUES ($1, $2, $3)
        RETURNING *
      `, [userId, title, message]);
        return this.toNotification(result.rows[0]);
    }
    async listForUser(userId) {
        const resolvedUserId = userId === null || userId === void 0 ? void 0 : userId.trim();
        if (!resolvedUserId)
            throw new common_1.BadRequestException('User is required');
        const result = await this.pool.query('SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC', [resolvedUserId]);
        return result.rows.map((notification) => this.toNotification(notification));
    }
    async markAsRead(id) {
        const result = await this.pool.query('UPDATE notifications SET is_read = TRUE WHERE id = $1 RETURNING *', [id]);
        const notification = result.rows[0];
        if (!notification)
            throw new common_1.NotFoundException('Notification not found');
        return this.toNotification(notification);
    }
    async markAllAsRead(userId) {
        const resolvedUserId = userId === null || userId === void 0 ? void 0 : userId.trim();
        if (!resolvedUserId)
            throw new common_1.BadRequestException('User is required');
        const result = await this.pool.query('UPDATE notifications SET is_read = TRUE WHERE user_id = $1 RETURNING *', [resolvedUserId]);
        return result.rows.map((notification) => this.toNotification(notification));
    }
    toNotification(notification) {
        return {
            id: String(notification.id),
            userId: notification.user_id,
            title: notification.title,
            message: notification.message,
            read: notification.is_read,
            createdAt: notification.created_at.toISOString(),
        };
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)()
], NotificationService);
//# sourceMappingURL=notification.service.js.map