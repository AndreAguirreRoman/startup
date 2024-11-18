import React, { useEffect, useState } from 'react';
import '../design/app.scss'

const Map = () => {

  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState("");

  const defaultLocation = {latitude: 40.2508, longitude: -111.6493}
  useEffect(() => {
    // Fetch user location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
      },
      (error) => {
        setLocationError(`Error retrieving location: ${error.message}`);
        setLocation(defaultLocation)
      }
    );
  }, []);

  useEffect(() => {
    if (location) {
    const initMap = () => {
      const map = new window.google.maps.Map(document.querySelector('.map'), {
        zoom: 15,
        center: {lat: location.latitude, lng: location.longitude},
      });
      new window.google.maps.Marker({
        position: {lat: location.latitude, lng: location.longitude},
        map: map,
      });
    };

    // Load Google Maps API script
    if (!window.google || !window.google.maps) {
      const script = document.createElement('script');
      script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDGxwwnttHrOURlTcwO4AKLZSlPXhCAaOI";
      script.async = true;
      script.defer = true;
      script.onload = () => initMap();
      document.body.appendChild(script);
    } else {
      initMap();
    }
  }
}, [location]);

  return <div className="map"/>;
};

export default Map;
