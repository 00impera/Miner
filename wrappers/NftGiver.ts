import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/ton';

export type MineMessageParams = {
    expire: number;
    mintTo: Address;
    data1: bigint;
    seed: bigint;
};

export type NftGiverConfig = {
    // Add any configuration needed for the NFT Giver contract
};

export function nftGiverConfigToCell(config: NftGiverConfig): Cell {
    return beginCell().endCell();
}

export class NftGiver implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new NftGiver(address);
    }

    static createFromConfig(config: NftGiverConfig, code: Cell, workchain = 0) {
        const data = nftGiverConfigToCell(config);
        const init = { code, data };
        return new NftGiver(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async sendMine(
        provider: ContractProvider,
        via: Sender,
        opts: {
            expire: number;
            mintTo: Address;
            data1: bigint;
            seed: bigint;
            value: bigint;
        }
    ) {
        await provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: Queries.mine({
                expire: opts.expire,
                mintTo: opts.mintTo,
                data1: opts.data1,
                seed: opts.seed,
            }),
        });
    }

    async getMiningData(provider: ContractProvider) {
        const result = await provider.get('get_mining_data', []);
        return {
            complexity: result.stack.readBigNumber(),
            lastSuccess: result.stack.readBigNumber(),
            seed: result.stack.readBigNumber(),
            targetDelta: result.stack.readBigNumber(),
            minCpl: result.stack.readBigNumber(),
            maxCpl: result.stack.readBigNumber(),
        };
    }
}

export const Queries = {
    mine: (params: MineMessageParams): Cell => {
        return beginCell()
            .storeUint(0x4d696e65, 32) // "Mine" op code
            .storeUint(params.expire, 32)
            .storeAddress(params.mintTo)
            .storeUint(params.data1, 256)
            .storeUint(params.seed, 128)
            .endCell();
    },
};