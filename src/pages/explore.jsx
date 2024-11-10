import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../design/app.scss';

const Explore = ({ authState, userName, onLogout }) => {
  return (
    <div className="body">
        <Navbar className="body__navbar" authState={authState} userName={userName} onLogout={onLogout} />
      <div className="body-header">
        <h1>Hot Events Happening</h1>
        <p>Discover the most exciting events happening right now! Don't miss out on the fun.</p>
      </div>

      <div className="body-form__wrapper">
        <div className="body-form">
          <h2>Add Yours</h2>
          <p>
            Want to host your own event? <a href="main.html">Click here to create an event (this will be a popup window in the same page)</a> and get the word out!
          </p>
          <form action="submitEvent.html" method="post">
            <label htmlFor="location">Location:</label>
            <input type="text" id="location" name="location" required placeholder="Address" />

            <label htmlFor="ageLimit">Age Limitations:</label>
            <input type="text" id="ageLimit" name="ageLimit" placeholder="18+" />

            <label htmlFor="gender">Gender:</label>
            <select id="gender_selector" name="gender">
              <option value="all">All Genders</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </form>
        </div>

        <div className="body-form__vote">
          <h2>Vote for Your Favorite Event</h2>
          <p>Which event are you going to this weekend? Vote below:</p>
          <form>
            <input type="radio" id="event1" name="event" value="event1" />
            <label htmlFor="event1">Event 1</label><br />
            <input type="radio" id="event2" name="event" value="event2" />
            <label htmlFor="event2">Event 2</label><br />
            <input type="radio" id="event3" name="event" value="event3" />
            <label htmlFor="event3">Event 3</label><br /><br />
            <input type="submit" value="Vote" />
          </form>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default Explore;
