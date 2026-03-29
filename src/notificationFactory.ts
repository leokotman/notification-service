import { ConsoleNotificationChannel } from './consoleNotificationChannel';
import { EmailNotificationProvider } from './emailNotificationProvider';
import { NotificationChannel } from './notificationInterface';
import { NotificationChannelRouter } from './notificationChannelRouter';
import { PushNotificationProvider } from './pushNotificationProvider';
import { ResilientNotificationChannel } from './resilientNotificationChannel';
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
    const consoleChannel = new ConsoleNotificationChannel();

    switch (channelType) {
      case 'console':
        return new ResilientNotificationChannel(consoleChannel);
      case 'email':
        return new ResilientNotificationChannel(
          new EmailNotificationProvider(),
          consoleChannel,
        );
      case 'sms':
        return new ResilientNotificationChannel(
          new SmsNotificationProvider(),
          consoleChannel,
        );
      case 'push':
        return new ResilientNotificationChannel(
          new PushNotificationProvider(),
          consoleChannel,
        );
      case 'multi': {
        const router = new NotificationChannelRouter();
        router.register(
          new ResilientNotificationChannel(
            new EmailNotificationProvider(),
            consoleChannel,
          ),
        );
        router.register(
          new ResilientNotificationChannel(
            new SmsNotificationProvider(),
            consoleChannel,
          ),
        );
        router.register(
          new ResilientNotificationChannel(
            new PushNotificationProvider(),
            consoleChannel,
          ),
        );
        router.register(new ResilientNotificationChannel(consoleChannel));
        return router;
      }
      default:
        return new ResilientNotificationChannel(consoleChannel);
    }
  }
}
