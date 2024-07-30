import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import './Create.css';

const Create = () => {
  const [name, setName] = useState('');
  const [birthplace, setBirthplace] = useState('');
  const [birthday, setBirthday] = useState('');
  const [privilegeLevel, setPrivilegeLevel] = useState('User');
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [file3, setFile3] = useState(null);

  const handleFileChange = (e, setFile) => {
    const file = e.target.files[0];
    const validFormats = ['image/png', 'image/jpeg', 'application/pdf']; // Beispiel für gültige Formate

    if (file && validFormats.includes(file.type)) {
      setFile(file);
    } else {
      alert('Ungültiges Dateiformat. Bitte wählen Sie eine PNG, JPEG oder PDF Datei.');
      e.target.value = ''; // Reset the input if the file format is invalid
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Creating new entry:', { name, birthplace, birthday, privilegeLevel, file1, file2, file3 });
  };

  return (
    <div className="create-container">
      <Sidebar />
      <div className="create-content">
        <Header />
        <div className="create-main">
          <h2>Create New Entry</h2>
          <div className="create-box-container">
            <div className="create-box">
              <input
                type="file"
                id="file1"
                onChange={(e) => handleFileChange(e, setFile1)}
              />
              <label htmlFor="file1" className={file1 ? 'active' : ''}>Select File</label>
              {file1 && <p>{file1.name}</p>}
            </div>
            <div className="create-box">
              <input
                type="file"
                id="file2"
                onChange={(e) => handleFileChange(e, setFile2)}
              />
              <label htmlFor="file2" className={file2 ? 'active' : ''}>Select File</label>
              {file2 && <p>{file2.name}</p>}
            </div>
            <div className="create-box">
              <input
                type="file"
                id="file3"
                onChange={(e) => handleFileChange(e, setFile3)}
              />
              <label htmlFor="file3" className={file3 ? 'active' : ''}>Select File</label>
              {file3 && <p>{file3.name}</p>}
            </div>
          </div>
          <form className="create-input-container" onSubmit={handleSubmit}>
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
            <select
              value={privilegeLevel}
              onChange={(e) => setPrivilegeLevel(e.target.value)}
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
            <button type="submit">Create</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Create;
