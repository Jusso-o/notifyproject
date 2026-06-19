const WebSocket = require('ws');

const clients = new Map(); // userId -> socket

function setupWebSocket(server) {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws, req) => {
    const userId = new URL(req.url, 'http://x').searchParams.get('userId');
    if (userId) clients.set(userId, ws);

    ws.on('close', () => clients.delete(userId));
  });
}

function notifyUser(userId, message) {
  const ws = clients.get(userId);
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
  }
}

module.exports = { setupWebSocket, notifyUser };