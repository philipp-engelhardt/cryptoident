import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './BlockDetails.css';

const BlockDetails = () => {
  const { hash } = useParams();
  const [block, setBlock] = useState(null);

  useEffect(() => {
    const fetchBlockDetails = async () => {
      try {
        // Ersetzen der Dummy-Daten durch den API-Aufruf
        const response = await fetch(`http://10.41.13.175:5000/block/${hash}`);
        if (!response.ok) {
          throw new Error('Failed to fetch block details');
        }
        const data = await response.json();

        // Mapping der Werte wie in der Tabelle beschrieben
        const mappedBlock = {
          hash: data.hash,
          blockheight: data.index,
          personID: Array.isArray(data.data) ? data.data[0] : 'N/A',
          privilegeLevel: Array.isArray(data.data) ? data.data[1] : 'N/A',
          timestamp: new Date(data.timestamp).toLocaleString(),
        };

        setBlock(mappedBlock);
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
      <p><strong>Block Height:</strong> {block.blockheight}</p>
      <p><strong>Person ID:</strong> {block.personID}</p>
      <p><strong>Privilege Level:</strong> {block.privilegeLevel}</p>
      <p><strong>Timestamp:</strong> {block.timestamp}</p>
    </div>
  );
};

export default BlockDetails;
