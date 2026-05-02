import { NotificationChannel } from './notificationInterface';

/**
 * SmsNotificationProvider
 *
 * Simulates sending SMS notifications. Kept as a separate provider for flexibility.
 */
export class SmsNotificationProvider implements NotificationChannel {
  send(message: string): void {
    // Placeholder for an SMS API integration.
    console.log(`[SMS] ${message}`);
  }
}
