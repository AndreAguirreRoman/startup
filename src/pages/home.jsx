import React from 'react';
import Navbar from '../components/Navbar';
import Map from '../components/Map';
import Footer from '../components/Footer';
import '../design/app.scss'

const Home = ({authState, userName, onLogout}) => {
  return (
    <div className="home">
      <Navbar authState={authState} userName={userName} onLogout={onLogout} />
      <Map />
      <Footer />
    </div>
  );
};

export default Home;