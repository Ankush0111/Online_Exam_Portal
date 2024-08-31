import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminSignin.css';

const AdminSignin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    try {
      const res = await axios.post('http://localhost:3000/AdminSignin', { username, email, password });
      if (res.data.status === 'notexist') {
        alert('Sign up successful!');
        navigate('/AdminLogin');
      } else {
        setError('Email already exists');
      }
    } catch (err) {
      console.error(err); // Log error details for debugging
      setError('An error occurred');
    }
  };
  

  const handleLoginClick = () => {
    navigate('/AdminLogin');
  };

  // const handleChangePasswordClick = () => {
  //   navigate('/forget-password');
  // };

  const handleBack = () => {
    navigate('/'); // Navigate to the previous page
  };

  return (
    <div className='container1'>
      <div className='header1'>
        <div className='text1'>Admin Sign up</div>
        <div className='underline1'></div>
      </div>
      <div className='inputs1'>
        <div className='input1'>
          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className='input1'>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className='input1'>
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
      </div>
      {error && <div className='error'>{error}</div>}
      <div className='btns1'>
        <input type="button" value="Submit" id='submit' onClick={handleSignUp} />
        <input type="button" value="Login" id='login' onClick={handleLoginClick} />
      </div>
      <div className='back-button-container'>
        <button className='back-button' onClick={handleBack}>Back</button>
      </div>
    </div>
  );
};

export default AdminSignin;
