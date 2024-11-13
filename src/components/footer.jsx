import React from 'react';
import '../design/app.scss'

const Footer = ({className}) => {
    return (
        <div className="footer">
            <div className="footer-text">Andre Aguirre</div>
            <div className="footer-text-logo">
                <a href="https://github.com/AndreAguirreRoman/startup.git">
                <img src="/public/github-mark.png" alt="GitHub" className="footer-text-logo__l"/>
                </a>
                <a className="footer-text-logo__text" href="https://github.com/AndreAguirreRoman/startup.git"> Github</a>
            </div>
        </div>
    );
};

export default Footer;