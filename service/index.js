const express = require('express');
const uuid = require('uuid');
const app = express();


const port = process.argv.length > 2 ? process.argv[2] : 4000;

const users = {};
let events = [];
let scores = {};

app.use(express.json());
app.use(express.static('public'));

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
  const { email, password, firstName, lastName } = req.body;
  if (!email || !password || !firstName || !lastName) {
    return res.status(400).send({ msg: 'Missing required fields.' });
  }

  const user = users[email];
  if (user) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const newUser = {
      email,
      password,
      firstName,
      lastName,
      token: uuid.v4(),
    };
    users[email] = newUser;

    res.send({ token: newUser.token });
  }
});


apiRouter.post('/auth/login', async (req, res) => {
  try {
    const user = users[req.body.email];
    if (user && req.body.password === user.password) {
      user.token = uuid.v4();
      return res.send({ token: user.token });
    }
    res.status(401).send({ msg: 'Unauthorized' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: 'An error occurred' });
  }
});

apiRouter.delete('/auth/logout', (req, res) => {
  const user = Object.values(users).find((u) => u.token === req.body.token);
  if (user) {
    delete user.token;
  }
  res.status(204).end();
});

apiRouter.get('/auth/users', (req, res) => {
  const userList = Object.values(users).map(({ password, ...user }) => user);
  res.send(userList);
});


apiRouter.post('/event/create', authenticateToken, (req, res) => {
  events = updateEvents(req.body, scores);
  res.send(events);
});

// Event Update Function
function updateEvents(eventData, scores) {
  const event = {
    id: uuid.v4(),
    name: eventData.name,
    date: eventData.date || new Date(),
    details: eventData.details || "",
  };

  events.push(event);
  return events;
}

app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});