/**
 * Utility functions for the TON NFT Miner
 */

/**
 * Get current Unix timestamp in seconds
 * @returns Current timestamp in seconds
 */
export function unixNow(): number {
    return Math.floor(Date.now() / 1000);
}