import '../design/app.scss';
import Dots from './dots'
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useMap
} from "@vis.gl/react-google-maps";
import EventModal from './eventModal';

const MapComponent = () => {

  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState("");
  const [events, setEvents] = useState([]);
  const [infoWindowOpen, setInfoWindowOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const defaultLocation = { lat: 40.2508, lng: -111.6493 };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({
          lat: parseFloat(latitude.toFixed(4)),
          lng: parseFloat(longitude.toFixed(4)),
        });
      },
      (error) => {
        setLocationError(`Error retrieving location: ${error.message}`);
        setLocation(defaultLocation);
        console.log(locationError)
      }
    );
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/event/all');
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);
  
  const handleMarkerClick = (pointKey) => {
    setInfoWindowOpen((prev) => (prev === pointKey ? null : pointKey));
    
  };

  const handleInfoClick = (key) => {
    setSelectedEventId(key); 
    setModalOpen(true); 
  } 

  const closeModal = () => {
    setModalOpen(false); 
    setSelectedEventId(null); 
  };

  const handleAddAttendance = async (eventId) => {
    try {
     
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event._id === eventId ? { ...event, isUpdating: true } : event
        )
      );
  
      const response = await fetch(`/api/event/${eventId}/attend`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to add attendance');
      }
  
      const updatedEvent = await response.json();
  
      
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event._id === updatedEvent._id
            ? { ...updatedEvent, isUpdating: false }
            : event
        )
      );
    } catch (err) {
      console.error('Error incrementing attendance:', err);
  
      
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event._id === eventId ? { ...event, isUpdating: false } : event
        )
      );
    }
  };

  console.log(events)

  return (
    <APIProvider apiKey={'AIzaSyBnOXew-3iQOkCV2EZWNKalALeOI2zoRjQ'}>
      <div className='map'>
        <Map defaultCenter={location || defaultLocation} defaultZoom={15} mapId={'6200dd9690f1dbd8'}>
        {events.map((point) => (
            <React.Fragment key={point._id}>
              <AdvancedMarker
                position={{ lat: point.location.lat, lng: point.location.lng }}
                onClick={() => handleMarkerClick(point._id)}
              >
              </AdvancedMarker>
              {infoWindowOpen === point._id && (
                <InfoWindow position={{ lat: point.location.lat, lng: point.location.lng }}>
                  <div>
                    <p>{point.info}</p>
                    <p>{point.date}</p>
                    <p>Attendance: {point.attendanceCount}</p>
                    <button onClick={() => handleInfoClick(point._id)}>View Event Details</button>
                    <button
                    onClick={() => handleAddAttendance(point._id)}
                    disabled={point.isUpdating}
                  >
                    {point.isUpdating ? 'Updating...' : 'Add Attendance'}
                  </button>
                  </div>
                </InfoWindow>
              )}
            </React.Fragment>
          ))}
        </Map>
        {modalOpen && selectedEventId && (
          <EventModal eventId={selectedEventId} onClose={closeModal} />
        )}
      </div>
    </APIProvider>
  );
}

export default MapComponent
