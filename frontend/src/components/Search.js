import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import './Search.css';
import CryptoJS from 'crypto-js'; 
import config from './config';

const Search = () => {
  const [name, setName] = useState('');
  const [birthplace, setBirthplace] = useState('');
  const [birthday, setBirthday] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    // Kombinierung der Eingaben
    const combinedString = `${name}${birthplace}${birthday}`;
  
    // Generierung des SHA-256 Hash
    const hash = CryptoJS.SHA256(combinedString).toString();
  
    try {
      const response = await fetch(`${config.config.API_BASE_URL}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ person_id: hash }), // Hash wird im Body an die API übertragen
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch data from the server');
      }
  
      const data = await response.json();
  
      // Mapping der Antwort auf gewünschtes Schema
      const mappedResult = {
        hash: data.hash,
        blockheight: data.index,
        personID: Array.isArray(data.data) ? data.data[0] : 'N/A',
        privilegeLevel: Array.isArray(data.data) ? data.data[1] : 'N/A',
        timestamp: new Date(data.timestamp).toLocaleString(),
      };
        setResults([mappedResult]);
  
    } catch (error) {
      console.error('Error during API call:', error);
    }
  };
  

  return (
    <div className="search-container">
      <Sidebar />
      <div className="search-content">
        <Header />
        <div className="search-main">
          <h2>Search</h2>
          <div className="search-input-container">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Birthplace"
              value={birthplace}
              onChange={(e) => setBirthplace(e.target.value)}
            />
            <input
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
          </div>
          <div className="search-results">
            {results.map((result, index) => (
              <div key={index} className="search-result-item">
                <p><strong>Hash:</strong> {result.hash}</p>
                <p><strong>Block Height:</strong> {result.blockheight}</p>
                <p><strong>Person ID:</strong> {result.personID}</p>
                <p><strong>Privilege Level:</strong> {result.privilegeLevel}</p>
                <p><strong>Timestamp:</strong> {result.timestamp}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
