const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('simon');
const userCollection = db.collection('user');
const eventCollection = db.collection('event');


(async function testConnection() {
  await client.connect();
  await db.command({ ping: 1 });
})().catch((ex) => {
  console.log(`Unable to connect to database with ${url} because ${ex.message}`);
  process.exit(1);
});

function getUser(email) {
  return userCollection.findOne({ email: email });
}

function getUserByToken(token) {
  return userCollection.findOne({ token: token });
}

async function createUser(email, password, firstName, lastName) {
  // Hash the password before we insert it into the database
  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    email: email,
    password: passwordHash,
    firstName: firstName,
    lastName: lastName,
    token: uuid.v4(),
  };
  await userCollection.insertOne(user);

  return user;
}

async function createEvent(author, date, location, ageRestriction, genderRestriction, info, comments = []) {
  const event = {
    author,
    date,
    location,
    ageRestriction,
    genderRestriction,
    info,
    comments,
    attendance: [],
    attendanceCount: 0,
  };
  await eventCollection.insertOne(event);
  return event;
}

function getEvents() {
    return eventCollection.find().toArray();
}

async function attendEvent(eventId, userId) {
    const event = await eventCollection.findOne({_id: eventId});
    if (event.attendance.includes(userId)) {
        throw new Error("Already in the list.")
    }

    await eventCollection.updateOne({eventId},
        {
            $push: {attendance: userId},
            $inc: {attendanceCount: 1},
        }
    );
}



function getHighScores() {
  const query = { score: { $gt: 0, $lt: 900 } };
  const options = {
    sort: { score: -1 },
    limit: 10,
  };
  const cursor = scoreCollection.find(query, options);
  return cursor.toArray();
}

module.exports = {
  getUser,
  getUserByToken,
  createUser,
  createEvent,
  getHighScores,
};
