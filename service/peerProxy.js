const { WebSocketServer } = require('ws');
const uuid = require('uuid');
const DB = require('./database.js');
const cookie = require('cookie');

function peerProxy(httpServer) {
  const wss = new WebSocketServer({ noServer: true });



  // Handle WebSocket upgrade
  httpServer.on('upgrade', async (request, socket, head) => {
    const cookies = cookie.parse(request.headers.cookie || '');
    const authToken = cookies.token; // Extract the token cookie

    // Validate the token with the database
    const user = await DB.getUserByToken(authToken);
    if (!user) {
      // If invalid, terminate the connection
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
      return;
    }

    // Proceed with the WebSocket connection
    wss.handleUpgrade(request, socket, head, (ws) => {
      ws.user = user; // Attach user info to the WebSocket
      wss.emit('connection', ws, request);
    });
  });

  let connections = [];

  wss.on('connection', (ws) => {
    const connection = { id: ws.user._id, alive: true, ws }; // Use the user's ID as connection ID
    connections.push(connection);

    console.log(`WebSocket connection established for user: ${ws.user.email}`);

    // Handle messages from the client
    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data);

        if (message.type === 'new_comment') {
          const { eventId, comment } = message.payload;

          // Save the comment to the database
          await DB.addCommentToEvent(eventId, {
            user: ws.user.email, // Use the authenticated user's email
            comment: comment.comment.trim(),
            timestamp: comment.timestamp,
          });

          // Broadcast the new comment to other clients
          const broadcastMessage = JSON.stringify(message);
          connections.forEach((c) => {
            if (c.id !== connection.id) {
              c.ws.send(broadcastMessage);
            }
          });
        }
      } catch (err) {
        console.error('Error processing WebSocket message:', err.message);
      }
    });

    // Handle connection closure
    ws.on('close', () => {
      connections = connections.filter((c) => c.id !== connection.id);
      console.log(`WebSocket connection closed for user: ${ws.user.email}`);
    });

    // Handle pong to keep the connection alive
    ws.on('pong', () => {
      connection.alive = true;
    });
  });

  // Periodically check connection health
  setInterval(() => {
    connections.forEach((c) => {
      if (!c.alive) {
        c.ws.terminate();
        connections = connections.filter((conn) => conn.id !== c.id);
        console.log(`Terminated connection for user: ${c.id}`);
      } else {
        c.alive = false;
        c.ws.ping();
      }
    });
  }, 10000); // Ping every 10 seconds
}

module.exports = { peerProxy };