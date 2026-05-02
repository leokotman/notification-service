import { NotificationChannel } from './notificationInterface';
import { CircuitBreaker } from './circuitBreaker';
import { RetryScheduler } from './retryScheduler';

/**
 * ResilientNotificationChannel
 *
 * Wraps a channel with defensive circuit breaker, logging, and retry support.
 */
export class ResilientNotificationChannel implements NotificationChannel {
  private readonly circuitBreaker = new CircuitBreaker();
  private readonly retryScheduler = new RetryScheduler();

  constructor(
    private channel: NotificationChannel,
    private fallback?: NotificationChannel,
  ) {}

  send(message: string): void {
    if (!this.circuitBreaker.canAttempt()) {
      console.warn(
        'ResilientNotificationChannel: circuit breaker is open, using fallback if available',
      );
      if (this.fallback) {
        this.fallback.send(message);
      }
      return;
    }

    try {
      this.channel.send(message);
      this.circuitBreaker.recordSuccess();
    } catch (error) {
      console.error(
        'ResilientNotificationChannel: primary channel failed:',
        error,
      );
      this.circuitBreaker.recordFailure();

      if (this.fallback) {
        console.log(
          'ResilientNotificationChannel: attempting fallback channel',
        );
        try {
          this.fallback.send(message);
          this.circuitBreaker.recordSuccess();
        } catch (fallbackError) {
          console.error(
            'ResilientNotificationChannel: fallback also failed:',
            fallbackError,
          );
          this.retryScheduler.scheduleRetry(message, () => this.send(message));
        }
      } else {
        this.retryScheduler.scheduleRetry(message, () => this.send(message));
      }
    }
  }
}
