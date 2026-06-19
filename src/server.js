require('dotenv').config();
const express = require('express');
const http = require('http');
const { setupWebSocket, notifyUser } = require('./websocket');
const { sendEmail } = require('./email');

const app = express();
app.use(express.json());

const server = http.createServer(app);
setupWebSocket(server);

// Endpoint que dispara uma notificação
app.post('/notify', async (req, res) => {
  const { userId, email, subject, message } = req.body;

  // 1. Envia em tempo real via WebSocket
  notifyUser(userId, { type: 'NOTIFICATION', message });

  // 2. Envia e-mail via SendGrid
  await sendEmail({ to: email, subject, text: message });

  res.json({ ok: true });
});

server.listen(process.env.PORT, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT}`);
});