/**
 * Notification Service Module
 * Handles showing notifications for new messages
 */

type NotificationCallback = (message: string) => void;

class NotificationService {
  private subscriptions: NotificationCallback[] = [];

  /**
   * Show a notification for a received message
   * @param {string} message - The notification message to display
   */
  showNotification(message: string): void {
    console.log(`[NOTIFICATION] ${message}`);

    // Notify all subscribers (WebSocket connections, etc.)
    this.subscriptions.forEach((callback) => {
      try {
        callback(message);
      } catch (error) {
        console.error('Error notifying subscriber:', error);
      }
    });
  }

  /**
   * Subscribe to notification events
   * @param {function} callback - Function to call when notification occurs
   */
  subscribe(callback: NotificationCallback): () => void {
    this.subscriptions.push(callback);

    return () => {
      this.subscriptions = this.subscriptions.filter((sub) => sub !== callback);
    };
  }
}

export default new NotificationService();
