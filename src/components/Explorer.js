import React from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import BlockDetails from './BlockDetails';
import './Explorer.css';

const Explorer = () => {
  const navigate = useNavigate();

  const dummyData = [
    { hash: 'bba47e860e2d5d89b5dfde3c9ec5b2f3d5e2db4e5f6ac', blockheight: 854377, blocksize: '1,603,635', personID: 'ID001', privilegeLevel: 'Admin', timestamp: '28/07/2024 -<br> 21:38:00' },
    { hash: '7d0f2839c6b4d9e8d7fbd3b0f7d91a9b2d1d5f3e2d1e4', blockheight: 854376, blocksize: '1,620,153', personID: 'ID002', privilegeLevel: 'User', timestamp: '28/07/2024 -<br> 21:35:11' },
    { hash: '5b4e84c7f2d2d8e8d9fbd2c9e5e1a1b2d3d4f6e3d1c2a1', blockheight: 854375, blocksize: '1,568,148', personID: 'ID003', privilegeLevel: 'Admin', timestamp: '28/07/2024 -<br> 21:30:42' },
    { hash: 'c8e9e4d2f2a5c7e8d6f4d2c8e5e3a9b4d6d3e1c4a5b6c7', blockheight: 854374, blocksize: '1,577,927', personID: 'ID004', privilegeLevel: 'User', timestamp: '28/07/2024 -<br> 21:27:49' },
    { hash: '8d3c4a5b6c7d8e9f2d3c4e5d6b4a3c2d1f4a5b6c7d8e9f0', blockheight: 854373, blocksize: '1,696,866', personID: 'ID005', privilegeLevel: 'Admin', timestamp: '28/07/2024 -<br> 21:03:44' },
    { hash: '9a2b3c4d5e6f7a8b9c0d1e2f3d4a5b6c7d8e9f0a1b2c3d4', blockheight: 854372, blocksize: '1,613,277', personID: 'ID006', privilegeLevel: 'User', timestamp: '28/07/2024 -<br> 21:01:32' },
  ];

  const handleRowClick = (hash) => {
    navigate(`/explorer/${hash}`);
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
                          <th>Block Size (bytes)</th>
                          <th>PersonID</th>
                          <th>Privilege Level</th>
                          <th>Timestamp</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dummyData.map((block, index) => (
                          <tr key={index} onClick={() => handleRowClick(block.hash)}>
                            <td>{block.hash}</td>
                            <td>{block.blockheight}</td>
                            <td>{block.blocksize}</td>
                            <td>{block.personID}</td>
                            <td>{block.privilegeLevel}</td>
                            <td dangerouslySetInnerHTML={{ __html: block.timestamp }}></td>
                          </tr>
                        ))}
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
