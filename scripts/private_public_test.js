const eea = require("./eea.js").eea;
const PrivateContract = artifacts.require("PrivateContract");
const GenericContract = artifacts.require("GenericContract");
const StoreDataContract = artifacts.require("StoreDataContract");

const privateFrom = "u5JO8TdUJiiBKh82KSniqLvVTNcrAJ+znGXtLYrRtAo="
const privateKey = "2c5e3dbf5b875a968b7a0f16156ee3b875ea0f3164c6878f6c8c20ea6b42927a"
const privacyGroupId = "VW1WdWRHRTBSR2x6ZEhKcFluVjBiM0l0VW1WdWRHRTA="
const host = "http://127.0.0.1:11018";
const chainId = 11111111;

async function main() {

    const e_ = await eea({host: host, networkId: chainId, privateFrom: privateFrom, privateKey: privateKey, libraries: {}, gasPrice: 40000, gasLimit: 20000000});

    const toReturn = {};

    // On public space:
    //   * Deploying StoreDataContract
    //   * Deploying GenericContract on public space using StoreDataContract
    // On private space:
    //   * Deploying PrivateContract using GenericContract's of public space
    //   * Call to getPublicContractData
    //   * Call to getPublicStoreContractData. It fails

    console.log("On public space:");
    console.log("  * Deploying StoreDataContract");
    const storeDataContract = await StoreDataContract.new(456);
    toReturn.public = {};
    toReturn.public.storeDataContract = {
        address: storeDataContract.address,
        transactionHash: storeDataContract.transactionHash,
        blockHash: storeDataContract.blockHash,
        blockNumber: storeDataContract.blockNumber
    }
    console.log("  * Deploying GenericContract on public space using StoreDataContract");
    const genericContract = await GenericContract.new(123, storeDataContract.address);
    toReturn.public.genericContract = {
        address: genericContract.address,
        transactionHash: genericContract.transactionHash,
        blockHash: genericContract.blockHash,
        blockNumber: genericContract.blockNumber
    };

    console.log("\n On private space:");

    console.log("  * Deploying PrivateContract using GenericContract's of public space");
    const privateContract = await e_.privDeploy(
        PrivateContract.abi,
        privacyGroupId,
        PrivateContract.bytecode,
        [genericContract.address]
    );
    toReturn.privateContract = {
        contractAddress: privateContract.contractAddress,
        transactionHash: privateContract.transactionHash,
        blockHash: privateContract.blockHash,
        blockNumber: privateContract.blockNumber
    }

    toReturn.tests = {};

    //   * Call to getPublicContractData
    console.log("  * Call to getPublicContractData");
    try {
        toReturn.tests["Call to getPublicContractData"] = await e_.privCall(
            PrivateContract.abi,
            privacyGroupId,
            privateContract.contractAddress,
            "getPublicContractData"
        );
    } catch (ex) {
        toReturn.tests["Call to getPublicContractData. It fails"] = ex.message;
    }

    //   * Call to getPublicStoreContractData. It fails
    console.log("  * Call to getPublicStoreContractData. It fails");
    try {
        toReturn.tests["Call to getPublicStoreContractData"] = await e_.privCall(
            PrivateContract.abi,
            privacyGroupId,
            privateContract.contractAddress,
            "getPublicStoreContractData"
        );
    } catch (ex) {
        toReturn.tests["Call to getPublicStoreContractData. It fails"] = ex.message;
    }

    console.log("\n\nResult of the test: \n")
    console.log(JSON.stringify(toReturn, null, 2));
    return toReturn;
}

/*
npx truffle exec scripts/private_public_test.js --network adminAro
*/

module.exports = function(callback) {
    main(
    ).then(() => callback()).catch(err => callback(err));
}
