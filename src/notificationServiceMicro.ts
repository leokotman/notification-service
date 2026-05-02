import { EventBus } from './eventBus';
import { MessageQueue, QueueMessage } from './messageQueue';
import { NotificationWorker } from './notificationWorker';

/**
 * NotificationServiceMicro
 *
 * Simulated microservice entrypoint with event-driven queueing and worker processing.
 */
export class NotificationServiceMicro {
  private readonly bus: EventBus;
  private readonly queue: MessageQueue;
  private readonly worker: NotificationWorker;

  constructor() {
    this.bus = new EventBus();
    this.queue = new MessageQueue(this.bus);
    this.worker = new NotificationWorker(this.bus);

    this.bus.on('processed', (payload) => {
      console.log('NotificationServiceMicro: processed event', payload);
    });
  }

  sendNotification(message: string): void {
    const event: QueueMessage = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      type: 'notification:created',
      payload: { id: '', message },
    };

    this.queue.enqueue(event);
  }
}

export default new NotificationServiceMicro();
