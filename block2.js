const fs = require('fs')
const merkle = require('merkle')
const CryptoJs = require('crypto-js');


class BlockHeader {
    constructor(version,index,previousHash,time,merkleRoot){
        this.version = version
        this.index = index
        this.previousHash = previousHash
        this.time = time
        this.merkleRoot = merkleRoot
    }
}

class Block{
    constructor(header,body){
        this.header = header
        this.body = body
    }
}

function getVersion() {
    const {version} = JSON.parse(fs.readFileSync('../package.json'))
    return version;
}

function getCurrentTime() {
    return Math.ceil(new Date().getTime()/1000)
}

function createGenesisBlock(){
    const version = getVersion()
    const index = 0;
    const previousHash = '0'.repeat(64)
    const time = getCurrentTime()
    const body = ['hi uick']

    const tree = merkle('sha256').sync(body)
    const root = tree.root() || '0'.repeat(64)
    const header = new BlockHeader(version,index,previousHash,time,root)
    return new Block(header, body);
}

let Blocks = [createGenesisBlock()];

function getLastBlock() {
    return Blocks[Blocks.length-1]
}

function addBlock() {
    const version = getVersion()
    const index = getLastBlock().header.index+1;
    const previousHash = `${getLastBlock().header.index+1}`.repeat(64)
    const time = getCurrentTime()
    const body = ['hi uick']

    const tree = merkle('sha256').sync(body)
    const root = tree.root() || `${getLastBlock().header.index+1}`.repeat(64)
    const header = new BlockHeader(version,index,previousHash,time,root)
    Blocks.push(new Block(header,body));
}

addBlock()
addBlock()

console.log(Blocks);