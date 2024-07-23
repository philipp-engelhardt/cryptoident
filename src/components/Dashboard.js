import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <Header />
        <div className="dashboard-main">
          <h2>Welcome to cryptoident</h2>
          {/* Weitere Dashboard-Inhalte wie Tabellen, Diagramme usw. hier hinzufügen */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
