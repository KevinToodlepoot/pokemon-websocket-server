const { Server } = require('ws');

module.exports = (req, res) => {
  if (!res.socket.server.wss) {
    console.log('Starting WebSocket server...');
    const wss = new Server({ noServer: true });

    wss.on('connection', (ws) => {
      ws.on('message', (message) => {
        wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === ws.OPEN) {
            client.send(message);
          }
        });
      });
    });

    res.socket.server.on('upgrade', (request, socket, head) => {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    });

    res.socket.server.wss = wss;
  }
  res.end();
};