"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = run;
const ton_1 = require("@ton/ton");
const utils_1 = require("../lib/utils");
const NftGiver_1 = require("../wrappers/NftGiver");
const ton_2 = require("@ton/ton");
const dotenv = __importStar(require("dotenv"));
// Load environment variables
dotenv.config();
const walletAddress = ton_1.Address.parse('EQDk8N7xM5D669LC2YACrseBJtDyFqwtSPCNhRWXU7kjEptX');
const collectionAddress = ton_1.Address.parse('UQDKb2nMq7FDjtN5NIJk2CNqJufnk1967LJlxlBpdLETDRWg');
async function mine() {
    const endpoint = "https://testnet.toncentre.com/api/v2/jsonRPC";
    const apiKey = process.env.TON_API_KEY || 'waka_a4e87d38-488d-4c76-b6eb-b892ba63c43e';
    // initialize ton library
    const client = new ton_1.TonClient({ endpoint, apiKey });
    // fetch mining data
    const miningData = await client.runMethod(collectionAddress, 'get_mining_data');
    console.log(miningData.stack);
    const { stack } = miningData;
    const complexity = stack.readBigNumber();
    const lastSuccess = stack.readBigNumber();
    const seed = stack.readBigNumber();
    const targetDelta = stack.readBigNumber();
    const minCpl = stack.readBigNumber();
    const maxCpl = stack.readBigNumber();
    console.log({ complexity, lastSuccess, seed, targetDelta, minCpl, maxCpl });
    const mineParams = {
        expire: (0, utils_1.unixNow)() + 300, // 5 min is enough to make a transaction
        mintTo: walletAddress, // your wallet
        data1: 0n, // temp variable to increment in the miner
        seed // unique seed from get_mining_data
    };
    let msg = NftGiver_1.Queries.mine(mineParams); // transaction builder
    const bufferToBigint = (buffer) => BigInt('0x' + buffer.toString('hex'));
    let progress = 0;
    while (bufferToBigint(msg.hash()) > complexity) {
        console.clear();
        console.log("Mining started: please, wait for 30-60 seconds to mine your NFT!");
        console.log();
        console.log(`⛏ Mined ${progress} hashes! Last: `, bufferToBigint(msg.hash()));
        mineParams.expire = (0, utils_1.unixNow)() + 300;
        mineParams.data1 += 1n;
        msg = NftGiver_1.Queries.mine(mineParams);
        progress++;
    }
    console.log();
    console.log('💎 Mission completed: msg_hash less than pow_complexity found!');
    console.log();
    console.log('msg_hash: ', bufferToBigint(msg.hash()));
    console.log('pow_complexity: ', complexity);
    console.log('msg_hash < pow_complexity: ', bufferToBigint(msg.hash()) < complexity);
    return msg;
}
async function run(provider) {
    // Do not forget to return `msg` from `mine()` function
    const msg = await mine();
    await provider.sender().send({
        to: collectionAddress,
        value: (0, ton_2.toNano)(0.05),
        body: msg
    });
}
//# sourceMappingURL=mine.js.map