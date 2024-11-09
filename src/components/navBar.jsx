import React from 'react';
import '../design/app.scss'
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="navbar-left">
          <NavLink className="navbar-left__link" to="/">Home</NavLink>
          <NavLink className="navbar-left__link" to="/about">About Us</NavLink>
          <NavLink className="Navbar-left__link" to="/explore">Explore</NavLink>
          <NavLink className="navbar-left__link" to="/login">Log In</NavLink>
      </div>
      <div className="navbar-right">
        <img src="/media/logo.png" alt="logo" />
      </div>
    </div>
  );
};

export default Navbar;
