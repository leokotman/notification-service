/**
 * RetryScheduler
 *
 * Schedule retries for failed notifications in a queue with backoff.
 */
export class RetryScheduler {
  private queue: Array<{ message: string; attempt: number; work: () => void }> =
    [];
  private timer?: NodeJS.Timeout;

  constructor(
    private maxAttempts = 3,
    private baseDelayMs = 1000,
  ) {
    this.start();
  }

  scheduleRetry(message: string, work: () => void, attempt = 1): void {
    if (attempt > this.maxAttempts) {
      console.warn(
        `RetryScheduler: max retries reached for message: ${message}`,
      );
      return;
    }

    const delay = this.baseDelayMs * attempt;
    this.queue.push({ message, attempt, work });

    // Trigger processing if not already running.
    if (!this.timer) {
      this.start();
    }

    console.log(
      `RetryScheduler: scheduled attempt ${attempt} in ${delay}ms for ${message}`,
    );
    setTimeout(() => {
      try {
        work();
      } catch (error) {
        console.error('RetryScheduler: work execution failed:', error);
        this.scheduleRetry(message, work, attempt + 1);
      }
    }, delay);
  }

  private start(): void {
    if (this.timer) return;

    this.timer = setInterval(() => {
      if (this.queue.length === 0) {
        clearInterval(this.timer);
        this.timer = undefined;
      }
    }, 1000);
  }
}
