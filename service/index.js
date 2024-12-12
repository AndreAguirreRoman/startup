const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const express = require('express');
const app = express();
const DB = require('./database.js');
const authCookieName = 'token';

const port = process.argv.length > 2 ? process.argv[2] : 4000;

const { peerProxy } = require('./peerProxy.js');
app.use(express.static('./public'));


app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));
app.set('trust proxy', true);

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




apiRouter.post('/auth/login', async (req, res) => {
  const user = await DB.getUser(req.body.email);

  if (user) {
    console.log('User found:', user); 
    const passwordMatch = await bcrypt.compare(req.body.password, user.password);
    console.log('Password Match:', passwordMatch); 

    if (passwordMatch) {
      setAuthCookie(res, user.token);
      res.send({ id: user._id, token: user.token });
      return;
    }
  } else {
    console.log('User not found:', req.body.email); 
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
    const result = await DB.deleteUser(req.user.email); 
    if (result.deletedCount > 0) {
      res.clearCookie(authCookieName); 
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
  const { id } = req.params; 
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




secureApiRouter.post('/event/:id/attend', async (req, res) => {
  const { id } = req.params;

  try {
    const updatedEvent = await DB.incrementAttendance(id);
    res.status(200).send(updatedEvent); 
  } catch (err) {
    console.error('Error incrementing attendance:', err);
    res.status(500).send({ error: 'Failed to increment attendance', details: err.message });
  }
});


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

const httpService = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
peerProxy(httpService);