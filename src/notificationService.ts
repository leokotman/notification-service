import { NotificationChannel } from './notificationInterface';
import { NotificationFactory } from './notificationFactory';
import { NotificationRenderer } from './notificationRenderer';

export type NotificationCallback = (notification: string) => void;

/**
 * NotificationService
 *
 * This orchestration layer is intentionally over-engineered for an example.
 * It uses a factory to create channels and a renderer to format messages, then
 * publishes through a subscription model.
 */
class NotificationService {
  private subscriptions: NotificationCallback[] = [];
  private renderer: NotificationRenderer;
  private channel: NotificationChannel;

  constructor(
    channelType: 'console' | 'email' | 'sms' | 'push' | 'multi' = 'multi',
  ) {
    // Extension point: notify via selected channel set by config or runtime.
    this.renderer = new NotificationRenderer();
    this.channel = NotificationFactory.createChannel(channelType);
  }

  /**
   * Main entrypoint for notifying.
   * - Render message
   * - Send to channel or channel router
   * - Publish to in-app subscribers
   */
  showNotification(rawMessage: string): void {
    const rendered = this.renderer.render(rawMessage);

    try {
      // This is the direct channel side effect; supports pluggable channel implementations.
      this.channel.send(rendered);
    } catch (error) {
      // Defensive handling when channel path throws unexpectedly.
      console.error('NotificationService: section failed:', error);
      // Attempt fallback/resend via scheduler path.
      const fallbackChannel = NotificationFactory.createChannel('console');
      try {
        fallbackChannel.send(rendered);
      } catch (fallbackError) {
        console.error(
          'NotificationService: fallback send also failed:',
          fallbackError,
        );
      }
    }

    // Side-effect hook to notify in-process listeners (e.g. SSE clients).
    this.publish(rendered);
  }

  private publish(notification: string): void {
    this.subscriptions.forEach((callback) => {
      try {
        callback(notification);
      } catch (error) {
        console.error('Error in notification subscriber:', error);
      }
    });
  }

  subscribe(callback: NotificationCallback): () => void {
    this.subscriptions.push(callback);

    return () => {
      this.subscriptions = this.subscriptions.filter((sub) => sub !== callback);
    };
  }
}

export default new NotificationService();
