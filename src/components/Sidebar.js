import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUsers, faCog, faBars } from '@fortawesome/free-solid-svg-icons';
import './Sidebar.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className={`dashboard-sidebar ${isOpen ? 'open' : 'closed'}`}>
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        <FontAwesomeIcon icon={faBars} />
      </button>
      <ul>
        <li>
          <a href="/dashboard">
            <FontAwesomeIcon icon={faHome} />
            {isOpen && <span>Dashboard</span>}
          </a>
        </li>
        <li>
          <a href="/dashboard/users">
            <FontAwesomeIcon icon={faUsers} />
            {isOpen && <span>Users</span>}
          </a>
        </li>
        <li className="settings">
          <a href="/dashboard/settings">
            <FontAwesomeIcon icon={faCog} />
            {isOpen && <span>Settings</span>}
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
