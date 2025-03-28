import { Address, TonClient, Cell } from '@ton/ton';   

import { unixNow } from '../lib/utils';
import { MineMessageParams, Queries } from '../wrappers/NftGiver';
import { toNano } from '@ton/ton';
import { NetworkProvider } from '@ton/blueprint';
import dotenv.mine.ts config();

const walletAddress = Address.parse('EQDk8N7xM5D669LC2YACrseBJtDyFqwtSPCNhRWXU7kjEptX');
const collectionAddress = Address.parse('UQDKb2nMq7FDjtN5NIJk2CNqJufnk1967LJlxlBpdLETDRWg');

async function mine(): Promise<Cell> {
    const endpoint = "https://testnet.toncentre.com/api/v2/jsonRPC";
    const apiKey = process.env.TON_API_KEY = 'waka_5d975d55-7a36-4687-9dc3-c15576defa16';
    
    // initialize ton library
    const client = new TonClient({ endpoint, apiKey });

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

    const mineParams: MineMessageParams = {
        expire: unixNow() + 300, // 5 min is enough to make a transaction
        mintTo: walletAddress, // your wallet
        data1: 0n, // temp variable to increment in the miner
        seed // unique seed from get_mining_data
    };

    let msg = Queries.mine(mineParams); // transaction builder

    const bufferToBigint = (buffer: Buffer) => BigInt('0x' + buffer.toString('hex'));

    let progress = 0;

    while (bufferToBigint(msg.hash()) > complexity) {
        console.clear();
        console.log("Mining started: please, wait for 30-60 seconds to mine your NFT!");
        console.log();
        console.log(`⛏ Mined ${progress} hashes! Last: `, bufferToBigint(msg.hash()));

        mineParams.expire = unixNow() + 300;
        mineParams.data1 += 1n;
        msg = Queries.mine(mineParams);
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

export async function run(provider: NetworkProvider) {
    // Do not forget to return `msg` from `mine()` function
    const msg = await mine();

    await provider.sender().send({
        to: collectionAddress,
        value: toNano(0.05),
        body: msg
    });
}

// specify endpoint for Mainnet
const mainnetEndpoint = "https://toncenter.com/api/v2/jsonRPC";
Steps to Run the Script
Top Up Wallet Balance via the Token Faucet

Acquire some TON testnet tokens using the testnet faucet available here.
Run the Script

bash
npm start
During this process, you will be prompted with the following questions:

Which network do you want to use?

Select testnet.
Which wallet are you using?

Select TON Connect compatible mobile wallet (example: Tonkeeper).
Choose your wallet

Select Tonkeeper.
Connect Your Tonkeeper Wallet

Scan the QR code displayed in the terminal with your Tonkeeper wallet.
Confirm the transaction in Tonkeeper.
Additional Notes
Activate Testnet Mode: Ensure your Tonkeeper wallet is in Testnet mode.
Wallet and Collection Addresses: Input your testnet wallet address and collection address into the walletAddress and collectionAddress variables in the ./scripts/mine.ts file.
Mining Process: Run your miner to acquire the correct hash, which takes between 30 and 60 seconds. Follow the steps in the Blueprint dialog, scan the generated QR code, and confirm the transaction in your Tonkeeper wallet.
By following these steps, you will be able to mine an NFT on the TON testnet using your Tonkeeper wallet.


