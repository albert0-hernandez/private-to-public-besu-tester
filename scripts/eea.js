const EEAClient = require("web3-eea");
const Web3 = require("web3");
const { privateToAddress } = require("ethereumjs-util");

let config;
let web3;

async function eea(eeaConfig) {
    if (!(eeaConfig.host && eeaConfig.networkId && eeaConfig.privateFrom && eeaConfig.privateKey && eeaConfig.gasPrice, eeaConfig.gasLimit)) {
        throw new Error("config must include web3, networkId, privateFrom, privateKey, gasPrice and gasLimit");
    }
    config = eeaConfig;
    web3 = new EEAClient(
        new Web3(
            new Web3.providers.HttpProvider(
                config.host
            )
        ),
        config.networkId,
        config.gasPrice,
        config.gasLimit
    );
    config.privateKeyBuffer = Buffer.from(config.privateKey, "hex");
    config.from = `0x${privateToAddress(config.privateKeyBuffer).toString("hex")}`;

    return {
        config: eeaConfig,
        web3: web3,
        privDeploy: async (abi, privacyGroupId, bytecode, arguments = null) => {
            const contract = new web3.eth.Contract(abi);

            const transaction = {
                data: contract.deploy({data: bytecode, arguments: arguments}).encodeABI()
            };

            transaction.privateFrom = config.privateFrom;
            transaction.privacyGroupId = privacyGroupId;
            transaction.privateKey = config.privateKey;
            const transactionHash = await web3.eea.sendRawTransaction(transaction);
            return await web3.priv.getTransactionReceipt(transactionHash, config.privateFrom);
        },
        privSend: async (abi, privacyGroupId, address, method, arguments) => {
            const contract = new web3.eth.Contract(abi);

            // eslint-disable-next-line no-underscore-dangle
            const functionAbi = contract._jsonInterface.find(e => {
                return e.name === method;
            });

            const functionArgs =
                arguments !== null
                    ? web3.eth.abi.encodeParameters(functionAbi.inputs, arguments).slice(2)
                    : null;

            const functionCall = {
                to: address,
                data:
                    functionArgs !== null
                        ? functionAbi.signature + functionArgs
                        : functionAbi.signature,
                privateFrom: config.privateFrom,
                privacyGroupId: privacyGroupId,
                privateKey: config.privateKey,
                restriction: 'unrestricted'
            };
            let privateTxHash = await web3.eea.sendRawTransaction(functionCall);
            // console.log("Transaction Hash:", privateTxHash);
            return await web3.priv.getTransactionReceipt(privateTxHash, config.privateFrom);
        },
        privCall: async (abi, privacyGroupId, address, method, arguments = null, blockNumber = "latest") => {
            const contract = new web3.eth.Contract(abi);

            // eslint-disable-next-line no-underscore-dangle
            const functionAbi = contract._jsonInterface.find(e => {
                return e.name === method;
            });

            const functionArgs =
                arguments !== null
                    ? web3.eth.abi.encodeParameters(functionAbi.inputs, arguments).slice(2)
                    : null;

            const functionCall = {
                from: config.from,
                to: address,
                data:
                    functionArgs !== null
                        ? functionAbi.signature + functionArgs
                        : functionAbi.signature,
                privacyGroupId: privacyGroupId,
                blockNumber: blockNumber
            };
            let result = await web3.priv.call(functionCall);
            return web3.eth.abi.decodeParameters(functionAbi.outputs, result);
        }
    };
}

module.exports = {
    eea
}
