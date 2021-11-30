//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.0;


import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract EHRContract {

  using SafeMath for uint256;

  struct EHR {
    uint16 assetKey;
    bytes32 EHRhash;
    bytes32 Filehash;
    address issuer;
    uint256 date;
  }
  
  struct Permission {
    uint8 exists;
    uint8 read; 
    uint8 write;
  }

  mapping(address => mapping(address => Permission)) internal permissions;
}