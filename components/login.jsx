import React, { useState } from 'react';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';
import './LoginSignin.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:3000/login", { email, password });
      
      console.log("Server Response:", res.data); // Debugging log

      if (res.data.status === "exist") {
        navigate("/welcome", { state: { id: email, name: res.data.name } });
      } else if (res.data.status === "notexist") {
        alert("Invalid email or password!");
      } else {
        alert("Unexpected response from server");
      }
    } catch (error) {
      console.error("Error during login:", error.response ? error.response.data : error.message); // Log the error for debugging
      alert("An error occurred. Please check your details.");
    }
  };

  const handleChangePasswordClick = () => {
    navigate("/forget-password"); // Navigate to the forget password page
  };

  const handleBack = () => {
    navigate('/LoginSignin'); // Navigate to the previous page
  };
  
  return (
    <div className='container'>
      <div className='header'>
        <div className='text'>Student Login</div>
        <div className='underline'></div>
      </div>
      <form onSubmit={submit}>
        <div className='inputs'>
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
        <div className='forget_password'>
          Forget password? <span onClick={handleChangePasswordClick} style={{ cursor: "pointer", color: "blue" }}>Click here!</span>
        </div>
        <div className='btns'>
          <input type="submit" value="Submit" id='submit' />
        </div>
      </form>
      <div className='back-button-container'>
        <button className='back-button' onClick={handleBack}>Back</button>
      </div>
    </div>
  );
};

export default Login;
