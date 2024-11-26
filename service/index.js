const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const express = require('express');
const app = express();
const DB = require('./database.js');

const authCookieName = 'token';
const port = process.argv.length > 2 ? process.argv[2] : 4000;


app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));
app.set('trust proxy', true);

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).send({ msg: 'Unauthorized' });
  }

  const user = Object.values(users).find((u) => u.token === token);
  if (!user) {
    return res.status(403).send({ msg: 'Forbidden' });
  }

  req.user = user;
  next();
}

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

secureApiRouter.post('/event/rsvp/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const event = await DB.attendEvent(id, req.user.email);
    res.status(200).send(event);
  } catch (err) {
    res.status(400).send({ error: err.message });
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
