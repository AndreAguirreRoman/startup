import React from 'react';
import Navbar from '../components/navBar';
import MapComponent from '../components/map';
import Footer from '../components/Footer';
import '../design/app.scss'

const Home = ({authState, userName, onLogout}) => {
  return (
    <div className="home">
      <Navbar authState={authState} userName={userName} onLogout={onLogout} />
      <MapComponent />
      <Footer />
    </div>
  );
};

export default Home