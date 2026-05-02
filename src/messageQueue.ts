import { EventBus } from './eventBus';

export interface QueueMessage {
  id: string;
  type: string;
  payload: any;
}

/**
 * MessageQueue
 *
 * Simulates a message queue for decoupled services.
 */
export class MessageQueue {
  private queue: QueueMessage[] = [];
  private processing = false;

  constructor(private bus: EventBus) {}

  enqueue(message: QueueMessage): void {
    this.queue.push(message);
    this.bus.emit('enqueue', message);
    this.processNext();
  }

  private processNext(): void {
    if (this.processing) return;
    const message = this.queue.shift();
    if (!message) return;

    this.processing = true;

    process.nextTick(() => {
      try {
        this.bus.emit('dequeue', message);
      } catch (err) {
        this.bus.emit('error', err, message);
      } finally {
        this.processing = false;
        this.processNext();
      }
    });
  }
}
