import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Entfernen Sie das Token oder andere Authentifizierungsdaten
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="dashboard-header">
      <div className="left-spacer"></div>
      <div className="logo-container">
        <img src={`${process.env.PUBLIC_URL}/logo_schriftzug.png`} alt="Cryptoident Logo" className="header-logo" />
      </div>
      <button className="logout-button" onClick={handleLogout}>
        <FontAwesomeIcon icon={faSignOutAlt} />
      </button>
    </header>
  );
};

export default Header;
