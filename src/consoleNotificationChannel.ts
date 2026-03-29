import { NotificationChannel } from './notificationInterface';

/**
 * ConsoleNotificationChannel
 *
 * Concrete channel implementation for logging notifications to console.
 * This is the default channel for this demo but can be swapped with email, SMS, etc.
 */
export class ConsoleNotificationChannel implements NotificationChannel {
  send(message: string): void {
    console.log(message);
  }
}
