//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.0;


interface IMedicalBlock {

  enum Role {
    Owner,
    Admin,
    Doctor,
    Patient,
    Undefined
  }

  function addPatient(address _patientAddress, string memory _name) external;

  function addDoctor(address _doctorAddress, string memory _name) external;

  function addAdmin(address _adminAddress) external;

  function deleteAccount(address _userAddress) external;

  function getRole(address _userAddress) external view returns (Role);

  function seeDoctorExists(address _address) external view returns (bool exists);

  function seeAdminExists(address _address) external view returns (bool exists);

  function getPermissions(address _patientAddress, address _serviceProvider) external view returns (uint8 read, uint8 write);

  function getPatientDisplayInfo(address _patientAddress) external view returns (uint8 exist, string memory name, address addr, uint256 date);

  function getDoctorList() external view returns (address[] memory);

  function getPatientList() external view returns (address[] memory);

  function getDoctorInfo(address _providerAddress) external view returns (address _address, string memory name, uint256 date);

  function getRecords(address _patientAddress) external view returns (uint16[] memory _accessKeys, bytes32[] memory _encryptHash , bytes32[] memory _encryptFileHash, address[] memory _issuers ,uint256[] memory _dates);

  function getOwnRecords() external view returns (uint16[] memory _accessKeys, bytes32[] memory _encryptHash , bytes32[] memory _encryptFileHash , address[] memory _issuers ,uint256[] memory _dates);

  function getRecordIdx(address _patientAddress, uint idx) external view returns (uint16 accessKey, bytes32 encryptHash, bytes32 encryptFileHash, address issuer, uint256 date);

  function _retrieveRecords(address _passedAddress) external view returns (uint16[] memory _accessKeys, bytes32[] memory _encryptHash , bytes32[] memory _encryptFileHash ,address[] memory _issuers ,uint256[] memory _dates);

  function getNetwork() external view returns (address[] memory);

}