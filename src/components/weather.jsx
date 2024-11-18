import React, { useState, useEffect} from "react";
import "../design/app.scss";

const Location = ({className}) => {
    const [location, setLocation] = useState(null);
    const [locationError, setLocationError] = useState("");
    const [weather, setWeather] = useState(null);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) =>{
            const { latitude, longitude } = position.coords;
            setLocation({latitude, longitude});
            fetchWeather(latitude, longitude);

        }, (error) => {
            setLocationError("Error retrieving location", error.message);
        });
    }, []);

    const fetchWeather = async (latitude, longitude) => {
        try {
            const response = await fetch(`/api/weather?lat=${latitude}&lon=${longitude}`);
            if (response.ok) {
                const data = await response.json();
                setWeather(data);
            } else {
                console.error("Weather API response error:", response.statusText);
            }
        } catch (error) {
            console.error("Error fetching weather:", error.message);
        }
    };
    


      

if (locationError) {
    return <p>{locationError}</p>;
  }

  if (!location || !weather) {
    return <p>Loading</p>;
  }
    if (location) {
        return (
            <div className={`${className} weather`}>
                <div className="weather-left">
                    <div className="weather-left__temp">{weather.temperature}°{weather.temperature_unit}</div>
                </div>
                <div className="weather-right">
                    <div className="weather-right__city">{weather.city}</div>
                    <div className="weather-right__humidity">Humidity {weather.humidity}%</div>
                </div>
            </div>
        )
    }
}

export default Location;