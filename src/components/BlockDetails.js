import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './BlockDetails.css';

const BlockDetails = () => {
  const { hash } = useParams();
  const [block, setBlock] = useState(null);

  useEffect(() => {
    const fetchBlockDetails = async () => {
      try {
        const dummyData = {
          '0000000000000000000bba47e860e2d5d89b5dfde3c9ec5b2f3d5e2db4e5f6ac': { hash: '0000000000000000000bba47e860e2d5d89b5dfde3c9ec5b2f3d5e2db4e5f6ac', blockheight: 854377, blocksize: '1,603,635', personID: 'ID001', privilegeLevel: 'Admin', timestamp: '28/07/2024 - 21:38:00' },
          '00000000000000000007d0f2839c6b4d9e8d7fbd3b0f7d91a9b2d1d5f3e2d1e4': { hash: '00000000000000000007d0f2839c6b4d9e8d7fbd3b0f7d91a9b2d1d5f3e2d1e4', blockheight: 854376, blocksize: '1,620,153', personID: 'ID002', privilegeLevel: 'User', timestamp: '28/07/2024 - 21:35:11' },
          '00000000000000000005b4e84c7f2d2d8e8d9fbd2c9e5e1a1b2d3d4f6e3d1c2a1': { hash: '00000000000000000005b4e84c7f2d2d8e8d9fbd2c9e5e1a1b2d3d4f6e3d1c2a1', blockheight: 854375, blocksize: '1,568,148', personID: 'ID003', privilegeLevel: 'Admin', timestamp: '28/07/2024 - 21:30:42' },
          '0000000000000000000c8e9e4d2f2a5c7e8d6f4d2c8e5e3a9b4d6d3e1c4a5b6c7': { hash: '0000000000000000000c8e9e4d2f2a5c7e8d6f4d2c8e5e3a9b4d6d3e1c4a5b6c7', blockheight: 854374, blocksize: '1,577,927', personID: 'ID004', privilegeLevel: 'User', timestamp: '28/07/2024 - 21:27:49' },
          '00000000000000000008d3c4a5b6c7d8e9f2d3c4e5d6b4a3c2d1f4a5b6c7d8e9f0': { hash: '00000000000000000008d3c4a5b6c7d8e9f2d3c4e5d6b4a3c2d1f4a5b6c7d8e9f0', blockheight: 854373, blocksize: '1,696,866', personID: 'ID005', privilegeLevel: 'Admin', timestamp: '28/07/2024 - 21:03:44' },
          '00000000000000000009a2b3c4d5e6f7a8b9c0d1e2f3d4a5b6c7d8e9f0a1b2c3d4': { hash: '00000000000000000009a2b3c4d5e6f7a8b9c0d1e2f3d4a5b6c7d8e9f0a1b2c3d4', blockheight: 854372, blocksize: '1,613,277', personID: 'ID006', privilegeLevel: 'User', timestamp: '28/07/2024 - 21:01:32' },
          '0000000000000000000d4c5e6f7a8b9c0d1e2f3d4a5b6c7d8e9f0a1b2c3d4e5f6g7': { hash: '0000000000000000000d4c5e6f7a8b9c0d1e2f3d4a5b6c7d8e9f0a1b2c3d4e5f6g7', blockheight: 854371, blocksize: '1,626,688', personID: 'ID007', privilegeLevel: 'Admin', timestamp: '28/07/2024 - 20:52:20' },
        };
        setBlock(dummyData[hash]);
      } catch (error) {
        console.error('Error fetching block details:', error);
      }
    };

    fetchBlockDetails();
  }, [hash]);

  if (!block) {
    return <div>Loading...</div>;
  }

  return (
    <div className="block-details-container">
      <h2>Block Details</h2>
      <p><strong>Hash:</strong> {block.hash}</p>
      <p><strong>Blockheight:</strong> {block.blockheight}</p>
      <p><strong>BlockSize:</strong> {block.blocksize}</p>
      <p><strong>PersonID:</strong> {block.personID}</p>
      <p><strong>PrivilegeLevel:</strong> {block.privilegeLevel}</p>
      <p><strong>Timestamp:</strong> {block.timestamp}</p>
    </div>
  );
};

export default BlockDetails;
