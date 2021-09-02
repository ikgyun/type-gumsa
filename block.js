const fs = require('fs')
const merkle = require('merkle')
const CryptoJs = require('crypto-js')

/* merkle 사용법 */
// const tree = merkle("sha256").sync([]) //tree 구조
// tree.root()

class BlockHeader {
    constructor(version, index, previousHash, time, merkleRoot) {
        this.version = version
        this.index = index
        this.previousHash = previousHash  // 마지막 블럭 -> header -> string 연결 -> sha256
        this.time = time
        this.merkleRoot = merkleRoot
    }
}

class Block {
    constructor(header, body) {
        this.header = header
        this.body = body
    }
}

let Blocks = [createGenesisBlock()]

function getBlocks() {
    return Blocks
}
function getLastBlock() {
    return Blocks[Blocks.length - 1]
}

function createGenesisBlock() {
    // 1.header 만들기
    // 2. 5개의 인자값 만들기

    const version = getVersion(); //1.0.0
    const index = 0;
    const previousHash = '0'.repeat(64);
    const time = getCurrentTime();
    const body = ['hello block'];

    const tree = merkle('sha256').sync(body);
    const root = tree.root() || '0'.repeat(64)

    const header = new BlockHeader(version, index, previousHash, time, root)
    return new Block(header, body)
}

// const blockchain = new Block(new BlockHeader(1,2,3,4,5),['hello'])
// console.log(blockchain)

/*
const header = new BlockHeader(1,2,3,4,5)
const header2 = new BlockHeader(1,2,3,4,6)
console.log(header)
console.log(header2)
*/


function addBlock(data) {
    // new header -> new block ( header, body )
    // block 조건
    const newBlock = nextBlock(data)
    if (isValidNewBlock(newBlock, getLastBlock())) {
        Blocks.push(newBlock);
        return true;
    }
    return false;

}

/* 1: 타입검사 */
function isValidNewBlock(currentBlock, previousBlock) {
    isValidType(currentBlock)
    return true
}

function isValidType(){
    console.log(block)
}

function getVersion() {
    const { version } = JSON.parse(fs.readFileSync("../package.json"))
    return version
}

function getCurrentTime() {
    return Math.ceil(new Date().getTime() / 1000)
}

// 다음블럭의 Header와 Body를 만들어주는 함수
function nextBlock(data) {
    // header
    const prevBlock = getLastBlock()
    const version = getVersion()
    const index = prevBlock.header.index + 1
    const previousHash = createHash(prevBlock)
    const time = getCurrentTime()

    const merkleTree = merkle("sha256").sync(data)
    const merkleRoot = merkleTree.root() || '0'.repeat(64)

    const header = new BlockHeader(version, index, previousHash, time, merkleRoot)
    return new Block(header, data)
}

function createHash(block) {
    const {
        version,
        index,
        previousHash,
        time,
        merkleRoot,
    } = block.header
    const blockString = version + index + previousHash + time + merkleRoot
    const Hash = CryptoJs.SHA256(blockString).toString()
    return Hash
}

// function addBlock(){ 
//     const version = getVersion();
//     const index = getLastBlock().header.index+1;
//     const previousHash = `${getLastBlock().header.index+1}`.repeat(64);
//     const time = getCurrentTime();
//     const body = ['hello block'];

//     const tree = merkle('sha256').sync(body);
//     const root = tree.root() || `${getLastBlock().header.index+1}`.repeat(64)

//     const header = new BlockHeader(version,index,previousHash,time,root)
//     Blocks.push(new Block(header,body))
// }

addBlock(["hello1"]);
addBlock(["hello2"]);
addBlock(["hello3"]);

console.log(Blocks)