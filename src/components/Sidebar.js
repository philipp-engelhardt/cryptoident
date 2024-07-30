import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSearch, faCog, faBars, faPlusCircle} from '@fortawesome/free-solid-svg-icons';
import './Sidebar.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`dashboard-sidebar ${isOpen ? 'open' : 'closed'}`}>
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        <FontAwesomeIcon icon={faBars} />
      </button>
      <ul>
        <li>
          <Link to="/explorer">
            <FontAwesomeIcon icon={faHome} />
            {isOpen && <span>Dashboard</span>}
          </Link>
        </li>
        <li>
          <Link to="/search">
            <FontAwesomeIcon icon={faSearch} />
            {isOpen && <span>Search</span>}
          </Link>
        </li>
        <li>
          <Link to="/create">
            <FontAwesomeIcon icon={faPlusCircle} />
            {isOpen && <span>Create</span>}
          </Link>
        </li>
        <li className="settings">
          <Link to="/settings">
            <FontAwesomeIcon icon={faCog} />
            {isOpen && <span>Settings</span>}
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
