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

    def start_server(port):
        server = ThreadedServer(NodeService, port=port)
        server.start()

    def connect_to_peer(self, host, port):
        conn = rpyc.connect(host, port)
        self.peers.append(conn)
        print(f'Connected to peer {host}:{port}')

    def register_with_peer(host, port, my_host, my_port):
        conn = rpyc.connect(host, port)
        conn.root.register_peer(my_host, my_port)
        conn.close()

    def broadcast_blockchain(self, blockchain):
        for peer in self.peers:
            try:
                peer.sendall(pickle.dumps(blockchain))
            except:
                self.peers.remove(peer)
