import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import './Search.css';

const Search = () => {
  const [name, setName] = useState('');
  const [birthplace, setBirthplace] = useState('');
  const [birthday, setBirthday] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = () => {
    // Hier fügen Sie die Logik für die Suche ein
    console.log('Searching for:', { name, birthplace, birthday });
    // Dummy-Daten als Ergebnis hinzufügen
    setResults([
      { id: 1, name: 'John Doe', birthplace: 'New York', birthday: '01/01/1990' },
    ]);
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
            {results.map((result) => (
              <div key={result.id} className="search-result-item">
                <p>Name: {result.name}</p>
                <p>Birthplace: {result.birthplace}</p>
                <p>Birthday: {result.birthday}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
