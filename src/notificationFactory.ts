import { ConsoleNotificationChannel } from './consoleNotificationChannel';
import { NotificationChannel } from './notificationInterface';

/**
 * NotificationFactory
 *
 * Creates notification channel instances based on a type.
 */
export class NotificationFactory {
  static createChannel(
    channelType: 'console' | 'webhook' = 'console',
  ): NotificationChannel {
    switch (channelType) {
      case 'console':
        return new ConsoleNotificationChannel();
      case 'webhook':
        // Stubbed out extension point for webhook or 3rd-party push channels
        return new ConsoleNotificationChannel();
      default:
        return new ConsoleNotificationChannel();
    }
  }
}
