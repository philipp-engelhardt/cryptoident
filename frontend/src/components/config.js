let config = {
  API_BASE_URL: 'http://172.19.0.6:4000', // Standard Docker Container API
  possibleAPIs: [], // Diese Liste wird dynamisch gefüllt
};

/**
 * Funktion, um die möglichen API Endpunkte von einer Route zu holen
 */
async function getPossibleAPIs() {
  try {
    const response = await fetch(`${config.API_BASE_URL}/services`); // Route, die die IPs liefert
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Erwartetes Response-Format: ["172.0.0.2", "172.0.0.3", ...]
    const possibleAPIs = await response.json();
    console.log('Erhaltene mögliche APIs:', possibleAPIs);
    config.possibleAPIs = possibleAPIs; // Liste speichern
  } catch (error) {
    console.error('Fehler beim Abrufen der möglichen APIs:', error);
    config.possibleAPIs = []; // Leere Liste als Fallback
  }
}

/**
 * Funktion, um einen erreichbaren API-Endpunkt zu finden und zu setzen
 */
async function findAndSetAPI() {
  for (const apiIP of config.possibleAPIs) {
    const apiURL = `http://${apiIP}:4000/`; // Kombiniere IP mit Port
    try {
      if (await pingAPI(apiURL)) {
        config.API_BASE_URL = apiURL; // Ändere die API_BASE_URL dynamisch
        console.log(`API erreichbar: ${apiURL}`);
        return true; // Erfolgreich gefunden
      } else {
        console.warn(`API nicht erreichbar: ${apiURL}`);
      }
    } catch (error) {
      console.error(`Fehler beim Erreichen der API: ${apiURL}`, error);
    }
  }

  return false; // Keine API erreichbar
}

/**
 * Init-Funktion, die beim Start des Frontends ausgeführt wird
 */
async function initAPI() {
  // Schritt 1: Mögliche APIs holen
  await getPossibleAPIs();

  // Schritt 2: Ersten erreichbaren API-Endpunkt finden
  const apiSet = await findAndSetAPI();
  if (!apiSet) {
    throw new Error('Keine API konnte beim Start erreicht werden.');
  }

  console.log(`API_BASE_URL erfolgreich gesetzt auf: ${config.API_BASE_URL}`);
}

/**
 * Notfallfunktion, die verwendet wird, wenn die API während des Betriebs nicht mehr erreichbar ist
 */
async function retryAPI() {
  console.log('Versuche, API erneut zu erreichen...');
  const apiSet = await findAndSetAPI('/latest_blocks');
  if (!apiSet) {
    console.error('Kein erreichbarer API-Endpunkt gefunden.');
    return false; // Fehlgeschlagen
  }

  console.log(`API_BASE_URL wurde gewechselt zu: ${config.API_BASE_URL}`);
  return true; // Erfolgreich gewechselt
}


/**
 * Pingen des API servers mit PingJs um die erreichbarkeit zu überprüfen
 */
async function pingAPI(apiURL) {
  apiURL = apiURL + '/services';
  if (await pingServer(apiURL)) {
    return true;
  } else {
    return false;
  }
}


const pingServer = async (apiURL) => {
  try {
    const response = await fetch(apiURL);
    if (response.ok) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

export default { config, initAPI, retryAPI };