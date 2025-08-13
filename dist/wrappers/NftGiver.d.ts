import { Address, Cell, Contract, ContractProvider, Sender } from '@ton/ton';
export type MineMessageParams = {
    expire: number;
    mintTo: Address;
    data1: bigint;
    seed: bigint;
};
export type NftGiverConfig = {};
export declare function nftGiverConfigToCell(config: NftGiverConfig): Cell;
export declare class NftGiver implements Contract {
    readonly address: Address;
    readonly init?: {
        code: Cell;
        data: Cell;
    } | undefined;
    constructor(address: Address, init?: {
        code: Cell;
        data: Cell;
    } | undefined);
    static createFromAddress(address: Address): NftGiver;
    static createFromConfig(config: NftGiverConfig, code: Cell, workchain?: number): NftGiver;
    sendDeploy(provider: ContractProvider, via: Sender, value: bigint): Promise<void>;
    sendMine(provider: ContractProvider, via: Sender, opts: {
        expire: number;
        mintTo: Address;
        data1: bigint;
        seed: bigint;
        value: bigint;
    }): Promise<void>;
    getMiningData(provider: ContractProvider): Promise<{
        complexity: bigint;
        lastSuccess: bigint;
        seed: bigint;
        targetDelta: bigint;
        minCpl: bigint;
        maxCpl: bigint;
    }>;
}
export declare const Queries: {
    mine: (params: MineMessageParams) => Cell;
};
//# sourceMappingURL=NftGiver.d.ts.map