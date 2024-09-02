import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import './Search.css';
import CryptoJS from 'crypto-js'; // Importing crypto-js

const Search = () => {
  const [name, setName] = useState('');
  const [birthplace, setBirthplace] = useState('');
  const [birthday, setBirthday] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    // Combine the input values
    const combinedString = `${name}${birthplace}${birthday}`;
  
    // Generate SHA-256 hash
    const hash = CryptoJS.SHA256(combinedString).toString();
  
    console.log('Hash:', hash); // Log the hash value
  
    try {
      // Send the hash to the API route in the body as JSON
      const response = await fetch('http://10.41.13.175:5000/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ person_id: hash }), // Passing the hash in the body
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch data from the server');
      }
  
      const data = await response.json();
  
      // Log the entire response JSON to the console
      console.log('Response JSON:', data);
  
      // Map the response directly since the structure is different
      const mappedResult = {
        hash: data.hash,
        blockheight: data.index,
        personID: Array.isArray(data.data) ? data.data[0] : 'N/A',
        privilegeLevel: Array.isArray(data.data) ? data.data[1] : 'N/A',
        timestamp: new Date(data.timestamp).toLocaleString(),
      };
  
      // Set the single mapped result as an array to match the component's structure
      setResults([mappedResult]);
  
    } catch (error) {
      console.error('Error during API call:', error);
      // Optionally, set an error message state to inform the user
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
