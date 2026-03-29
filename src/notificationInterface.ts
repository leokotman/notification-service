/**
 * NotificationInterface
 *
 * This interface exists to prove that we can split API contracts into separate
 * files for infinite extensibility, even when a single channel would suffice.
 */
export interface NotificationChannel {
  send(message: string): void;
}
