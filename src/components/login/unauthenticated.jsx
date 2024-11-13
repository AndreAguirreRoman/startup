// src/components/login/unauthenticated.js

import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';

export function Unauthenticated({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = (e) => {
    e.preventDefault();
    localStorage.setItem('userName', email);
    onLogin(email); // Call the onLogin function to update authentication state
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    localStorage.setItem('userName', email);
    onLogin(email); // Call the onLogin function to update authentication state
  };

  return (
    <div className="login-wrapper">
      <div className="login-logo">
        <img src="/public/logo.png" alt="Logo" />
      </div>
      <div className="login-box">
        <form>
          <div className="login-box__input">
            <input
              type="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="input-label">Email</div>
          </div>
          <div className="login-box__input">
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="input-label">Password</div>
          </div>
          <button
            className="login-box__button register-button"
            onClick={handleSignUp}
          >
            Sign Up
          </button>
          <button
            className="login-box__button login-button"
            onClick={handleSignIn}
          >
            Sign In
          </button>
          <div className="login-box__message">Not registered? Sign-up now!</div>
        </form>
      </div>
    </div>
  );
}
