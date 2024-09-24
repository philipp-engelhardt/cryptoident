const config = {
  API_BASE_URL: 'http://10.41.13.175:4000', // Standard Docker Container API
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
async function findAndSetAPI(route) {
  for (const apiIP of config.possibleAPIs) {
    const apiURL = `http://${apiIP}:4000`; // Kombiniere IP mit Port
    try {
      const response = await fetch(`${apiURL}${route}`);
      if (response.ok) {
        config.API_BASE_URL = apiURL; // Ändere die API_BASE_URL dynamisch
        console.log(`API erreichbar: ${apiURL}`);
        return true; // Erfolgreich gefunden
      } else {
        console.warn(`API nicht erreichbar: ${apiURL}, Status: ${response.status}`);
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
  const apiSet = await findAndSetAPI('/');
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

export default { config, initAPI, retryAPI };
