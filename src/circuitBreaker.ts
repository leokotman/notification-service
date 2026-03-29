/**
 * CircuitBreaker
 *
 * Tracks failure counts and temporarily trips into open state for defensive behavior.
 */
export class CircuitBreaker {
  private failureCount = 0;
  private successCount = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';
  private lastFailureTime = 0;

  constructor(
    private readonly failureThreshold = 3,
    private readonly recoveryTimeoutMs = 30_000,
    private readonly successThreshold = 2,
  ) {}

  canAttempt(): boolean {
    if (this.state === 'open') {
      const now = Date.now();
      if (now - this.lastFailureTime > this.recoveryTimeoutMs) {
        this.state = 'half-open';
        return true;
      }
      return false;
    }

    return true;
  }

  recordSuccess(): void {
    if (this.state === 'half-open') {
      this.successCount += 1;
      if (this.successCount >= this.successThreshold) {
        this.reset();
      }
    } else {
      this.reset();
    }
  }

  recordFailure(): void {
    this.failureCount += 1;
    this.lastFailureTime = Date.now();

    if (this.failureCount >= this.failureThreshold) {
      this.state = 'open';
      this.successCount = 0;
    }
  }

  reset(): void {
    this.state = 'closed';
    this.failureCount = 0;
    this.successCount = 0;
    this.lastFailureTime = 0;
  }

  getState(): 'closed' | 'open' | 'half-open' {
    return this.state;
  }
}
