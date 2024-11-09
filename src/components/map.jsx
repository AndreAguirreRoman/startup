import React, { useEffect } from 'react';
import '../design/app.scss'

const Map = () => {
  useEffect(() => {
    const initMap = () => {
      const location = { lat: 40.2518, lng: -111.64493 };
      const map = new window.google.maps.Map(document.querySelector('.map'), {
        zoom: 15,
        center: location,
      });
      new window.google.maps.Marker({
        position: location,
        map: map,
      });
    };

    // Load Google Maps API script
    const script = document.createElement('script');
    script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDGxwwnttHrOURlTcwO4AKLZSlPXhCAaOI&callback=initMap";
    script.async = true;
    script.defer = true;
    script.setAttribute("loading", "lazy")

    document.body.appendChild(script);
    window.initMap = initMap;
  }, []);

  return <div className="map"/>;
};

export default Map;
