import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './routes/Login';
import Home from './routes/Home';
import Signup from './routes/Signup'
import NavBar from './components/NavBar';

const App = () => {
  return (
    <Router>
      <NavBar/>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
      <div className="bg-gray-50">hi</div>
    </Router>    
  )
}

export default App