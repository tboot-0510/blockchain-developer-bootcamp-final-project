//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.0;

interface IProvider {

  function grantAccessDocToDoc(address _patientAddress, address _doctorAddress) external;

  function updateEHR(address _patientAddress, bytes32 EHRhash) external;

  function getAuthPatients() external view returns (address[] memory);
}