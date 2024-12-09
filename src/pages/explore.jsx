import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EventModal from '../components/eventModal';
import '../design/app.scss';

const Explore = ({ authState, userName, onLogout }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [addresses, setAddresses] = useState({}); // State for resolved addresses

  useEffect(() => {
    fetch('/api/event/all', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        return response.json();
      })
      .then(async (data) => {
        setEvents(data);
        setLoading(false);

        const addressPromises = data.map(async (event) => {
          const address = await reverseGeocode(event.location.lat, event.location.lng);
          return { id: event._id, address };
        });

        const resolvedAddresses = await Promise.all(addressPromises);
        const addressMap = resolvedAddresses.reduce((acc, { id, address }) => {
          acc[id] = address;
          return acc;
        }, {});
        setAddresses(addressMap);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  console.log(events)
  const reverseGeocode = async (lat, lng) => {
    const apiKey = 'AIzaSyBnOXew-3iQOkCV2EZWNKalALeOI2zoRjQ';
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch address');
      }
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        return data.results[0].formatted_address;
      } else {
        return 'Address not found';
      }
    } catch (error) {
      console.error('Error:', error.message);
      return 'Address not found';
    }
  };

  return (
    <div className="explore__wrapper">
      <Navbar className="body__navbar" authState={authState} userName={userName} onLogout={onLogout} />
      <div className="body-explore">
        <div className="body-header">
          <h1>Hot Events Happening</h1>
          <p>Discover the most exciting events happening right now! Don't miss out on the fun.</p>
        </div>

        <div className="body-events__wrapper">

          {loading && <p>Loading events...</p>}
          {error && <p className="error">Error: {error}</p>}
          {!loading && !error && (

            <div className="body-events__wrapper-events">

              {events.map((event) => (
                <div key={event._id} className="body-events__wrapper-events__card">
                  <div className='title'><h2 className='title-text'>{event.info}</h2></div>
                  
                  <p><strong>Date:</strong> {new Date(event.date).toLocaleString()}</p>
                  <p><strong>Address:</strong> {addresses[event._id] || 'Fetching address...'}</p>
                  <p><strong>Attending</strong>: {event.attendanceCount}</p>
                  <button
                    className="body-event__button button"
                    onClick={() => setSelectedEventId(event._id)}
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {selectedEventId && (
        <EventModal
          eventId={selectedEventId}
          onClose={() => setSelectedEventId(null)}
        />
      )}
      <Footer />
    </div>
  );
};

export default Explore;
