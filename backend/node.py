import threading
from types import NoneType

import rpyc
import asyncio

from rpyc import ThreadedServer
from blockchain import Blockchain
from kademlia.network import Server

rpyc.core.protocol.DEFAULT_CONFIG['allow_pickle'] = True
rpyc.core.protocol.DEFAULT_CONFIG['allow_public_attrs'] = True

RPC_PORT = 5000  # Port for blockchain rpc
DHT_PORT = 5500  # Port for distributed hash table used to find nodes

MAX_PEERS = 5  # max peer group size, the max number of other connected clients


class NodeService(rpyc.Service):
    def __init__(self, node):
        self.node = node  # reference to local node object
        self.peers = []

    def on_connect(self, conn):
        self.peers.append(conn)
        # limit the number of connections
        if len(self.peers) > MAX_PEERS:
            conn.close()
            self.node.logger.info("RPYC Server --- closed new connection - current peers: " + str(len(self.peers)))
        else:
            self.node.logger.info("RPYC Server --- connected to a client - current peers: " + str(len(self.peers)))

    def on_disconnect(self, conn):
        self.peers.remove(conn)
        self.node.logger.info("RPYC Server --- disconnected from a client - current peers: " + str(len(self.peers)))

    def exposed_get_blockchain(self):
        blockchain = Blockchain()
        blockchain.load_from_file()
        return blockchain.chain

    def exposed_broadcast_block(self, block):
        blockchain = Blockchain()
        blockchain.load_from_file()
        self.node.logger.info(f'A new block has reached this node. Index: {block.index}')
        if blockchain.chain:
            if blockchain.get_length() < block.index:
                blockchain.chain.append(block)
                if blockchain.is_valid():
                    blockchain.save_to_file()
                    self.node.logger.info("The new block is saved")
                    # send it to own peers
                    self.node.broadcast_new_block(block)
                    return
            else:
                return  # block is already there or behind
        self.node.get_current_blockchain()


class Node:
    def __init__(self, logger, local_peer, initial_peer=None, has_service=False):
        self.logger = logger
        self.host = local_peer  # Address used for registration in the network
        self.register_service = has_service  # if true this node is registered as api service
        self.index = 0
        self.peers = dict()  # Key: Host IP, Value: Connection Object
        # RPYC
        self.server = ThreadedServer(NodeService(self), port=RPC_PORT,
                                     protocol_config=rpyc.core.protocol.DEFAULT_CONFIG)
        self.server_thread = threading.Thread(target=self.server.start)
        self.server_thread.daemon = True
        self.server_thread.start()
        # DHT
        self.dht_server = Server()
        self.maintain_peers_thread = threading.Thread(target=self.start_maintain_peers, args=(initial_peer,))
        self.maintain_peers_running = False
        self.maintain_peers_thread.start()
        self.known_services = set()  # set of other nodes that have an api service

    async def join_network(self):
        current = await self.get_current_node_index()
        self.logger.info(f'Joining network on index {current}')
        for i in range(current):
            new_node = await self.dht_server.get('node' + str(current - i))
            self.connect_to_peer(new_node)
            if len(self.peers) >= MAX_PEERS:
                break
        if (self.index is None or  # register as (1,2,3,4,...) host
                self.index == 0 and current != 0 or  # register as init host
                current - self.index > MAX_PEERS):  # Detached index
            await self.register_network()

    async def register_network(self):
        current = await self.get_current_node_index() + 1
        await self.dht_server.set('node' + str(current), self.host)
        await self.dht_server.set('current', str(current))
        self.index = current
        self.logger.info(f'Registered to network on index {current}')

    async def get_current_node_index(self) -> int:
        try:
            result = await self.dht_server.get('current')
            current = int(result)
            return current
        except Exception as e:
            self.logger.error(e)
            return 0

    def connect_to_peer(self, host) -> bool:
        if host in self.peers or self.host == host:
            return False
        try:
            conn = rpyc.connect(host, RPC_PORT, config=rpyc.core.protocol.DEFAULT_CONFIG)
            self.peers[host] = conn
            self.logger.info(f'Connected to peer {host}:{RPC_PORT}')
            return True
        except Exception as e:
            self.logger.error(e)
            self.logger.info(f'Failed to connect to peer {host}:{RPC_PORT}')
            return False

    async def connect_to_bootstrap_node(self, node):
        await self.dht_server.listen(DHT_PORT)
        bootstrap_node = (node, DHT_PORT)
        await self.dht_server.bootstrap([bootstrap_node])
        self.index = None  # set to None to register to network later
        self.logger.info('Connect to bootstrap node ' + node)

    async def create_bootstrap_node(self):
        await self.dht_server.listen(DHT_PORT)
        self.logger.info('Started bootstrap node')

    def start_maintain_peers(self, initial_peer=None):
        self.maintain_peers_running = True
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        loop.set_debug(True)

        if initial_peer is not None:
            loop.run_until_complete(self.connect_to_bootstrap_node(initial_peer))
        else:
            loop.run_until_complete(self.create_bootstrap_node())
        try:
            loop.run_until_complete(self.run_maintain_loop())
        except KeyboardInterrupt:
            pass
        finally:
            self.dht_server.stop()
            loop.close()

    def stop_maintain_peers(self):
        self.maintain_peers_running = False

    async def run_maintain_loop(self):
        while self.maintain_peers_running:
            await self.update_peers()
            await asyncio.sleep(15)
            await self.update_peers()
            await asyncio.sleep(15)
            await self.ping_all_peers()  # get rid of broken connections
            await self.sync_known_services()  # sync the known api services

    async def update_peers(self):
        peers = list(self.peers.keys())
        self.logger.info(f'Current peers ({len(peers)}): {peers}')
        while len(self.peers) > MAX_PEERS:
            host, peer = self.peers.popitem()
            peer.close()  # Close last peer
        if len(self.peers) < MAX_PEERS:
            # join the network again to get more peers
            await self.join_network()
        peers = list(self.peers.keys())
        self.logger.info(f'Updated peers ({len(peers)}): {peers}')

    async def ping_all_peers(self):
        peers = list(self.peers.keys())
        for peer in peers:
            try:
                self.peers[peer].ping()
            except Exception as e:
                self.logger.error(e)
                del self.peers[peer]

    def get_current_blockchain(self):
        chains = []
        peers = list(self.peers.keys())
        self.logger.info(f'Fetching blockchain from {len(peers)} Node(s)')
        for peer in peers:
            try:
                chains.append(self.peers[peer].root.get_blockchain())
            except Exception as e:
                self.logger.error(e)
                del self.peers[peer]

        longest_chain = Blockchain(chains[0])
        for c in chains:
            blockchain = Blockchain(c)
            if blockchain.get_length() >= longest_chain.get_length() and blockchain.is_valid():
                longest_chain = blockchain

        self.logger.info(f'The new Blockchain has {longest_chain.get_length()} Block(s)')
        longest_chain.save_to_file()

    def broadcast_new_block(self, block):
        peers = list(self.peers.keys())
        self.logger.info(f'Broadcasting block to {len(peers)} Node(s)')
        for peer in peers:
            try:
                self.peers[peer].root.broadcast_block(block)
            except Exception as e:
                self.logger.error(e)
                del self.peers[peer]

    async def sync_known_services(self):
        try:
            result = await self.dht_server.get('current_service')
            if not isinstance(result, str):
                result = '0'
            current = int(result)
            for h in range(1, current + 1):
                host = await self.dht_server.get('service' + str(h))
                self.known_services.add(host)
            if self.register_service:
                current = current + 1
                await self.dht_server.set('service' + str(current), self.host)
                await self.dht_server.set('current_service', str(current))
                self.logger.info(f'Registered this node as api service on index {current}')
                self.register_service = False

        except Exception as e:
            self.logger.error(e)
            return 0
