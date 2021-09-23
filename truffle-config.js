// besu
const HDWalletProvider = require("truffle-hdwallet-provider");

const PRIVATE_KEY = "9e5c50f9c8d81cadcdd53da98ecb466bdeb0e148b7e062b0d673938b3bcddbe8";

const BESU_LOCAL_URL = "http://127.0.0.1:22001"

const BESU_LOCAL_PROVIDER = new HDWalletProvider(PRIVATE_KEY, BESU_LOCAL_URL);

module.exports = {
  networks: {
    besuLocal: {
      provider: BESU_LOCAL_PROVIDER,
      network_id: "*",
      gas: 20000000,
      gasPrice: 0,
    },
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*",
      gas: 30000000,
    },
    test: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
      gas: 30000000,
    },

  },

  compilers: {
    solc: {
      version: "0.7.5",
      settings: {
        optimizer: {
          enabled: true,
          runs: 1
        },
        evmVersion: "istanbul"
      },

    },
  },
  plugins: [
  ]

};
