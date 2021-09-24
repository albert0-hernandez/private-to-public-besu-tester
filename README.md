# PRIVATE TO PUBLIC BESU TESTER

Project to test the Besu bug founded in 27.1.4 when a private contract calls to a public contract that also calls to another public contract.

## Besu test network

In order to simplify testing, a besu network is integrated with 3 nodes: 1 validator and two nodes with privacy and tessera.

In order to use this facility, it is necessary to have docker and docker-compose installed on the machine.

### Starting besu

To start the network and configure the privacy group:

```sh
$ npm run start-besu
```

#### Throubleshooting

If during first start-besu, during the creation of the privacy group it fails with:

```
(node:46296) UnhandledPromiseRejectionWarning: Error: Returned error: Onchain Privacy group does not exist.
```

Run in the console:
```sh
$ npm run stop-besu
$ npm run start-besu
```

### Stopping besu

Para parar la red y borrar los volúmenes docker:

```sh
$ npm run stop-besu
```

## Reproducing the issue

With the Besu network started, run `npm test` from the console to reproduce the described problem, and the result will look like this:

```sh
$ npm test

> afb-private-to-public-besu-tester@1.0.0 test
> npx truffle exec scripts/private_public_test.js --network adminAro

Using network 'adminAro'.

On public space:
  * Deploying StoreDataContract
  * Deploying GenericContract on public space using StoreDataContract

 On private space:
  * Deploying PrivateContract using GenericContract's of public space
Waiting for transaction to be mined ...
  * Call to getPublicContractData
  * Call to getPublicStoreContractData. It fails


Result of the test: 

{
  "public": {
    "storeDataContract": {
      "address": "0x32C6E44A0cF079263d7bAE8794D1A475797c1e23",
      "transactionHash": "0x4b7ae005ee84134846e45d83834a3cc090a6e78e993f17522f24cb9e36801da3"
    },
    "genericContract": {
      "address": "0x365375f44E9a6E87f0942766814740E5e8df609E",
      "transactionHash": "0x8e80d9eb9b62a34c56dae00709b9bdab5540463301dec3eaea8440e8a2870efd"
    }
  },
  "privateContract": {
    "contractAddress": "0x955ae4fb988b9481c5cb8b1bc110a352b35363af",
    "transactionHash": "0x29ece49d638844a8d507e8d65d18bc437fec9717e9ac60c408ba2542afb0b8c8",
    "blockHash": "0x45ad0fcd1055a06683af14ff6f5b1eeeb152ac31b33f8d5c6b568793b21864b4",
    "blockNumber": "0xcb5e"
  },
  "tests": {
    "Call to getPublicContractData": {
      "0": "123",
      "__length__": 1
    },
    "Call to getPublicStoreContractData. It fails": "Returned error: Invalid params"
  }
}
```

When a contract deployed in the private space calls another contract deployed in the public space that also calls another public contract, it fails with a result of 0x.
