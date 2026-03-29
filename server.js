/**
 * Notification Service Server
 * Express server for messaging app with notifications
 */

const express = require('express');
const path = require('path');
const notificationService = require('./notificationService');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Store connected clients for Server-Sent Events (SSE)
let clients = [];

/**
 * GET / - Serve the main HTML page
 */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/**
 * POST /api/messages - Receive a new message and trigger notification
 */
app.post('/api/messages', (req, res) => {
  const { message, sender } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const notification = `New message from ${sender || 'Someone'}: ${message}`;
  
  // Show notification via service
  notificationService.showNotification(notification);

  // Send to all connected SSE clients
  clients.forEach(res => {
    res.write(`data: ${JSON.stringify({ notification })}\n\n`);
  });

  res.json({ success: true, notification });
});

/**
 * GET /api/subscribe - Server-Sent Events endpoint for notifications
 */
app.get('/api/subscribe', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  clients.push(res);

  res.write(`data: ${JSON.stringify({ message: 'Connected to notification service' })}\n\n`);

  req.on('close', () => {
    clients = clients.filter(client => client !== res);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Notification Service running on http://localhost:${PORT}`);
});
