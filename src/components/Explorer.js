import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import BlockDetails from './BlockDetails';
import './Explorer.css';

const Explorer = () => {
  const navigate = useNavigate();
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        const response = await fetch('http://10.41.13.175:5000/latest_blocks');
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Network response was not ok: ${response.statusText} - ${errorText}`);
        }
        const data = await response.json();
        console.log('Fetched data:', data);
        setBlocks(data.reverse()); // Umkehrung der Reihenfolge der Daten
      } catch (error) {
        console.error('Error fetching data:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlocks();
  }, []);

 const handleRowClick = (blockheight) => {
  navigate(`/explorer/${blockheight}`);
};


  return (
    <div className="explorer-container">
      <Sidebar />
      <div className="explorer-content">
        <Header />
        <div className="explorer-main">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <h2>Latest Blocks</h2>
                  <div className="table-container">
                    <table className="explorer-table">
                      <thead>
                        <tr>
                          <th>Hash</th>
                          <th>Block Height</th>
                          <th>PersonID</th>
                          <th>Privilege Level</th>
                          <th>Timestamp</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr>
                            <td colSpan="5">Loading data...</td>
                          </tr>
                        ) : blocks.length > 0 ? (
                          blocks.map((block, index) => (
                            <tr key={index} onClick={() => handleRowClick(block.index)}>
                              <td>{block.hash}</td>
                              <td>{block.index}</td>
                              <td>{Array.isArray(block.data) ? block.data[0] : 'N/A'}</td>
                              <td>{Array.isArray(block.data) ? block.data[1] : 'N/A'}</td>
                              <td>{new Date(block.timestamp).toLocaleString()}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5">No data available.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              }
            />
            <Route path=":hash" element={<BlockDetails />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Explorer;
