import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../design/app.scss';

const Login = () => {
    const navigate = useNavigate()
  
    const handleSubmit = (e) => {
      e.preventDefault();
      navigate('/home'); 
    };
    return (
        <div className="login-wrapper">

            
            <div className="login-logo">
                <img src="/media/logo.png" alt="Logo" />
            </div>
            <div className="login-box">
                <form onSubmit={handleSubmit}>
                    <div className="login-box__input">
                        <input type="email" id="email" placeholder="Email"/>
                        <div className="input-label">Email</div>
                        
                    </div>
                    <div className="login-box__input">
                        <input type="password" id="password" placeholder="Password"/>
                        <div className="input-label">Password</div> 
                        
                    </div>
                    <button className="login-box__button register-button" type="submit">Sign Up</button>
                    
                    <button className="login-box__button login-button" type="submit">Sign In</button>
                    <div className="login-box__message">Not registered? Sign-up now!</div>
                </form>
        
        </div>
    </div>
    )
}

export default Login;