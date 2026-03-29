import { NotificationChannel } from './notificationInterface';

/**
 * EmailNotificationProvider
 *
 * Simulates sending email notifications. It is a provider that fits the
 * NotificationChannel interface and can be swapped easily.
 */
export class EmailNotificationProvider implements NotificationChannel {
  send(message: string): void {
    // Placeholder for an email service integration.
    console.log(`[EMAIL] ${message}`);
  }
}
