pragma solidity >=0.7.0 <0.9.0;
pragma experimental ABIEncoderV2;
// SPDX-License-Identifier: GPL-3.0


contract StoreDataContract {

    uint256 public data;

    constructor(uint256 _data) {
        data = _data;
    }

    function getData() external view returns (uint256) {
        return data;
    }

    function add(uint256 _value) external {
        data += _value;
    }

}
