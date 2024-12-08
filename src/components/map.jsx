import '../design/app.scss';
import Dots from './dots'
import React, { useEffect, useState } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useMap
} from "@vis.gl/react-google-maps";


const MapComponent = () => {

  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState("");
  const [markers, setMarkers] = useState("")
  const [infoWindowOpen, setInfoWindowOpen] = useState(false);

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

  const points = [
    { lat: 40.2508, lng: -111.6493, key: "1", info: "Point 1 Info" },
    { lat: 40.2338, lng: -111.6585, key: "2", info: "Point 2 Info" },
    { lat: 40.2484, lng: -111.6435, key: "3", info: "Point 3 Info" },
  ];
  const handleMarkerClick = (pointKey) => {
    setInfoWindowOpen((prev) => (prev === pointKey ? null : pointKey));
  };

  return (
    <APIProvider apiKey={'AIzaSyBnOXew-3iQOkCV2EZWNKalALeOI2zoRjQ'}>
      <div className='map'>
        <Map defaultCenter={location || defaultLocation} defaultZoom={15} mapId={'6200dd9690f1dbd8'}>
        {points.map((point) => (
            <React.Fragment key={point.key}>
              <AdvancedMarker
                position={{ lat: point.lat, lng: point.lng }}
                onClick={() => handleMarkerClick(point.key)}
              >
              </AdvancedMarker>
              {infoWindowOpen === point.key && (
                <InfoWindow position={{ lat: point.lat, lng: point.lng }}>
                  <div>
                    <p>{point.info}</p>
                  </div>
                </InfoWindow>
              )}
            </React.Fragment>
          ))}
        </Map>
      </div>
    </APIProvider>
  );
}

export default MapComponent
