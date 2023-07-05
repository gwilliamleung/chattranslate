import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './routes/Login';
import Home from './routes/Home';
import Signup from './routes/Signup'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  )
}

export default App