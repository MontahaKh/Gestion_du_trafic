import { BadRequestException, Injectable, NotFoundException, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Pool } from 'pg';

const DATABASE_URL = process.env.DATABASE_URL || 'postgres://webuser:webpass@localhost:5432/webservice';

type StoredNotification = {
  id: number;
  user_id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: Date;
};

@Injectable()
export class NotificationService implements OnModuleInit, OnModuleDestroy {
  private readonly pool = new Pool({ connectionString: DATABASE_URL });

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

  async send(input: { userId: string; title: string; message: string }) {
    const userId = input.userId?.trim();
    const title = input.title?.trim();
    const message = input.message?.trim();
    if (!userId || !title || !message) throw new BadRequestException('User, title and message are required');

    const result = await this.pool.query<StoredNotification>(
      `
        INSERT INTO notifications (user_id, title, message)
        VALUES ($1, $2, $3)
        RETURNING *
      `,
      [userId, title, message],
    );

    return this.toNotification(result.rows[0]);
  }

  async listForUser(userId: string) {
    const resolvedUserId = userId?.trim();
    if (!resolvedUserId) throw new BadRequestException('User is required');

    const result = await this.pool.query<StoredNotification>(
      'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC',
      [resolvedUserId],
    );
    return result.rows.map((notification) => this.toNotification(notification));
  }

  async markAsRead(id: string) {
    const result = await this.pool.query<StoredNotification>(
      'UPDATE notifications SET is_read = TRUE WHERE id = $1 RETURNING *',
      [id],
    );
    const notification = result.rows[0];
    if (!notification) throw new NotFoundException('Notification not found');
    return this.toNotification(notification);
  }

  async markAllAsRead(userId: string) {
    const resolvedUserId = userId?.trim();
    if (!resolvedUserId) throw new BadRequestException('User is required');

    const result = await this.pool.query<StoredNotification>(
      'UPDATE notifications SET is_read = TRUE WHERE user_id = $1 RETURNING *',
      [resolvedUserId],
    );
    return result.rows.map((notification) => this.toNotification(notification));
  }

  private toNotification(notification: StoredNotification) {
    return {
      id: String(notification.id),
      userId: notification.user_id,
      title: notification.title,
      message: notification.message,
      read: notification.is_read,
      createdAt: notification.created_at.toISOString(),
    };
  }
}
