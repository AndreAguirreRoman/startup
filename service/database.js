const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const config = require('./dbConfig.json');
const { ObjectId } = require('mongodb');


const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url, { tls: true, serverSelectionTimeoutMS: 3000, autoSelectFamily: false, });
const db = client.db('startup');
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

async function deleteUser(email) {
    return await userCollection.deleteOne({ email });
  }

  async function createEvent(author, date, location, ageRestriction, genderRestriction, info, comments = []) {
    try {
    const event = {
    author,
    date: date || new Date().toISOString(),
    location,
    ageRestriction,
    genderRestriction,
    info,
    comments,
    attendance: [],
    attendanceCount: 0,
  };


  const result = await eventCollection.insertOne(event);

  return { ...event, _id: result.insertedId}; 
  } catch (err) {
    throw err; 
  }
}

function getEvents() {
    return eventCollection.find().toArray();
}
async function addCommentToEvent(eventId, comment) {
  const result = await eventCollection.updateOne(
    { _id: new ObjectId(eventId) },
    { $push: { comments: comment } }
  );

  if (result.matchedCount === 0) {
    throw new Error('Event not found');
  }

  return await getEventById(eventId); // Return the updated event
}

async function incrementAttendance(eventId) {
  const result = await eventCollection.updateOne(
    { _id: new ObjectId(eventId) },
    { $inc: { attendanceCount: 1 } }
  );

  if (result.matchedCount === 0) {
    throw new Error('Event not found');
  }

  return await getEventById(eventId); // Return the updated event
}


async function attendEvent(eventId, userId) {
  const event = await eventCollection.findOne({ _id: new ObjectId(eventId) });

  if (!event) {
    throw new Error('Event not found');
  }

  if (event.attendance.includes(userId)) {
    throw new Error('User already in the attendance list');
  }

  const result = await eventCollection.updateOne(
    { _id: new ObjectId(eventId) },
    {
      $push: { attendance: userId },
      $inc: { attendanceCount: 1 },
    }
  );

  if (result.modifiedCount === 0) {
    throw new Error('Failed to update attendance');
  }

  return { ...event, attendance: [...event.attendance, userId], attendanceCount: event.attendanceCount + 1 };
}

async function getEventById(eventId) {
  return await eventCollection.findOne({ _id: new ObjectId(eventId) });
}

module.exports = {
  getUser,
  getUserByToken,
  createUser,
  createEvent,
  getEvents,
  attendEvent,
  getEventById,
  deleteUser,
  incrementAttendance,
  addCommentToEvent,
  
};
