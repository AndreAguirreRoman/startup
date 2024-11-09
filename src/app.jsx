import React from 'react';
import Home from './pages/home';
import About from './pages/about';
import Explore from './pages/explore';
import Login from './pages/login';

import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';


function NotFound() {
  return <main className='container-fluid bg-secondary text-center'>404: Return to sender. Address unknown.</main>;
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path='/home' element={<Home/>} exact />
          <Route path='/about' element={<About/>} exact />
          <Route path='/explore' element={<Explore/>} exact />
          <Route path='/' element={<Login/>} exact />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
    
  );
}




