import socket
import threading
import json
import pickle
import rpyc


class Node:
    def __init__(self, host, port):
        self.host = host
        self.port = port
        self.peers = []

    def start_server(self):
        server = threading.Thread(target=self.server_thread)
        server.start()

    def server_thread(self):
        server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        server_socket.bind((self.host, self.port))
        server_socket.listen(5)
        print(f'Server started on {self.host}:{self.port}')

        while True:
            conn, addr = server_socket.accept()
            print(f'Connected by {addr}')
            client_thread = threading.Thread(target=self.client_handler, args=(conn,))
            client_thread.start()

    def client_handler(self, conn):
        while True:
            try:
                data = conn.recv(4096)
                if not data:
                    break
                self.handle_message(data)
            except:
                break
        conn.close()

    def connect_to_peer(self, peer_host, peer_port):
        peer_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        peer_socket.connect((peer_host, peer_port))
        self.peers.append(peer_socket)
        print(f'Connected to peer {peer_host}:{peer_port}')

    def broadcast_transaction(self, transaction):
        for peer in self.peers:
            try:
                peer.sendall(json.dumps(transaction).encode())
            except:
                self.peers.remove(peer)

    def broadcast_blockchain(self, blockchain):
        for peer in self.peers:
            try:
                peer.sendall(pickle.dumps(blockchain))
            except:
                self.peers.remove(peer)

    def handle_message(self, message):
        chain = pickle.loads(message)
        print(f'Received blockchain: {chain}')
