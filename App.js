// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginSignin from './components/LoginSignin';
import LoginSignin1 from './components/AdminSignin';
import Login from './components/login';
import Login1 from './components/AdminLogin';
import ForgetPsw from './components/forgetPsw';
import ForgetPsw1 from './components/forgetPsw1';
import Front from './components/front';
import Welcomemsg from './components/welcome';
import Test from './components/test';
import Score from './components/score';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Front />} />
        <Route path="/loginsignin" element={<LoginSignin />} />
        <Route path="/AdminSignin" element={<LoginSignin1 />} />
        <Route path="/login" element={<Login />} />
        <Route path="/AdminLogin" element={<Login1 />} />
        <Route path="/forget-password" element={<ForgetPsw />} />
        <Route path="/welcome" element={<Welcomemsg />} />
        <Route path="/test" element={<Test />} />
        <Route path="/score" element={<Score />} />
        <Route path="/forget-password1" element={<ForgetPsw1 />} />
      </Routes>
    </Router>
  );
}

export default App;
