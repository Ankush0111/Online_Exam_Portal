import React, { useState } from 'react';
import axios from 'axios';
import './score.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const StudentScores = () => {
  const [search, setSearch] = useState('');
  const [scores, setScores] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSearch = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/scores?username=${search}`);
      setScores(res.data);
    } catch (err) {
      setError('An error occurred while fetching scores');
    }
  };

  const handleBack = () => {
    navigate('/AdminSignin'); // Navigate to the previous page
  };

  return (
    <div className='container2'>
      <div className='header2'>
        <h2>Search Student Scores</h2>
      </div>
      <div className='search'>
        <input
          type="text"
          placeholder="Enter student username"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      {error && <div className='error'>{error}</div>}
      <div className='scores'>
        {scores.length > 0 ? (
          <ul>
            {scores.map((score, index) => (
              <li key={index}>
                Username: {score.username} | Score: {score.score} | Date: {new Date(score.date).toLocaleDateString()}
              </li>
            ))}
          </ul>
        ) : (
          <div>No scores found</div>
        )}
      </div>
      <div className='back-button-container'>
        <button className='back-button' onClick={handleBack}>Back</button>
      </div>
    </div>
  );
};

export default StudentScores;
