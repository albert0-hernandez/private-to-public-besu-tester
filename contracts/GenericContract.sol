pragma solidity >=0.7.0 <0.9.0;
pragma experimental ABIEncoderV2;
// SPDX-License-Identifier: GPL-3.0

import "./StoreDataContract.sol";


contract GenericContract {

    uint256 public data;
    StoreDataContract public storeDataContract;

    constructor(uint256 _data, StoreDataContract _storeDataContract) {
        data = _data;
        storeDataContract = _storeDataContract;
    }

    function getData() external view returns (uint256) {
        return data;
    }

    function add(uint256 _value) external {
        data += _value;
    }

    function setStoreDataContract(StoreDataContract _storeDataContract) external {
        storeDataContract = _storeDataContract;
    }

    function addToStoreDataContract(uint256 _value) external {
        storeDataContract.add(_value);
    }

    function getStoreDataContractData() external view returns (uint256) {
        return storeDataContract.getData();
    }

}
