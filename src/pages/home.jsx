import React from 'react';
import Navbar from '../components/Navbar';
import Map from '../components/Map';
import Footer from '../components/Footer';
import '../design/app.scss'

const Home = () => {
  return (
    <div className="home">
      <Navbar />
      <Map />
      <Footer />
    </div>
  );
};

export default Home;