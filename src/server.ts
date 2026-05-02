/**
 * Notification Service Server
 * Express server for messaging app with notifications
 */

import express, { Request, Response } from 'express';
import path from 'path';
import notificationService from './notificationService';
import notificationServiceMicro from './notificationServiceMicro';

interface MessageBody {
  message?: string;
  sender?: string;
}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

/**
 * GET / - Serve the main HTML page
 */
app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

/**
 * POST /api/messages - Receive a new message and trigger notification
 */
app.post(
  '/api/messages',
  (req: Request<{}, {}, MessageBody>, res: Response) => {
    const { message, sender } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const notification = `New message from ${sender || 'Someone'}: ${message}`;

    // Legacy in-process notification service (still available for direct usage)
    notificationService.showNotification(notification);

    // Microservice-style event-based path
    notificationServiceMicro.sendNotification(notification);

    res.json({ success: true, notification });
  },
);

/**
 * GET /api/subscribe - Server-Sent Events endpoint for notifications
 */
app.get('/api/subscribe', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // Subscribe to the NotificationService publish mechanism.
  const unsubscribe = notificationService.subscribe((renderedNotification) => {
    res.write(
      `data: ${JSON.stringify({ notification: renderedNotification })}\n\n`,
    );
  });

  // Send a connection acknowledgement.
  res.write(
    `data: ${JSON.stringify({ message: 'Connected to over-engineered notification service' })}\n\n`,
  );

  req.on('close', () => {
    unsubscribe();
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Notification Service running on http://localhost:${PORT}`);
});
