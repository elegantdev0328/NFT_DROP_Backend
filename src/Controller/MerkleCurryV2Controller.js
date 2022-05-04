var HttpStatusCodes = require('http-status-codes');
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");
const { utils, BigNumber } = require("ethers");
var {freeBBModel} = require('../Model/FreeBBModel')
const {curryV2GCFSnapshotModel} = require('../Model/CurryV2GCFSnapshotModel');

const initMerkleSingle = async (gameId) => {
    whitelist = await freeBBModel.find({game_id : gameId});

    const addresses = [];
    whitelist.map(item => {
        addresses.push(item.wallet);
    })
    const leafNodes = await addresses.map(addr => keccak256(addr));
    const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
    return merkleTree;
}

const initMerkleMultiple = async (data) => {
    const leafNodes = await data.map((node) => {
        return utils.solidityKeccak256( ["address", "uint"], [node['address'], parseInt(node['quantity'])]);
    });
    const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
    return merkleTree;
}

const getBBRoot = async (gameId) => {
    const merkleTree = await initMerkleSingle(gameId);
    const rootHash = merkleTree.getHexRoot();
    return rootHash;
}

const getBBHexProof = async (request, response) => {
    const {gameId, wallet} = request.params;
    const merkleTree = await initMerkleSingle(gameId);
    const claimingAddress = keccak256(wallet);
    const hexProof = merkleTree.getHexProof(claimingAddress);
    return response.status(HttpStatusCodes.OK).send(hexProof);
}

const getGCFRoot = async (request, response) => {
    const gcfData = await curryV2GCFSnapshotModel.find({});
    const merkleTree = await initMerkleMultiple(gcfData);
    const rootHash = merkleTree.getHexRoot();
    return response.status(HttpStatusCodes.OK).send(rootHash);
}


const getGCFHexProof = async (request, response) => {
    const {wallet} = request.params;
    const userData = await curryV2GCFSnapshotModel.find({address: wallet.toLowerCase()});
    if(userData.length == 0) {
        return response.status(HttpStatusCodes.OK).send({
            quantity: 0,
            hexProof: []
        });
    } else {
        const gcfData = await curryV2GCFSnapshotModel.find({});
        const merkleTree = await initMerkleMultiple(gcfData);
        const claimingAddress = utils.solidityKeccak256(["address", "uint"],[userData[0]['address'], parseInt(userData[0]['quantity'])]);
        const hexProof = merkleTree.getHexProof(claimingAddress);
        return response.status(HttpStatusCodes.OK).send({
            quantity: parseInt(userData[0]['quantity']),
            hexProof: hexProof
        });
    }
    
}
module.exports = {
    getBBRoot,
    getGCFRoot,
    getBBHexProof,
    getGCFHexProof
}