import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import './LoginSignin.css';

const LoginSignin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginClick = () => {
    navigate('/login');
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:3000/LoginSignup", {
        username,
        email,
        password
      });

      console.log('Response:', res.data);

      if (res.data.status === "exist") {
        alert("User already exists");
      } else if (res.data.status === "notexist") {
        alert("Successfully Signed Up.");
        navigate("/login");
      } else {
        alert("Unexpected response from server. Please contact support.");
      }
    } catch (error) {
      console.error('Error:', error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleBack = () => {
    navigate('/'); // Navigate to the previous page
  };

  return (
    <div className='container'>
      <div className='header'>
        <div className='text'> Student Sign up</div>
        <div className='underline'></div>
      </div>
      <form onSubmit={submit}>
        <div className='inputs'>
          <div className='input'>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className='input'>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className='input'>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>
        <div className='btns'>
          <input type="submit" value="Submit" id='submit' />
          <input type="button" value="Login" id='login' onClick={handleLoginClick} />
        </div>
      </form>
      <div className='back-button-container'>
        <button className='back-button' onClick={handleBack}>Back</button>
      </div>
    </div>
  );
};

export default LoginSignin;
