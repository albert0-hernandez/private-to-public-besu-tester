const eea = require("./eea.js").eea;
const PrivateContract = artifacts.require("PrivateContract");
const GenericContract = artifacts.require("GenericContract");
const StoreDataContract = artifacts.require("StoreDataContract");

const privateFrom = "AMx3eyWwGYwn2/hK3YCLYcJJUOYPiepNW/mPpUQvD08=";//"Pvoq/2SSAeECW5NWk8HDNw+goyunM4fO6c98Hcb8sWE="
const privateKey = "9e5c50f9c8d81cadcdd53da98ecb466bdeb0e148b7e062b0d673938b3bcddbe8"
const privacyGroupId = "UVZoQkxVbE9SekF3TURBd01EQXdNREF3TURBd01EQXc="
const host = "http://127.0.0.1:22001";
const chainId = 2021;

async function main() {

    const e_ = await eea({host: host, networkId: chainId, privateFrom: privateFrom, privateKey: privateKey, libraries: {}, gasPrice: 0, gasLimit: 20000000});

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
npx truffle exec scripts/private_public_test.js --network besuLocal
*/

module.exports = function(callback) {
    main(
    ).then(() => callback()).catch(err => callback(err));
}
