import { Args, Field, InputType, Mutation, ObjectType, Query, Resolver } from '@nestjs/graphql';

@ObjectType()
class Notification {
  @Field()
  id!: string;

  @Field()
  userId!: string;

  @Field()
  title!: string;

  @Field()
  message!: string;

  @Field()
  read!: boolean;

  @Field()
  createdAt!: string;
}

@InputType()
class SendNotificationInput {
  @Field()
  userId!: string;

  @Field()
  title!: string;

  @Field()
  message!: string;
}

@Resolver()
export class NotificationResolver {
  private notificationUrl = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:4004';

  @Query(() => [Notification])
  async myNotifications(@Args('userId') userId: string) {
    const resp = await fetch(`${this.notificationUrl}/notifications/my?userId=${encodeURIComponent(userId)}`);
    if (!resp.ok) throw new Error('Notification list failed');
    return resp.json();
  }

  @Mutation(() => Notification)
  async sendNotification(@Args('input') input: SendNotificationInput) {
    const resp = await fetch(`${this.notificationUrl}/notifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    if (!resp.ok) throw new Error('Notification send failed');
    return resp.json();
  }

  @Mutation(() => Notification)
  async markNotificationAsRead(@Args('id') id: string) {
    const resp = await fetch(`${this.notificationUrl}/notifications/${encodeURIComponent(id)}/read`, {
      method: 'PATCH',
    });
    if (!resp.ok) throw new Error('Notification read update failed');
    return resp.json();
  }

  @Mutation(() => [Notification])
  async markAllNotificationsAsRead(@Args('userId') userId: string) {
    const resp = await fetch(`${this.notificationUrl}/notifications/read-all`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    if (!resp.ok) throw new Error('Notifications read update failed');
    return resp.json();
  }
}
