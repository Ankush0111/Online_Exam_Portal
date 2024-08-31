import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './test.css';
import { useLocation, useNavigate } from 'react-router-dom';

const MCQTest = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(300); // 5-minute timer
  const [score, setScore] = useState(null);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  // Fetch questions from the server
  useEffect(() => {
    const fetchQuestions = async () => {
      const res = await axios.get('http://localhost:3000/api/questions');
      setQuestions(res.data);
    };

    fetchQuestions();
  }, []);

  // Timer functionality
  useEffect(() => {
    if (timeLeft === 0) {
      submitTest();
    }
    const timer = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Handle answer selection
  const handleAnswerChange = (index, answer) => {
    setSelectedAnswers({ ...selectedAnswers, [index]: answer });
  };

  // Submit test and calculate score
  const submitTest = async () => {
    let score = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.answer) {
        score += 1;
      }
    });

    setScore(score);

    // Submit the score to the server
    try {
      await axios.post('http://localhost:3000/api/submit-score', { username, score });
      alert(`Test submitted! Your score: ${score}`);
    } catch (error) {
      console.error('Failed to submit score', error);
    }
  };

  if (score !== null) {
    //return <div>Your score is {score} out of {questions.length}</div>;
    navigate('/login');
  }

  if (questions.length === 0) {
    return <div>Loading questions...</div>;
  }

  return (
    <div className="mcq-test">
      <h2>MCQ Test</h2>
      <label>
        Enter your username: 
        <input 
          type="text" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </label>
      <div>
        <h3>Time left: {Math.floor(timeLeft / 60)}:{timeLeft % 60}</h3>
      </div>
      {questions.map((question, index) => (
        <div key={index} className="question">
          <h4>{index + 1}. {question.question}</h4>
          {question.options.map((option, optIndex) => (
            <div key={optIndex}>
              <label>
                <input
                  type="radio"
                  name={`question-${index}`}
                  value={option}
                  checked={selectedAnswers[index] === option}
                  onChange={() => handleAnswerChange(index, option)}
                />
                {option}
              </label>
            </div>
          ))}
        </div>
      ))}
      <button onClick={submitTest}>Submit Test</button>
    </div>
  );
};

export default MCQTest;
