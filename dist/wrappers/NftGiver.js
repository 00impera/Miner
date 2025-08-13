"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Queries = exports.NftGiver = void 0;
exports.nftGiverConfigToCell = nftGiverConfigToCell;
const ton_1 = require("@ton/ton");
function nftGiverConfigToCell(config) {
    return (0, ton_1.beginCell)().endCell();
}
class NftGiver {
    constructor(address, init) {
        this.address = address;
        this.init = init;
    }
    static createFromAddress(address) {
        return new NftGiver(address);
    }
    static createFromConfig(config, code, workchain = 0) {
        const data = nftGiverConfigToCell(config);
        const init = { code, data };
        return new NftGiver((0, ton_1.contractAddress)(workchain, init), init);
    }
    async sendDeploy(provider, via, value) {
        await provider.internal(via, {
            value,
            sendMode: ton_1.SendMode.PAY_GAS_SEPARATELY,
            body: (0, ton_1.beginCell)().endCell(),
        });
    }
    async sendMine(provider, via, opts) {
        await provider.internal(via, {
            value: opts.value,
            sendMode: ton_1.SendMode.PAY_GAS_SEPARATELY,
            body: exports.Queries.mine({
                expire: opts.expire,
                mintTo: opts.mintTo,
                data1: opts.data1,
                seed: opts.seed,
            }),
        });
    }
    async getMiningData(provider) {
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
exports.NftGiver = NftGiver;
exports.Queries = {
    mine: (params) => {
        return (0, ton_1.beginCell)()
            .storeUint(0x4d696e65, 32) // "Mine" op code
            .storeUint(params.expire, 32)
            .storeAddress(params.mintTo)
            .storeUint(params.data1, 256)
            .storeUint(params.seed, 128)
            .endCell();
    },
};
//# sourceMappingURL=NftGiver.js.map