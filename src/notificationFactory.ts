import { ConsoleNotificationChannel } from './consoleNotificationChannel';
import { EmailNotificationProvider } from './emailNotificationProvider';
import { NotificationChannel } from './notificationInterface';
import { NotificationChannelRouter } from './notificationChannelRouter';
import { PushNotificationProvider } from './pushNotificationProvider';
import { SmsNotificationProvider } from './smsNotificationProvider';

/**
 * NotificationFactory
 *
 * Factory helper for building configured channel router/instances.
 */
export class NotificationFactory {
  static createChannel(
    channelType: 'console' | 'email' | 'sms' | 'push' | 'multi' = 'console',
  ): NotificationChannel {
    switch (channelType) {
      case 'console':
        return new ConsoleNotificationChannel();
      case 'email':
        return new EmailNotificationProvider();
      case 'sms':
        return new SmsNotificationProvider();
      case 'push':
        return new PushNotificationProvider();
      case 'multi': {
        const router = new NotificationChannelRouter();
        router.register(new ConsoleNotificationChannel());
        router.register(new EmailNotificationProvider());
        router.register(new SmsNotificationProvider());
        router.register(new PushNotificationProvider());
        return router;
      }
      default:
        return new ConsoleNotificationChannel();
    }
  }
}
