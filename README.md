![padded_logo](https://github.com/user-attachments/assets/7d638b41-5954-4ba4-a18c-a2b6f0f06af5)

## Decentralized identity and authorization management system

### Welcome to cryptoident!

This project implements a Decentralized Identity and Authorization Management System powered by a lightweight, custom blockchain. Developed in Python, it aims to provide a secure, scalable, and user-friendly solution for managing identities and permissions in decentralized environments.

#### Key Features:
1. Decentralized Identity: Users can create, manage, and verify identities without relying on centralized authorities, enhancing privacy and security.

2. Blockchain Integration: The project utilizes a simple blockchain for recording identity transactions, ensuring data integrity and immutability.

3. Authorization Management: Fine-grained control over access and permissions, allowing trusted interactions between users and services in a decentralized way.

#### Anleitung:
1. ```docker compose up python-app -d```
2. Heraussuchen der IP-Adresse des ersten Node Containers (1. Nachricht im Log)
3. Erstellen weitererer Node Container mit:
    ```docker run --network=cryptoident_default cryptoident-python-app <init-host-ip> b```
    (das b am Ende bedeutet das ein API Webserver gestartet wird)
    (Am besten sollten die Node Container nicht zu schnell hintereinander gestartet werden)
4. Widerholen des Schritt 4. bis genügend Container vorhanden sind 
5. Nun kann sich eine IP-Adresse eines Nodes mit Backend herausgesucht werden um das
    Frontend zu startet mit diesem Initialen Backend
    Hierfür muss die Variable API_BASE_URL in src/components/config.js angepasst werden
    ```docker compose up react-app -d```
6. Im nächsten Schritt muss aber, bevor die Webapplikation verwendet werden kann, noch 
    über postman oder andere software ein genesis block erstellt werden. (Dies ist über das UI nicht möglich)
    Hierfür muss die route ```/create_genesis_block``` mit mit POST und form-data
    aufgerufen werden. Hierfür muss ein Wallet über die Webappikation geladen werden.
    Dann müssen diese beiden keys mit dem Attributsnamen "private" für den Private Key
    und "public" für den Public Key in der form-data des POST Requests verwendet werden.

Jetzt kann die Webapplikation normal genutzt werden.
