import { EventBus } from './eventBus';
import notificationService from './notificationService';

interface NotificationEvent {
  id: string;
  message: string;
}

/**
 * NotificationWorker
 *
 * Worker that processes queued notification creation events.
 */
export class NotificationWorker {
  constructor(private bus: EventBus) {
    this.bus.on('dequeue', (message) => this.handle(message));
    this.bus.on('error', (error, message) => {
      console.error(
        'NotificationWorker: queue processing error',
        error,
        message,
      );
    });
  }

  private handle(event: any): void {
    if (event.type !== 'notification:created') return;

    const payload = event.payload as NotificationEvent;
    try {
      const notificationText = `Worker routing: ${payload.message}`;
      notificationService.showNotification(notificationText);
      this.bus.emit('processed', payload);
    } catch (error) {
      console.error(
        'NotificationWorker: failed to process notification',
        error,
      );
      this.bus.emit('failed', payload, error);
    }
  }
}
