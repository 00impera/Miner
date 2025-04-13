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

final tip
Because other developers may be carrying out the same process in an attempt to mine their own NFT, you may need to try the process a couple of times to succeed (as another user could mine the next NFT available right before you).

Soon after initiating this process, you will have successfully mined your very first NFT on TON (it should appear in your Tonkeeper wallet).

Welcome aboard, a true TON Developer! You did it. 🛳

Genuine: NFT Mainnet Mining
Hey! For those who wish to mine an NFT on TON Mainnet, these instructions should be followed:

You have activated mainnet mode in your Tonkeeper (it should hold at least 0.1 TON).
Input our mainnet wallet address from Tonkeeper into walletAddress variable in the ./scripts/mine.ts
Input address of the NFT collection from the Mainnet into collectionAddress variable in the ./scripts/mine.ts
Replace endpoint to the Mainnet:
./scripts/mine.ts
// specify endpoint for Mainnet
const endpoint = "https://toncenter.com/api/v2/jsonRPC"


Mine A Mainnet NFT Rocket
Like we outlined in the testnet NFT rocket mining process, in order to successfully mine an NFT rocket on mainnet, it is necessary to follow these steps:

Open the Tonkeeper wallet on your phone (remember, it should hold some TON tokens).
Select scan mode in the wallet to scan the QR code.
Run your miner to acquire the correct hash (this process takes between 30 and 60 seconds).
Follow steps in Blueprint dialog.
Scan the generated QR code from the miner.
Confirm the transaction in your Tonkeeper wallet.
final tip
Because there may be other developers carrying out the same process in an attempt to mine their own NFT, you may have to try the process a couple times to be successful (as another user could mine the next NFT available right before you).

After some time, you will have mined your NFT and become a TON Developer in TON Blockchain. The ritual is complete. Look at your NFT in Tonkeeper.

Welcome aboard, a TON Developer! You did it. 🛳

🧙 What's next?
First, take a rest! You did a big task! You are a TON developer now. But it's only the beginning of the long way.

# Detailed Instructions for Setting Up the Environment, Running the Script, and Verifying the Results

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- Node.js (version 14 or higher)
- npm (Node Package Manager)

## Setting Up the Environment

1. **Clone the Repository**

   Open your terminal and run the following command to clone the repository:

   ```bash
   git clone https://github.com/00impera/Miner.git
   ```

2. **Navigate to the Project Directory**

   Change to the project directory:

   ```bash
   cd Miner
   ```

3. **Install Dependencies**

   Install the required dependencies by running:

   ```bash
   npm install
   ```

4. **Top Up Your Wallet Balance**

   Acquire some TON testnet tokens using the testnet faucet available [here](https://testnet.ton.org/faucet).

## Running the Script

1. **Start the Script**

   Run the script by executing:

   ```bash
   npm start
   ```

2. **Follow the Prompts**

   During this process, you will be prompted with the following questions:

   - **Which network do you want to use?**

     Select `testnet`.

   - **Which wallet are you using?**

     Select `TON Connect compatible mobile wallet` (example: Tonkeeper).

   - **Choose your wallet**

     Select `Tonkeeper`.

3. **Connect Your Tonkeeper Wallet**

   Scan the QR code displayed in the terminal with your Tonkeeper wallet.

4. **Confirm the Transaction**

   Confirm the transaction in your Tonkeeper wallet.

## Verifying the Results

After successfully running the script, you should see your mined NFT in your Tonkeeper wallet.

## Troubleshooting Tips and Common Issues

- **Ensure Testnet Mode is Activated**

  Make sure your Tonkeeper wallet is in Testnet mode.

- **Check Wallet and Collection Addresses**

  Ensure you have input your testnet wallet address and collection address into the `walletAddress` and `collectionAddress` variables in the `./scripts/mine.ts` file.

- **Mining Process Takes Time**

  The mining process can take between 30 and 60 seconds. Be patient and follow the steps in the Blueprint dialog.

- **Try Multiple Times**

  If other developers are also mining NFTs, you may need to try the process a couple of times to succeed.

By following these steps and tips, you will be able to mine an NFT on the TON testnet using your Tonkeeper wallet.

## Additional Notes

- **Mainnet Mining**

  For those who wish to mine an NFT on TON Mainnet, follow the instructions provided in the `README.md` under the "Genuine: NFT Mainnet Mining" section.

- **Next Steps**

  After successfully mining your NFT, take a rest and celebrate your achievement as a TON Developer. This is just the beginning of your journey in the TON ecosystem.
