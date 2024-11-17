import React, {useEffect, useState} from 'react';
import '../design/app.scss';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthState } from './login/authState';



const Navbar = ({ onAuthChange }) => {

  const navigate = useNavigate();
  const [authState, setAuthState] = useState(AuthState.Unknown);
  const [userName, setUserName] = useState("");

  useEffect(() => {

    const storedUserName = localStorage.getItem("userName");

    if (storedUserName) {
      setAuthState(AuthState.Authenticated); 
      setUserName(storedUserName);
    } else {
      setAuthState(AuthState.Unauthenticated);
    }
  }, []);

  const logout = () => {
    fetch("api/auth/logout", {
      method: "delete",
    }).catch((error) => {
      console.error("Logout failed", error)
    }).finally(() =>{
      localStorage.removeItem("userName")
      setAuthState(AuthState.Unauthenticated);
      setUserName("");
      onAuthChange && onAuthChange("", AuthState.Unauthenticated);
      navigate("/");
    });
  }


  return (
    <div className="navbar">
      <div className="navbar-left">
        <NavLink className="navbar-left__link" to="/home">Home</NavLink>
        <NavLink className="navbar-left__link" to="/about">About Us</NavLink>
        <NavLink className="navbar-left__link" to="/explore">Explore</NavLink>
        {authState === AuthState.Authenticated ? (
          <button className="navbar-left__link" onClick={logout}>Log Out</button>
        ) : (
          <NavLink className="navbar-left__link" to="/">Log In</NavLink>
        )}
      </div>
      <div className="navbar-right">
        <img src="/logo.png" alt="logo" />
        {authState === AuthState.Authenticated && userName && (
          <span>Welcome, {userName}!</span>
        )}
      </div>
    </div>
  );
};

export default Navbar;
