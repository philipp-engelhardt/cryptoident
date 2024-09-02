import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import './Settings.css';

const Settings = () => {
  return (
    <div className="settings-container">
      <Sidebar />
      <div className="settings-content">
        <Header />
        <div className="settings-main">
          <h2>Settings</h2>
        </div>
      </div>
    </div>
  );
};

export default Settings;
