//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.0;


import "hardhat/console.sol";
import "./EHR.sol";


contract Interaction is EHRContract {

  struct Patient {
    uint8 exists;
    string name;
    address patientAddress;
    EHR[] EHRFiles;
    address creator;
    uint date;
    address[] doctorKeysList;
  }

  struct ServiceProvider {
    uint8 exists;
    string name;
    address providerAddress;
    address creator;
    uint date;
    address[] patientKeysList;
  }

  mapping(address => ServiceProvider) internal serviceProviders;
  mapping(address => Patient) internal patients;

  modifier onlyPatients(){
    require(patients[msg.sender].exists == 1, "Patient doesn't exist");
    _;
  }

  modifier onlyProviders(){
    require(serviceProviders[msg.sender].exists == 1, "Registered Doctors only");
    _;
  }

  /// @notice Emitted when a patients create a medical record
  /// @param patient Patient address
  event CreateEHR(address patient);

  /// @notice Emitted when a doctor create a new medical record and therefore updates EHR
  /// @param patient Patient address
  /// @param serviceProvider Doctor address
  /// @param EHRhash Hash of the EHR
  event UpdatedEHR(address patient, address serviceProvider, bytes32 EHRhash);

  /// @notice Emitted when the patient grants access to the doctor
  /// @param patient Patient address (issuer)
  /// @param doctor Doctor address (receiver)
  event AccessGranted(address patient, address doctor);

  /// @notice Emitted when the patient revokes access to the doctor
  /// @param patient Patient address (issuer)
  /// @param doctor Doctor address (receiver)
  event AccessRevoked(address patient, address doctor);


  /// @notice Patient grants EHR access to doctors
  /// @param _doctorAddress address of practitioner
  /// @dev Sets the permission indexed mapping to appropriate values. Add addresses to specific provider and patient lists
  function grantAccess(address _doctorAddress) public onlyPatients{
    require(permissions[msg.sender][_doctorAddress].exists == 0 &&
      permissions[msg.sender][_doctorAddress].read == 0 && 
      permissions[msg.sender][_doctorAddress].write == 0, "Already Authorized");
    require(msg.sender != _doctorAddress, "Can't add yourself");
    permissions[msg.sender][_doctorAddress].exists = 1;
    permissions[msg.sender][_doctorAddress].read = 1;
    permissions[msg.sender][_doctorAddress].write = 1;
    emit AccessGranted(msg.sender, _doctorAddress);
    patients[msg.sender].doctorKeysList.push(_doctorAddress);
    serviceProviders[_doctorAddress].patientKeysList.push(msg.sender);
  }

  /// @notice Patient revokes access to practitioner 
  /// @param _doctorAddress address of practitioner
  /// @dev Sets the permission indexed mapping to appropriate values. Add addresses to specific provider and patient lists
  function revokeAccess(address _doctorAddress) public onlyPatients{
    require(permissions[msg.sender][_doctorAddress].exists == 1, "Already Not Authorized");
    require(msg.sender != _doctorAddress, "Can't remove yourself");
    permissions[msg.sender][_doctorAddress].exists = 0;
    permissions[msg.sender][_doctorAddress].read = 0;
    permissions[msg.sender][_doctorAddress].write = 0;
    emit AccessRevoked(msg.sender, _doctorAddress);
    removeIndex(patients[msg.sender].doctorKeysList, _doctorAddress);
    removeIndex(serviceProviders[_doctorAddress].patientKeysList, msg.sender);
  }

  /// @notice Doctor can transfer read access to another doctor 
  /// @param _patientAddress Address to which the patient is linked
  /// @param _doctorAddress Address to which the doctor is linked
  /// @dev Sets the permission indexed mapping to appropriate values. Add addresses to specific provider and patient lists
  function grantAccessDocToDoc(address _patientAddress, address _doctorAddress) public onlyProviders{
    require(permissions[_patientAddress][_doctorAddress].exists == 0, "Already Authorized by Patient");
    require(permissions[msg.sender][_doctorAddress].exists == 0, "Already Authorized");
    require(msg.sender != _doctorAddress, "Can't add yourself");
    permissions[_patientAddress][_doctorAddress].exists = 1;
    permissions[_patientAddress][_doctorAddress].read = 1;
    permissions[_patientAddress][_doctorAddress].write = 0;
    emit AccessGranted(msg.sender, _doctorAddress);
    patients[_patientAddress].doctorKeysList.push(_doctorAddress);
    serviceProviders[_doctorAddress].patientKeysList.push(_patientAddress);
  }

  /// @notice Patient creates EHR
  /// @param EHRhash Hash value of the EHR 
  function createDefaultEHR(bytes32 EHRhash) public onlyPatients{
    require(seePatientExists(msg.sender), "Patient doesn't exist");
    patients[msg.sender].EHRFiles.push(EHR(1, EHRhash, "", msg.sender, block.timestamp));
    emit CreateEHR(msg.sender);
  }

  /// @notice Doctor updates the patient's EHR 
  /// @param _patientAddress address of the patient 
  /// @param EHRhash Hash value of the EHR  
  function updateEHR(address _patientAddress, bytes32 EHRhash, bytes32 Filehash) public onlyProviders{
    require(seePatientExists(_patientAddress), "Patient doesn't exist");
    require(permissions[_patientAddress][msg.sender].write == 1, "Doctor has no update rights");
    uint16 last_idx = patients[_patientAddress].EHRFiles[patients[_patientAddress].EHRFiles.length-1].assetKey;
    last_idx++;
    patients[_patientAddress].EHRFiles.push(EHR(last_idx, EHRhash, Filehash, msg.sender, block.timestamp));
    emit UpdatedEHR(_patientAddress, msg.sender, EHRhash);
  }

  /// @notice Returns authorized doctor addresses 
  function getAuthDoctors() public view onlyPatients returns (address[] memory){
    return patients[msg.sender].doctorKeysList;
  }
  
  /// @notice Returns authorized patient addresses 
  function getAuthPatients() public view onlyProviders returns (address[] memory){
    return serviceProviders[msg.sender].patientKeysList;
  } 

  /// @notice Utility function to remove index from array
  /// @param array from which to delete specific value
  /// @param _addr address to delete from the array
  /// @dev Finds the index that matches the _addr and removes the item from the array
  function removeIndex(address[] storage array, address _addr) internal {
    uint16 index;
    bool check;
    for (uint16 i=0; i<array.length; i++){
      if (array[i] == _addr){
        index = i;
        check = true;
      }
    }
    if (!check) revert("No items found");
    else {
      if (array.length == 1) {
        array.pop();
      } else {
        array[index] = array[array.length-1];
        // array[array.length-1].pop();
        array.pop();
      }
    }
  }

  /// @notice Check if the provided address is an Patient
  /// @param _address address of the user 
  function seePatientExists(address _address) public view returns (bool exists){
    return patients[_address].exists == 1;
  }
}