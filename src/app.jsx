import React, { useState } from 'react';
import Home from './pages/home';
import About from './pages/about';
import Explore from './pages/explore';
import Login from './pages/login';
import Event from './pages/event';
import { AuthState } from './components/login/authState';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import ChatLogin from './pages/chat';

function NotFound() {
  return <main className='container-fluid bg-secondary text-center'>404: Return to sender. Address unknown.</main>;
}

export default function App() {
  const [userName, setUserName] = useState(localStorage.getItem('userName') || '');
  const [authState, setAuthState] = useState(
    userName ? AuthState.Authenticated : AuthState.Unauthenticated
  );

  const handleAuthChange = (name, newAuthState) => {
    if (newAuthState === AuthState.Unauthenticated) {
      localStorage.removeItem('userName'); 
    } else {
      localStorage.setItem('userName', name); 
    }

    setUserName(name);
    setAuthState(newAuthState);
  };

  console.log("Auth state", authState)
  console.log("Username", userName);

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              authState === AuthState.Authenticated ? (
                <Navigate to="/home" replace authState={authState} userName={userName} onLogout={() => handleAuthChange('', AuthState.Unauthenticated)}/>
              ) : (
                <Login onAuthChange={handleAuthChange} userName={userName} authState={authState}  />
              )
            }
          />
          <Route
            path="/home"
            element={<Home authState={authState} userName={userName} onLogout={() => handleAuthChange('', AuthState.Unauthenticated)} />}
            exact
          />
          <Route
            path="/about"
            element={<About authState={authState} userName={userName} onLogout={() => handleAuthChange('', AuthState.Unauthenticated)} />}
            exact
          />
          <Route
            path="/explore"
            element={<Explore authState={authState} userName={userName} onLogout={() => handleAuthChange('', AuthState.Unauthenticated)} />}
            exact
          />
          <Route path="/event"
            element={<Event authState={authState} userName={userName} onLogout={() => handleAuthChange('', AuthState.Unauthenticated)} />}
            exact
          />
          <Route path="/chat"
            element={<ChatLogin authState={authState} userName={userName} onLogout={() => handleAuthChange('', AuthState.Unauthenticated)} />}
            exact
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
