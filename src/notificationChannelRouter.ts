import { NotificationChannel } from './notificationInterface';

/**
 * NotificationChannelRouter
 *
 * Handles distributing a notification to multiple channels in one request.
 */
export class NotificationChannelRouter implements NotificationChannel {
  private readonly channels: NotificationChannel[];

  constructor(channels: NotificationChannel[] = []) {
    this.channels = channels;
  }

  register(channel: NotificationChannel): void {
    this.channels.push(channel);
  }

  send(message: string): void {
    // Broadcast to all registered channel providers.
    this.channels.forEach((channel) => channel.send(message));
  }
}
