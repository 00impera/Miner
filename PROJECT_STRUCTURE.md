# Project Structure

This repository now contains all necessary files for the TON NFT Miner:

## Files Added

### Core Configuration
- `package.json` - Project dependencies and npm scripts
- `tsconfig.json` - TypeScript compilation configuration
- `blueprint.config.ts` - Blueprint framework configuration for TON blockchain
- `.env.example` - Environment variables template

### Source Code
- `scripts/mine.ts` - Main mining script with TON blockchain interaction
- `lib/utils.ts` - Utility functions (unixNow)
- `wrappers/NftGiver.ts` - Contract wrapper for NFT mining operations

### Installation Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/00impera/Miner.git
   cd Miner
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start mining:**
   ```bash
   npm start
   ```

The project will prompt you to select a wallet (Tonkeeper recommended) and guide you through the NFT mining process on the TON blockchain.

## Dependencies

- `@ton/ton` - TON blockchain SDK
- `@ton/blueprint` - TON development framework
- `dotenv` - Environment variables management
- `typescript` - TypeScript compiler
- `@types/node` - Node.js type definitions