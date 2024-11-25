import React, {useEffect, useState} from 'react';
import '../design/app.scss';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthState } from './login/authState';
import Location from "./weather"
import EventForm from './eventCreation';



const Navbar = ({ onAuthChange }) => {

  
  const navigate = useNavigate();
  const [authState, setAuthState] = useState(AuthState.Unknown);
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {

    const storedUserName = localStorage.getItem("userFirstName");

    if (storedUserName) {
      setAuthState(AuthState.Authenticated); 
      setUserName(storedUserName);
    } else {
      setAuthState(AuthState.Unauthenticated);
    }
    setIsLoading(false);
  }, []);

  const logout = () => {
    fetch("api/auth/logout", {
      method: "DELETE",  headers: {
        "Content-Type": "application/json",
      },
    }).catch((error) => {
      console.error("Logout failed", error)
    }).finally(() =>{
      localStorage.removeItem("userName");
      onAuthChange && onAuthChange("", AuthState.Unauthenticated);
      navigate("/");
    });
  }

  if (isLoading) {
    return <div className="navbar">Loading...</div>;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      console.log("Location Retrieved:", position.coords);
    },
    (error) => {
      console.error("Error retrieving location:", error);
    }
  );


  return (
    <div className="navbar">
      <div className="navbar-left">
        <NavLink className="navbar-left__link" to="/home">Home</NavLink>
        <NavLink className="navbar-left__link" to="/about">About Us</NavLink>
        <NavLink className="navbar-left__link" to="/explore">Explore</NavLink>
        {authState === AuthState.Authenticated ? (
          <NavLink className="navbar-left__link" onClick={logout}>Log Out</NavLink>
        ) : (
          <NavLink className="navbar-left__link"  onClick={() => console.log("Navigating to /")} to="/">Log In</NavLink>
        )}
      </div>
      <div className="navbar-right">
      <button onClick={() => setShowModal(true)}>Create Event</button>
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <button className="modal-close" onClick={() => setShowModal(false)}>
                &times;
              </button>
              <EventForm />
            </div>
          </div>
        )}

        {authState === AuthState.Authenticated && userName && (
          <div className='navbar-right__user'>Welcome, {userName}!</div>
        )}
        <Location className="navbar-right__weather" />
        
        <img className='navbar-right__logo' src='logo.png'></img>
      </div>
    </div>
  );
};

export default Navbar;
