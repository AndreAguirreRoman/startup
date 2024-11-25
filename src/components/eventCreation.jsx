import React, {useEffect, useState} from 'react';
import '../design/app.scss';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthState } from './login/authState';

const EventForm = () => {
  const getCurrentDateTime = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000; // Offset in milliseconds
    const localISOTime = new Date(now.getTime() - offset).toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:MM
    return localISOTime;
  };

    const [formData, setFormData] = useState({
        date: getCurrentDateTime(),
        street: "",
        city: "",
        state: "",
        ageRestriction: "none",
        genderRestriction: "none",
        info: ""
    });

    const [responseMessage, setResponseMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev => ({...prev, [name]:value})));
    }

    

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResponseMessage("");

        const address = `${formData.street}, ${formData.city}, ${formData.state}`;
        const location = await fetchGeocoding(address);
        if (!location) {
          setResponseMessage("Failed to retrieve location. Please try again.");
          setLoading(false);
          return;
        }

        const eventData = {
          date: formData.date,
          location,
          ageRestriction: formData.ageRestriction,
          genderRestriction: formData.genderRestriction,
          info: formData.info,
        };
        
        setLoading(false);
      
        await createEvent(
          "/api/event/create",
          eventData,
          (data) => {
            setResponseMessage("Event created successfully!");
            console.log("Event Created:", data);
            setLoading(false);
          },
          (error) => {
            setResponseMessage(error);
            console.error("Error Creating Event:", error);
            setLoading(false);
          }
        );
        
    }

    const fetchGeocoding = async (address) => {
      try {
        const apiKey = "AIzaSyDGxwwnttHrOURlTcwO4AKLZSlPXhCAaOI";
        const endpoint = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          address
        )}&key=${apiKey}`;
  
        const response = await fetch(endpoint);
        const data = await response.json();
  
        if (data.status === "OK" && data.results.length > 0) {
          const { lat, lng } = data.results[0].geometry.location;
          return { lat, lng };
        } else {
          console.error("Geocoding API Error:", data.status);
          return null;
        }
      } catch (error) {
        console.error("Failed to fetch geocoding data:", error);
        return null;
      }
    };

    const createEvent = async (endpoint, eventData, onSuccess, onError) => {
        try {
          const token = localStorage.getItem("authToken");
    
          const response = await fetch(endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json; charset=UTF-8",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(eventData),
          });
    
          if (response.ok) {
            const data = await response.json();
            onSuccess(data);
          } else {
            const errorData = await response.json();
            onError(`Error: ${errorData.error || errorData.details}`);
          }
        } catch (error) {
          onError(`Network error: ${error.message}`);
        }
    };

    return (
        <div>
          <h2>Create Event</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="date">Event Date:</label>
              <input
                type="datetime-local"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
    

            <div>
              <label htmlFor="street">street:</label>
                <input
                  type="text"
                  id="street"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  required
                />
            </div>
            <div>
              <label htmlFor="city">city:</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
            </div>
            <div>
              <label htmlFor="state">state:</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                />
            </div>
    
            <div>
              <label htmlFor="ageRestriction">Age Restriction:</label>
              <input
                type="text"
                id="ageRestriction"
                name="ageRestriction"
                value={formData.ageRestriction}
                onChange={handleChange}
              />
            </div>
    
            <div>
              <label htmlFor="genderRestriction">Gender Restriction:</label>
              <select
                type="text"
                id="genderRestriction"
                name="genderRestriction"
                value={formData.genderRestriction}
                onChange={handleChange}
              >
                <option value={"none"}>None</option>
                <option value={"male"}>Only male</option>
                <option value={"female"}>Only women</option>
              </select>
            </div>
    
            <div>
              <label htmlFor="info">Event Info:</label>
              <textarea
                id="info"
                name="info"
                value={formData.info}
                onChange={handleChange}
                required
              />
            </div>
    
            <button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Event"}
            </button>
          </form>
    
          {responseMessage && <p>{responseMessage}</p>}
        </div>
    );
};

export default EventForm;