// src/components/login/unauthenticated.js

import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';

export function Unauthenticated({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSignUpMode, setIsSignUpMode] = useState(false);

  const validateInput = () => {
    if (!email || !password || (isSignUpMode && (!firstName || !lastName))) {
      setErrorMessage('Please fill in all fields.');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  async function loginUser() {
    loginOrCreate(`/api/auth/login`, false);
  }

  async function createUser() {
    if (!validateInput()) return;
    loginOrCreate(`/api/auth/create`, true);
  }

  async function loginOrCreate(endpoint, isSignup) {
    const payload = isSignup
      ? { email, password, firstName, lastName }
      : { email, password };

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
          },
        });
    if (response.status === 200) {
      const data = await response.json();
      localStorage.setItem('userEmail', email);
      if (isSignup) {
        localStorage.setItem('userFirstName', firstName); // Save first name during sign-up
      }
      onLogin(isSignup ? firstName : email);
    } else {
      const body = await response.json();
      setDisplayError(`Error: ${body.msg}`);
    }
   } catch (error) {
    setErrorMessage("No account found! Please Sign-up", error)
   }
  }

  return (
    <div className="login-wrapper">
      <div className="login-logo">
        <img src="/logo.png" alt="Logo" />
      </div>
      <div className="login-box">
        <form onSubmit={(e) => e.preventDefault()}>
          {/* Email Input */}
          <div className="login-box__input">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="input-label">Email</div>
          </div>

          {/* Password Input */}
          <div className="login-box__input">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="input-label">Password</div>
          </div>

          {/* Conditionally Render First Name and Last Name for Sign Up */}
          {isSignUpMode && (
            <>
              <div className="login-box__input">
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <div className="input-label">First Name</div>
              </div>
              <div className="login-box__input">
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                <div className="input-label">Last Name</div>
              </div>
            </>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="input-label__error" style={{ color: 'red' }}>
              {errorMessage}
            </div>
          )}

          <div>
            {/* Conditionally Render Sign Up or Sign In Buttons */}
            {isSignUpMode ? (
              <Button
                className="login-box__button register-button"
                onClick={createUser}
                disabled={!email || !password || !firstName || !lastName}
              >
                Sign Up
              </Button>
            ) : (
              <Button
                className="login-box__button login-button"
                onClick={loginUser}
                disabled={!email || !password}
              >
                Sign In
              </Button>
            )}
          </div>

          {/* Toggle Between Sign In and Sign Up */}
          <div className="login-box__message">
            {isSignUpMode ? (
              <span onClick={() => setIsSignUpMode(false)} style={{ cursor: 'pointer', color: '#007bff' }}>
                Already registered? Log in now!
              </span>
            ) : (
              <span onClick={() => setIsSignUpMode(true)} style={{ cursor: 'pointer', color: '#007bff' }}>
                Not registered? Sign-up now!
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
