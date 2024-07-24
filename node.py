import socket
import threading
import json
import pickle
import rpyc
from rpyc import ThreadedServer


class NodeService(rpyc.Service):
    known_peers = set()

    def on_connect(self, conn):
        print("Connected to", conn)

    def on_disconnect(self, conn):
        print("Disconnected from", conn)

    def exposed_get_data(self):
        return "Hello from peer"

    def exposed_register_peer(self, host, port):
        self.known_peers.add((host, port))
        return True

    def exposed_get_known_peers(self):
        return list(self.known_peers)


class Node:
    def __init__(self, host, port):
        self.host = host
        self.port = port
        self.peers = []
        self.server = ThreadedServer(NodeService, port=self.port)
        self.server_thread = threading.Thread(target=self.server.start)
        self.server_thread.daemon = True

    def start_server(self):
        self.server_thread.start()

    def connect_to_peer(self, host, port):
        conn = rpyc.connect(host, port)
        self.peers.append(conn)
        print(f'Connected to peer {host}:{port}')

    def connect_to_peers(self, peers):
        for peer in peers:
            self.connect_to_peer(peer.host, peer.port)

    def get_known_peers(self, conn):
        return conn.root.get_known_peers()

    def register_all_peers(self):
        for peer in self.peers:
            try:
                peer.root.register_peer(self.host, self.port)
            except:
                self.peers.remove(peer)

    def broadcast_blockchain(self, blockchain):
        for peer in self.peers:
            try:
                peer.sendall(pickle.dumps(blockchain))
            except:
                self.peers.remove(peer)
