/**
 * NotificationRenderer
 *
 * Responsible for transforming raw messages into a rendered notification format.
 * This abstraction is intentionally overkill for a simple console log, but it
 * demonstrates a dedicated rendering layer for future template/localization support.
 */
export class NotificationRenderer {
  render(rawMessage: string): string {
    // Future extension point for additional notification channels or rich formats
    return `[NOTIFICATION] ${rawMessage}`;
  }
}
