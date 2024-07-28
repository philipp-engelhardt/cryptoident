import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import './Explorer.css';

const Explorer = () => {
  return (
    <div className="explorer-container">
      <Sidebar />
      <div className="explorer-content">
        <Header />
        <div className="explorer-main">
          <h2>Welcome to the Admin Explorer</h2>
          {/* Weitere Explorer-Inhalte wie Tabellen, Diagramme usw. hier hinzufügen */}
        </div>
      </div>
    </div>
  );
};

export default Explorer;
