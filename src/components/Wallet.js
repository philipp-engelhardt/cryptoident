import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import './Wallet.css';

const Wallet = () => {
  // Funktion zum Herunterladen der Wallet-Zip-Datei
  const handleDownload = async () => {
    try {
      const response = await fetch('http://10.41.13.175:5000/generate_wallet', {
        method: 'GET',
      });

      // Überprüfe, ob die Antwort erfolgreich war
      if (!response.ok) {
        throw new Error('Fehler beim Herunterladen der Wallet-ZIP-Datei.');
      }

      // Extrahiere den Blob (Binärdaten) der Datei
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Erstelle ein temporäres Link-Element zum Starten des Downloads
      const link = document.createElement('a');
      link.href = url;
      link.download = 'wallet.zip'; // Name der heruntergeladenen Datei
      document.body.appendChild(link);
      link.click();

      // Entferne den Link nach dem Herunterladen
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert('Fehler beim Herunterladen der Datei.');
    }
  };

  return (
    <div className="wallet-container">
      <Sidebar />
      <div className="wallet-content">
        <Header />
        <div className="wallet-main">
          <h2>Wallet</h2>
          <div className="wallet-download-section">
            <button className="download-button" onClick={handleDownload}>
              Download Wallet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;