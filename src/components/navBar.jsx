import React from 'react';
import '../design/app.scss';
import { NavLink } from 'react-router-dom';
import { AuthState } from './login/authState';

const Navbar = ({ authState, userName, onLogout }) => {
  return (
    <div className="navbar">
      <div className="navbar-left">
        <NavLink className="navbar-left__link" to="/home">Home</NavLink>
        <NavLink className="navbar-left__link" to="/about">About Us</NavLink>
        <NavLink className="navbar-left__link" to="/explore">Explore</NavLink>
        {authState === AuthState.Authenticated ? (
          <button className="navbar-left__link" onClick={onLogout}>Log Out</button>
        ) : (
          <NavLink className="navbar-left__link" to="/">Log In</NavLink>
        )}
      </div>
      <div className="navbar-right">
        <img src="/logo.png" alt="logo" />
      </div>
    </div>
  );
};

export default Navbar;
