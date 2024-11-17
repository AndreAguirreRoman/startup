import React, {useEffect, useState} from 'react';
import '../design/app.scss';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthState } from './login/authState';



const Navbar = ({ onAuthChange }) => {

  
  const navigate = useNavigate();
  const [authState, setAuthState] = useState(AuthState.Unknown);
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {

    const storedUserName = localStorage.getItem("userName");

    if (storedUserName) {
      setAuthState(AuthState.Authenticated); 
      setUserName(storedUserName);
    } else {
      setAuthState(AuthState.Unauthenticated);
    }
    setIsLoading(false);
  }, []);

  const logout = () => {
    fetch("api/auth/logout", {
      method: "DELETE",  headers: {
        "Content-Type": "application/json",
      },
    }).catch((error) => {
      console.error("Logout failed", error)
    }).finally(() =>{
      localStorage.removeItem("userName");
      onAuthChange && onAuthChange("", AuthState.Unauthenticated);
      navigate("/");
    });
  }

  console.log(authState)
  if (isLoading) {
    return <div className="navbar">Loading...</div>;
  }

  return (
    <div className="navbar">
      <div className="navbar-left">
        <NavLink className="navbar-left__link" to="/home">Home</NavLink>
        <NavLink className="navbar-left__link" to="/about">About Us</NavLink>
        <NavLink className="navbar-left__link" to="/explore">Explore</NavLink>
        {authState === AuthState.Authenticated ? (
          <NavLink className="navbar-left__link" onClick={logout}>Log Out</NavLink>
        ) : (
          <NavLink className="navbar-left__link"  onClick={() => console.log("Navigating to /")} to="/">Log In</NavLink>
        )}
      </div>
      <div className="navbar-right">
        
        {authState === AuthState.Authenticated && userName && (
          <span>Welcome!</span>
        )}
        <img src="/logo.png" alt="logo" />
      </div>
    </div>
  );
};

export default Navbar;
