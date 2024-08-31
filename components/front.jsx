import React from 'react';
import { useNavigate } from 'react-router-dom';
import './front.css';

const Front = () => {
  const navigate = useNavigate();

  //for login page
  const handleLoginClick = () => {
    navigate('/AdminSignin');
  };

  const handleLoginClick1 = () => {
    navigate('/LoginSignin');
  };
  
  return (
    <div className="container">
      <h1>Online Exam Panel</h1>
      <div className="buttons">
        <button className="btn admin" onClick={handleLoginClick}>Admin</button>
        <button className="btn student" onClick={handleLoginClick1}>Student</button>
      </div>
    </div>
  );
};

export default Front;
