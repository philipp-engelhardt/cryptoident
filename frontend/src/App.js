import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Explorer from './components/Explorer';
import Search from './components/Search';
import Create from './components/Create';
import Wallet from './components/Wallet';
import Settings from './components/Settings';
import config from './components/config.js';
import './App.css';

const App = () => {

  config.initAPI();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/explorer/*" element={<Explorer />} />
        <Route path="/search" element={<Search />} />
        <Route path="/create" element={<Create />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
