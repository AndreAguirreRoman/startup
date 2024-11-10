import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../design/app.scss';

const About = ({ authState, userName, onLogout }) => {
    return (
        <div className="body">
            <Navbar className="body__navbar" authState={authState} userName={userName} onLogout={onLogout} />

            <div className="body-text">

                <div className="body-text__header">
                    <h1> About Us!</h1>
                </div>
                <div className="body-text__content">
                    <p>Have you ever missed out on having an <span className="body-text__content-highlight">exciting Friday night</span> simply because your friends are out of town? Have you ever felt like there is nothing going on around town?</p>
            
                    <p>This tool will help <span className="body-text__content-highlight">YOU!</span> You are part of the people who are constantly looking for new and exciting experiences.</p>
                    
                    <p>With this app, you'll never miss an event again. There are <span className="body-text__content-highlight">hundreds of events happening every day</span> in your area, and now there is a place where you can find and create those events.</p>
                    
                    <p>Empower your <span className="body-text__content-highlight">football night, game night,</span> and party with exposure to thousands of people eager to <span className="highlight">JOIN!</span></p>
                    
                    <p>No more boring weekends! Remember, <span className="body-text__content-highlight">your night, your rules.</span> You will have the option to choose what to do!</p>

                </div>
                
            </div>
            <Footer className="body__footer"/>        
            
        
        </div>
    )
}

export default About;