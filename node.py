import threading
import pickle
import rpyc
from rpyc import ThreadedServer
from dataclasses import dataclass
from blockchain import Blockchain

rpyc.core.protocol.DEFAULT_CONFIG['allow_pickle'] = True
rpyc.core.protocol.DEFAULT_CONFIG['allow_public_attrs'] = True


@dataclass
class Host:
    host_name: str
    port: int


class NodeService(rpyc.Service):
    def __init__(self, node):
        self.node = node
        self.known_peers = set()

    def on_connect(self, conn):
        print("Connected to", conn)

    def on_disconnect(self, conn):
        print("Disconnected from", conn)

    def exposed_register_peer(self, host, port):
        self.known_peers.add((host, port))
        self.node.connect_to_peer(host, port)
        return True

    def exposed_get_known_peers(self):
        return list(self.known_peers)

    def exposed_get_blockchain(self):
        with open('chain.pkl', 'rb') as file:
            return pickle.load(file)

    def exposed_broadcast_block(self, block):
        self.node.handle_new_block(block)


class Node:
    def __init__(self, local_peer, initial_peer=None):
        self.host = local_peer.host_name
        self.port = local_peer.port
        self.peers = []
        self.server = ThreadedServer(NodeService(self), port=self.port,
                                     protocol_config=rpyc.core.protocol.DEFAULT_CONFIG)
        self.server_thread = threading.Thread(target=self.server.start)
        self.server_thread.daemon = True
        self.server_thread.start()
        if initial_peer is not None:
            self.join_network(initial_peer)

    def join_network(self, initial_peer):
        conn = self.connect_to_peer(initial_peer.host_name, initial_peer.port)
        known_peers = self.get_known_peers(conn)
        self.connect_to_peers(known_peers)
        self.register_all_peers()

    def connect_to_peer(self, host, port):
        conn = rpyc.connect(host, port, config=rpyc.core.protocol.DEFAULT_CONFIG)
        self.peers.append(conn)
        print(f'Connected to peer {host}:{port}')
        return conn

    def connect_to_peers(self, peers):
        for peer in peers:
            self.connect_to_peer(peer[0], peer[1])

    def get_known_peers(self, conn):
        return conn.root.get_known_peers()

    def register_all_peers(self):
        for peer in self.peers:
            try:
                peer.root.register_peer(self.host, self.port)
            except:
                self.peers.remove(peer)

    def get_current_blockchain(self):
        chains = []
        for peer in self.peers:
            try:
                chains.append(peer.root.get_blockchain())
            except:
                self.peers.remove(peer)

        longest_chain = Blockchain(chains[0])
        for c in chains:
            blockchain = Blockchain(c)
            if blockchain.get_length() >= longest_chain.get_length() and blockchain.is_valid():
                longest_chain = blockchain

        longest_chain.save_to_file()

    def handle_new_block(self, block):
        blockchain = Blockchain()
        blockchain.load_from_file()
        blockchain.chain.append(block)

        if not blockchain.is_valid():
            self.get_current_blockchain()
        else:
            blockchain.save_to_file()

    def broadcast_new_block(self, block):
        for peer in self.peers:
            try:
                peer.root.broadcast_block(block)
            except:
                self.peers.remove(peer)
