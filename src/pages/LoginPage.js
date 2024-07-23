import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Dummy-Login: akzeptiert jeden Benutzernamen und jedes Passwort
    if (username && password) {
      localStorage.setItem('token', 'dummy-token');
      navigate('/dashboard');
    } else {
      alert('Please enter a valid username and password');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <form onSubmit={handleLogin}>
          <h2>Login</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
        <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Cryptoident Logo" className="login-logo" />
      </div>
    </div>
  );
};

export default LoginPage;
