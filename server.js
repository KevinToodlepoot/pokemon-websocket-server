const WebSocket = require('ws');

// Set the WebSocket server port
const port = process.env.PORT || 8080;
const wss = new WebSocket.Server({ port: port });

let clients = [];

// Handle WebSocket connections
wss.on('connection', (ws) => {
    clients.push(ws);
    ws.on('message', (message) => {
        // Broadcast the message to all clients
        clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });
    ws.on('close', () => {
        clients = clients.filter((client) => client !== ws);
    });
});

console.log(`WebSocket server running at ws://localhost:${port}`);