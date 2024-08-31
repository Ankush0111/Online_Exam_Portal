import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './welcome.css'; // Add your CSS styles here

const Welcome = () => {
  const location = useLocation();
  const { name } = location.state || {};
  const navigate = useNavigate();

  const handleNextPage = () => {
    navigate("/test"); //next page route here
  };

  const handleSignOut = () => {
    navigate("/LoginSignin"); // Redirect to sign-in page
  };

  return (
    <div className='welcome-container'>
      {/* Sign Up button in the top-right */}
      <div className='signup-btn-container'>
        <button className='signup-btn' onClick={handleSignOut}>Sign out</button>
      </div>
      
      {/* Main Welcome content */}
      <div className='welcome-box'>
        <h1 className='welcome-title'>Welcome, {name}!</h1>
        <p className='welcome-message'>We're thrilled to have you!</p>
        <button className='welcome-btn' onClick={handleNextPage}>Let's Go!</button>
      </div>
    </div>
  );
};

export default Welcome;
