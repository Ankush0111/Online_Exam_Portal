import React, { useState } from 'react';
import './LoginSignin.css';
import { useNavigate } from 'react-router-dom';

const ForgetPsw = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !newPassword) {
      setErrorMessage('Both fields are required');
      return;
    }

    try {
      const response = await fetch('/api/forget-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        setSuccessMessage('Password changed successfully!');
        setErrorMessage('');
        setEmail('');
        setNewPassword('');
      } else {
        setErrorMessage(data.error || 'Failed to update password.');
      }
    } catch (error) {
      setErrorMessage('Server error. Please try again later.');
    }
  };

  const handleBack = () => {
    navigate('/Login'); // Navigate to the previous page
  };

  return (
    <div className='container'>
      <div className='header'>
        <div className='text'>Change Password</div>
        <div className='underline'></div>
      </div>
      <form onSubmit={handleSubmit}>
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
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
        </div>
        {errorMessage && <p className='error-message'>{errorMessage}</p>}
        {successMessage && <p className='success-message'>{successMessage}</p>}
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

export default ForgetPsw;
