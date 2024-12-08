const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const express = require('express');
const app = express();
const DB = require('./database.js');
require('dotenv').config();
const { WebSocketServer } = require('ws');

console.log(process.env)

const authCookieName = 'token';
const port = process.argv.length > 2 ? process.argv[2] : 4000;


const wss = new WebSocketServer({ noServer: true });
const connections = [];

// Ping-pong mechanism to keep connections alive
const interval = setInterval(() => {
  connections.forEach((connection) => {
    if (!connection.alive) {
      connection.ws.terminate();
    } else {
      connection.alive = false;
      connection.ws.ping();
    }
  });
}, 10000); // Every 10 seconds

wss.on('connection', (ws) => {
  console.log('New WebSocket connection established');

  const connection = { ws, alive: true };
  connections.push(connection);

  // Respond to pong messages
  ws.on('pong', () => {
    connection.alive = true;
  });

  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);
      console.log('WebSocket message received:', data);

      if (data.type === 'comment') {
        const { eventId, comment } = data.payload;
        const user = data.user || "Anonymous";

        // Save comment to database
        const updatedEvent = await DB.addCommentToEvent(eventId, {
          user,
          comment: comment.trim(),
          timestamp: new Date(),
        });

        // Broadcast new comment to all connected clients
        const broadcastMessage = JSON.stringify({
          type: 'comment',
          payload: {
            eventId,
            comment: {
              user,
              comment: comment.trim(),
              timestamp: new Date(),
            },
          },
        });

        connections.forEach((client) => {
          if (client.ws.readyState === ws.OPEN) {
            client.ws.send(broadcastMessage);
          }
        });
      }
    } catch (err) {
      console.error('Error handling WebSocket message:', err.message);
    }
  });

  ws.on('close', () => {
    const index = connections.indexOf(connection);
    if (index > -1) {
      connections.splice(index, 1);
    }
    console.log('WebSocket connection closed');
  });
});

// Clean up interval on server close
wss.on('close', () => {
  clearInterval(interval);
});

// HTTP Server Integration
const server = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});


app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));
app.set('trust proxy', true);

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

var apiRouter = express.Router();
app.use(`/api`, apiRouter);

apiRouter.get('/weather', async (req, res) => {
  const { lat, lon } = req.query;
  const apiUrl = `https://dragon.best/api/glax_weather.json?lat=${lat}&lon=${lon}&units=metric`;

  try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      res.json(data);
  } catch (error) {
      console.error("Error fetching weather data:", error.message);
      res.status(500).send({ msg: 'Failed to fetch weather data' });
  }
});



apiRouter.post('/auth/create', async (req, res) => {
  if (await DB.getUser(req.body.email)) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const user = await DB.createUser(
      req.body.email,
      req.body.password,
      req.body.firstName,
      req.body.lastName,
    );
    console.log("token:", user.token)
    setAuthCookie(res, user.token);

    res.send({
      id: user._id,
      token: user.token,
    });
  }
});


//  apiRouter.post('/auth/login', async (req, res) => {
//    const user = await DB.getUser(req.body.email);
//    if (user) {
//      if (await bcrypt.compare(req.body.password, user.password)) {
//        setAuthCookie(res, user.token);
//        res.send({ id: user._id });`
//        return;
//      }
//    }
//    res.status(401).send({ msg: 'Unauthorized' });
//  });

apiRouter.post('/auth/login', async (req, res) => {
  const user = await DB.getUser(req.body.email);

  if (user) {
    console.log('User found:', user); // Debugging log
    const passwordMatch = await bcrypt.compare(req.body.password, user.password);
    console.log('Password Match:', passwordMatch); // Debugging log

    if (passwordMatch) {
      setAuthCookie(res, user.token);
      res.send({ id: user._id, token: user.token });
      return;
    }
  } else {
    console.log('User not found:', req.body.email); // Debugging log
  }

  res.status(401).send({ msg: 'Unauthorized' });
});

apiRouter.delete('/auth/logout', (_req, res) => {
  res.clearCookie(authCookieName);
  res.status(204).end();
});

apiRouter.get('/auth/users', (req, res) => {
  const userList = Object.values(users).map(({ password, ...user }) => user);
  res.send(userList);
});

const secureApiRouter = express.Router();
apiRouter.use(secureApiRouter);

secureApiRouter.use(async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const authToken = authHeader?.split(' ')[1] || req.cookies[authCookieName];
  const user = await DB.getUserByToken(authToken);
  console.log("Auth token received:", authToken);
  
  if (user) {
    req.user = user;
    console.log(req.user);
    next();
  } else {
    res.status(401).send({msg: 'Unauthorized'});
  }
});

secureApiRouter.delete('/auth/deleteAccount', async (req, res) => {
  try {
    const result = await DB.deleteUser(req.user.email); // Delete user by email
    if (result.deletedCount > 0) {
      res.clearCookie(authCookieName); // Clear the auth cookie
      res.status(200).send({ msg: 'Account deleted successfully' });
    } else {
      res.status(404).send({ msg: 'User not found' });
    }
  } catch (err) {
    res.status(500).send({ error: 'Failed to delete account' });
  }
});

secureApiRouter.post('/event/create', async (req, res) => {
  const { date, location, ageRestriction, genderRestriction, info } = req.body;
  
  try {
    const event = await DB.createEvent(
      req.user.email,
      date,
      location,
      ageRestriction,
      genderRestriction,
      info
    );
    res.status(201).send(event);
  } catch (err) {
    console.log(req.user);
    console.error('Error in createEvent:', err);
    res.status(500).send({ error: 'Failed to create event', details: err.message });
  }
});

secureApiRouter.get('/event/all', async (_req, res) => {
  try {
    const events = await DB.getEvents();
    res.status(200).send(events);
  } catch (err) {
    res.status(500).send({ error: 'Failed to fetch events' });
  }
});

secureApiRouter.get('/event/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const event = await DB.getEventById(id); 
    if (!event) {
      return res.status(404).send({ error: 'Event not found' });
    }
    res.status(200).send(event);
  } catch (err) {
    console.error('Error fetching event:', err);
    res.status(500).send({ error: 'Failed to fetch event', details: err.message });
  }
});



secureApiRouter.post('/event/:id/comments', async (req, res) => {
  const { id } = req.params; // Event ID
  const { comment } = req.body;

  if (!comment || comment.trim() === '') {
    return res.status(400).send({ error: 'Comment cannot be empty' });
  }

  try {
    const updatedEvent = await DB.addCommentToEvent(id, {
      user: req.user.email,
      comment: comment.trim(),
      timestamp: new Date(),
    });
    res.status(201).send(updatedEvent);
  } catch (err) {
    console.error('Error adding comment:', err);
    res.status(500).send({ error: 'Failed to add comment', details: err.message });
  }
});

// Fetch comments for an event
secureApiRouter.get('/event/:id/comments', async (req, res) => {
  const { id } = req.params;

  try {
    const comments = await DB.getEventComments(id);
    res.status(200).send(comments);
  } catch (err) {
    console.error('Error fetching comments:', err);
    res.status(500).send({ error: 'Failed to fetch comments', details: err.message });
  }
});


// Increment attendance for an event
secureApiRouter.post('/event/:id/attend', async (req, res) => {
  const { id } = req.params;

  try {
    const updatedEvent = await DB.incrementAttendance(id);
    res.status(200).send(updatedEvent); // Send updated event
  } catch (err) {
    console.error('Error incrementing attendance:', err);
    res.status(500).send({ error: 'Failed to increment attendance', details: err.message });
  }
});

// Get the current attendance count for an event
secureApiRouter.get('/event/:id/attendance', async (req, res) => {
  const { id } = req.params;

  try {
    const event = await DB.getEventById(id);
    if (!event) {
      return res.status(404).send({ error: 'Event not found' });
    }
    res.status(200).send({ attendance: event.attendance });
  } catch (err) {
    console.error('Error fetching attendance:', err);
    res.status(500).send({ error: 'Failed to fetch attendance', details: err.message });
  }
});



app.use(function (err, req, res, next) {
  res.status(500).send({ type: err.name, message: err.message });
});

function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}