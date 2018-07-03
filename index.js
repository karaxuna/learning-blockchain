const crypto = require('crypto');

class Block {
    constructor(data) {
        this.data = data;
        this.previousBlockHash;
        this.hash;
    }

    calculateHash() {
        if (!this.previousBlockHash) {
            throw new Error('Block has not been added to chain.');
        }

        return crypto.createHmac('sha256', 'secret')
            .update(JSON.stringify(this.data) + this.previousBlockHash)
            .digest('hex');
    }

    setHashes(previousBlockHash) {
        this.previousBlockHash = previousBlockHash;
        this.hash = this.calculateHash();
    }
}

class Blockchain {
    constructor() {
        this.blocks = [];
    }

    addBlock(block) {
        block.setHashes(this.blocks.length ? this.blocks[this.blocks.length - 1].hash : '0');
        this.blocks.push(block);
    }

    validateChain() {
        let i,
            currentBlock,
            previousBlock;

        for (i = 0; i < this.blocks.length; i++) {
            currentBlock = this.blocks[i];
            previousBlock = this.blocks[i - 1];

            if (currentBlock.calculateHash() !== currentBlock.hash || previousBlock && currentBlock.previousBlockHash !== previousBlock.hash) {
                return false;
            }
        }

        return true;
    }
}

let blockchain = new Blockchain();
blockchain.addBlock(new Block('Hi, my '));
blockchain.addBlock(new Block('name is '));
blockchain.addBlock(new Block('Kakhaber.'));

let valid = blockchain.validateChain();
console.log('Validity before changing data:', valid);

blockchain.blocks[1].data = 'Altered data should make blockchain invalid.';
blockchain.blocks[1].setHashes(blockchain.blocks[0].hash);

valid = blockchain.validateChain();
console.log('Validity after changing data:', valid);
console.log('Chain:', JSON.stringify(blockchain.blocks, null, 4));
