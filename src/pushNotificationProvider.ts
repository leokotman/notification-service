import { NotificationChannel } from './notificationInterface';

/**
 * PushNotificationProvider
 *
 * Simulates sending push notifications. Kept separate for extensibility.
 */
export class PushNotificationProvider implements NotificationChannel {
  send(message: string): void {
    // Placeholder for push notification service integration.
    console.log(`[PUSH] ${message}`);
  }
}
