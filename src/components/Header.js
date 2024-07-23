import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="dashboard-header">
      <img src={`${process.env.PUBLIC_URL}/logo_schriftzug.png`} alt="Cryptoident Logo" className="header-logo" />
    </header>
  );
};

export default Header;
