import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  send(@Body() body: { userId: string; title: string; message: string }) {
    return this.notificationService.send(body);
  }

  @Get('my')
  myNotifications(@Query('userId') userId: string) {
    return this.notificationService.listForUser(userId);
  }

  @Patch('read-all')
  markAllAsRead(@Body() body: { userId: string }) {
    return this.notificationService.markAllAsRead(body.userId);
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.notificationService.markAsRead(id);
  }
}
