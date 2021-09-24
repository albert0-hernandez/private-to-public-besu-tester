const eea = require("./eea.js").eea;
const PrivateContract = artifacts.require("PrivateContract");
const GenericContract = artifacts.require("GenericContract");
const StoreDataContract = artifacts.require("StoreDataContract");

const privateFrom = "AMx3eyWwGYwn2/hK3YCLYcJJUOYPiepNW/mPpUQvD08=";//"Pvoq/2SSAeECW5NWk8HDNw+goyunM4fO6c98Hcb8sWE="
const privateKey = "b97f959696fd9b2e829cc8dc83d33f0ec691657898eaa135af642a59f2d9a1f4"
const privacyGroupId = "UVZoQkxVbE9SekF3TURBd01EQXdNREF3TURBd01EQXc="
const host = "http://127.0.0.1:22001";
const chainId = 2021;

async function main() {

    const e_ = await eea({host: host, networkId: chainId, privateFrom: privateFrom, privateKey: privateKey, libraries: {}, gasPrice: 0, gasLimit: 20000000});

    const toReturn = {};

    // 1. On public space:
    //   1.a. Deploying StoreDataContract
    //   1.b. Deploying GenericContract on public space using StoreDataContract
    // 2. On private space:
    //   2.a. Deploying PrivateContract using GenericContract's of public space
    //   2.b. Call to getPublicContractData
    //   2.c. Call to getPublicStoreContractData. It fails

    console.log("1. On public space:");
    console.log("  1.a. Deploying StoreDataContract");
    const storeDataContract = await StoreDataContract.new(456);
    toReturn.public = {};
    toReturn.public.storeDataContract = {
        address: storeDataContract.address,
        transactionHash: storeDataContract.transactionHash,
        blockHash: storeDataContract.blockHash,
        blockNumber: storeDataContract.blockNumber
    }
    console.log("  1.b. Deploying GenericContract on public space using StoreDataContract");
    const genericContract = await GenericContract.new(123, storeDataContract.address);
    toReturn.public.genericContract = {
        address: genericContract.address,
        transactionHash: genericContract.transactionHash,
        blockHash: genericContract.blockHash,
        blockNumber: genericContract.blockNumber
    };

    console.log("\n2. On private space:");
    console.log("  2.a. Deploying PrivateContract using GenericContract's of public space");
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
    console.log("  2.b. Call to getPublicContractData");
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
    console.log("  2.c. Call to getPublicStoreContractData. It fails");
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
npx truffle exec scripts/private_public_test.js --network besuLocal
*/

module.exports = function(callback) {
    main(
    ).then(() => callback()).catch(err => callback(err));
}
