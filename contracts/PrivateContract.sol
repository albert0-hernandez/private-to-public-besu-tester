pragma solidity >=0.7.0 <0.9.0;
pragma experimental ABIEncoderV2;
// SPDX-License-Identifier: GPL-3.0

import "./GenericContract.sol";


contract PrivateContract {

    GenericContract public publicContract;

    constructor(
        GenericContract _publicContract
    ) {
        publicContract = _publicContract;
    }

    function setPublicContract(GenericContract _publicContract) external {
        publicContract = _publicContract;
    }

    function getPublicContractData() external view returns(uint256) {
        return publicContract.getData();
    }

    function getPublicStoreContractData() external view returns(uint256) {
        return publicContract.getStoreDataContractData();
    }

}
