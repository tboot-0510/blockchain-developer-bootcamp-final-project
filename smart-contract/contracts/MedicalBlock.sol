//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.0;

import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "hardhat/console.sol";

/// @title Contract for automated storage & encryption of Electronic Health Records (EHR) 
/// @author Thomas Boot
/// @notice Allows Administrator (i.e. Hospital) to register the identity of patients, providers.
/// Registered providers (i.e. Doctors) can read/update/forward Medical Records of patients that have granted access
/// Registered patients can grant/revoke access to personal Medical Record from doctors
/// @dev Encryption of the medical data is performed on front-end side and data is stored on ipfs node.

contract MedicalBlock is Ownable {

  using SafeMath for uint256;
  
  address private owner;
  /// @notice List of all patients addresses.
  /// @dev Used as a helper to communicate with frontend client
  address[] private patientList;

  /// @notice List of all doctor addresses.
  /// @dev Used as a helper to communicate with frontend client
  address[] private doctorList;

  enum Role {
    Owner,
    Admin,
    Doctor,
    Patient,
    Undefined
  }

  struct Admin {
    address[] keysAdded;
  }

  struct EHR {
    uint16 assetKey;
    bytes32 EHRhash;
    address issuer;
    uint date;
  }

  struct Patient {
    bool exists;
    string name;
    address patientAddress;
    EHR[] EHRFiles;
    address creator;
    uint date;
    address[] doctorKeysList;
  }

  struct ServiceProvider {
    bool exists;
    string name;
    address providerAddress;
    address creator;
    uint date;
    address[] patientKeysList;
  }

  struct Permission {
    bool exists;
    bool read; 
    bool write;
  }

  mapping(address => bool) admins;
  mapping(address => Admin) networkKeys;
  mapping(address => ServiceProvider) private serviceProviders;
  mapping(address => Patient) private patients;
  mapping(address => mapping(address => Permission)) private permissions;

  modifier onlyAdminOrOwner(){
    require(admins[msg.sender] || owner == msg.sender, "Nor admin nor owner");
    _;
  }

  modifier onlyProviders(){
    require(serviceProviders[msg.sender].exists, "Registered Doctors only");
    _;
  }

  modifier onlyPatients(){
    require(patients[msg.sender].exists, "Patient doesn't exist");
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

  /// @notice Emitted when the admin (i.e. Hospital) adds a new provider
  /// @param admin Admin address
  /// @param provider Doctor address
  event AddedProvider(address admin, address provider);

  /// @notice Emitted when the admin (i.e. Hospital) adds a new patient
  /// @param admin Admin address
  /// @param patient Patient address
  event AddedPatient(address admin, address patient);

  /// @notice Emitted when the admin (i.e. Hospital) deletes a user (i.e. patient or provider)
  /// @param admin Admin address
  /// @param user User address
  event DeleteUser(address admin, address user);

  /// @notice Emitted when the patient grants access to the doctor
  /// @param patient Patient address (issuer)
  /// @param doctor Doctor address (receiver)
  event AccessGranted(address patient, address doctor);

  /// @notice Emitted when the patient revokes access to the doctor
  /// @param patient Patient address (issuer)
  /// @param doctor Doctor address (receiver)
  event AccessRevoked(address patient, address doctor);

  constructor() {
    owner = msg.sender;
  }

  /// @notice Get the owner of the contract
  function getOwner() public view returns (address){
    return owner;
  }

  /// @notice Adds a patient to a given address
  /// @param _patientAddress Address to which the patient is linked
  /// @param _name Name to which the patient is referred
  /// @dev EHR value from patient structure is initialized automatically. 
  /// Add _patientAddress to NetworkKeys and DoctorList 
  function addPatient(address _patientAddress, string memory _name) public onlyAdminOrOwner{
    require(!patients[_patientAddress].exists, "patient exists");
    patients[_patientAddress].exists = true;
    patients[_patientAddress].name = _name;
    patients[_patientAddress].patientAddress = _patientAddress;
    patients[_patientAddress].creator = msg.sender;
    patients[_patientAddress].date = block.timestamp;
    patients[_patientAddress].doctorKeysList = new address[](0);
    emit AddedPatient(msg.sender, _patientAddress);
    networkKeys[msg.sender].keysAdded.push(_patientAddress);
    patientList.push(_patientAddress);
  }

  /// @notice Adds a doctor to a given address
  /// @param _doctorAddress Address to which the doctor is linked
  /// @param _name Name to which the patient is referred
  /// @dev Add _doctorAddress to NetworkKeys and DoctorList
  function addDoctor(address _doctorAddress, string memory _name) public onlyAdminOrOwner{
    require(!serviceProviders[_doctorAddress].exists, "doctor exists");
    serviceProviders[_doctorAddress] = ServiceProvider({exists:true, name:_name, providerAddress:_doctorAddress, creator:msg.sender, date:block.timestamp, patientKeysList: new address[](0)});
    emit AddedProvider(msg.sender, _doctorAddress);
    networkKeys[msg.sender].keysAdded.push(_doctorAddress);
    doctorList.push(_doctorAddress);
  }

  /// @notice Adds a admin to a given address
  /// @param _adminAddress Address to which the admin is linked
  function addAdmin(address _adminAddress) public onlyOwner{
    require(!admins[_adminAddress], "admin already exists");
    admins[_adminAddress] = true;
  }

  /// @notice Removes a registered account
  /// @param _userAddress Address to which the user is linked
  /// @dev Removes _userAddress from NetworkKeys, identifies the role of the address (doctor/patient) 
  /// and removes address instance from specific mapping
  function deleteAccount(address _userAddress) public onlyAdminOrOwner{
    require(patients[_userAddress].exists || serviceProviders[_userAddress].exists, "user doesn't exist");
    removeIndex(networkKeys[msg.sender].keysAdded, _userAddress);
    if (getRole(_userAddress) == Role.Doctor){
      removeIndex(doctorList, _userAddress);
      delete serviceProviders[_userAddress];
    }
    else if (getRole(_userAddress) == Role.Patient){
      removeIndex(patientList, _userAddress);
      delete patients[_userAddress];
    }
    else {
      revert();
    }
    emit DeleteUser(msg.sender, _userAddress);
  }

  /// @notice Patient grants EHR access to doctors
  /// @param _doctorAddress address of practitioner
  /// @dev Sets the permission indexed mapping to appropriate values. Add addresses to specific provider and patient lists
  function grantAccess(address _doctorAddress) public onlyPatients{
    require(!permissions[msg.sender][_doctorAddress].exists &&
      !permissions[msg.sender][_doctorAddress].read && 
      !permissions[msg.sender][_doctorAddress].write , "Already Authorized");
    require(msg.sender != _doctorAddress, "Can't add yourself");
    permissions[msg.sender][_doctorAddress].exists = true;
    permissions[msg.sender][_doctorAddress].read = true;
    permissions[msg.sender][_doctorAddress].write = true;
    emit AccessGranted(msg.sender, _doctorAddress);
    patients[msg.sender].doctorKeysList.push(_doctorAddress);
    serviceProviders[_doctorAddress].patientKeysList.push(msg.sender);
  }

  /// @notice Doctor can transfer read access to another doctor 
  /// @param _patientAddress Address to which the patient is linked
  /// @param _doctorAddress Address to which the doctor is linked
  /// @dev Sets the permission indexed mapping to appropriate values. Add addresses to specific provider and patient lists
  function grantAccessDocToDoc(address _patientAddress, address _doctorAddress) public onlyProviders{
    require(!permissions[_patientAddress][_doctorAddress].exists, "Already Authorized by Patient");
    require(!permissions[msg.sender][_doctorAddress].exists, "Already Authorized");
    require(msg.sender != _doctorAddress, "Can't add yourself");
    permissions[_patientAddress][_doctorAddress].exists = true;
    permissions[_patientAddress][_doctorAddress].read = true;
    permissions[_patientAddress][_doctorAddress].write = false;
    emit AccessGranted(msg.sender, _doctorAddress);
    patients[_patientAddress].doctorKeysList.push(_doctorAddress);
    serviceProviders[_doctorAddress].patientKeysList.push(_patientAddress);
  }

  /// @notice Patient revokes access to practitioner 
  /// @param _doctorAddress address of practitioner
  /// @dev Sets the permission indexed mapping to appropriate values. Add addresses to specific provider and patient lists
  function revokeAccess(address _doctorAddress) public onlyPatients{
    require(permissions[msg.sender][_doctorAddress].exists, "Already Not Authorized");
    require(msg.sender != _doctorAddress, "Can't remove yourself");
    permissions[msg.sender][_doctorAddress].exists = false;
    permissions[msg.sender][_doctorAddress].read = false;
    permissions[msg.sender][_doctorAddress].write = false;
    emit AccessRevoked(msg.sender, _doctorAddress);
    removeIndex(patients[msg.sender].doctorKeysList, _doctorAddress);
    removeIndex(serviceProviders[_doctorAddress].patientKeysList, msg.sender);
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

  /// @notice Patient creates EHR
  /// @param EHRhash Hash value of the EHR 
  function createDefaultEHR(bytes32 EHRhash) public onlyPatients{
    require(seePatientExists(msg.sender), "Patient doesn't exist");
    patients[msg.sender].EHRFiles.push(EHR(1, EHRhash, msg.sender, block.timestamp));
    emit CreateEHR(msg.sender);
  }

  /// @notice Doctor updates the patient's EHR 
  /// @param _patientAddress address of the patient 
  /// @param EHRhash Hash value of the EHR  
  function updateEHR(address _patientAddress, bytes32 EHRhash) public onlyProviders{
    require(seePatientExists(_patientAddress), "Patient doesn't exist");
    require(permissions[_patientAddress][msg.sender].write, "Doctor has no update rights");
    uint16 last_idx = patients[_patientAddress].EHRFiles[patients[_patientAddress].EHRFiles.length-1].assetKey;
    last_idx++;
    patients[_patientAddress].EHRFiles.push(EHR(last_idx,EHRhash, msg.sender, block.timestamp));
    emit UpdatedEHR(_patientAddress, msg.sender, EHRhash);

  }

  /// @notice Utility function to access the affiliated role of an address
  /// @param _userAddress address of the user 
  function getRole(address _userAddress) public view returns (Role){
    if (owner == _userAddress){
      return Role.Owner;
    }
    else if (admins[_userAddress]) {
        return Role.Admin;
    }
    else if(serviceProviders[_userAddress].exists) {
        return Role.Doctor;
    }
    else if(patients[_userAddress].exists) {
        return Role.Patient;
    }
    else{
      return Role.Undefined;
    }
  }

  /// @notice Check if the provided address is an Patient
  /// @param _address address of the user 
  function seePatientExists(address _address) public view returns (bool exists){
    return patients[_address].exists;
  }

  /// @notice Check if the provided address is an Doctor
  /// @param _address address of the user 
  function seeDoctorExists(address _address) public view returns (bool exists){
    return serviceProviders[_address].exists;
  }

  /// @notice Check if the provided address is an Admin
  /// @param _address address of the user 
  function seeAdminExists(address _address) public view returns (bool exists){
    return admins[_address];
  }

  /// @notice Returns the permission attribute between two parties 
  /// @param _patientAddress address of the patient 
  /// @param _serviceProvider address of the provider 
  function getPermissions(address _patientAddress, address _serviceProvider) public view returns (bool read, bool write){
    return (permissions[_patientAddress][_serviceProvider].read, permissions[_patientAddress][_serviceProvider].write);
  }

  // function getPatientInfo(address _patientAddress) public view returns (bool exist, string memory name, address addr, uint256 lengthEHR){
  //   require(seePatientExists(_patientAddress) && permissions[_patientAddress][msg.sender].read, "Patient does not exist and Not allowed to read patient data");
  //   Patient memory p = patients[_patientAddress];
  //   return (p.exists, p.name, p.patientAddress, p.EHRFiles.length);
  // }

  /// @notice Returns the patient information  
  /// @param _patientAddress address of the patient 
  /// @dev Help for frontend information display. This function doesn't provide EHR information  
  function getPatientDisplayInfo(address _patientAddress) public view returns (bool exist, string memory name, address addr, uint date){
    require(seePatientExists(_patientAddress), "Patient does not exist");
    Patient memory p = patients[_patientAddress];
    return (p.exists, p.name, p.patientAddress, p.date);
  }

  /// @notice Returns authorized patient addresses 
  function getAuthPatients() public view onlyProviders returns (address[] memory){
    return serviceProviders[msg.sender].patientKeysList;
  } 

  /// @notice Returns authorized doctor addresses 
  function getAuthDoctors() public view onlyPatients returns (address[] memory){
    return patients[msg.sender].doctorKeysList;
  }

  /// @notice Returns doctor list
  /// @dev Needed in frontend deployment
  function getDoctorList() public view returns (address[] memory){
    return doctorList;
  }
  /// @notice Returns patient list
  /// @dev Needed in frontend deployment
  function getPatientList() public view returns (address[] memory){
    return patientList;
  }
  /// @notice Returns doctor info
  /// @param _providerAddress address of the provider
  function getDoctorInfo(address _providerAddress) public view returns (address _address, string memory name, uint date){
    return (serviceProviders[_providerAddress].providerAddress, serviceProviders[_providerAddress].name, serviceProviders[_providerAddress].date);
  }

  /// @notice Get the medical records of the patient from a doctor's perspective
  /// @param _patientAddress address of the patient
  function getRecords(address _patientAddress) public view onlyProviders returns (uint16[] memory _accessKeys, bytes32[] memory _encryptHash ,address[] memory _issuers ,uint256[] memory _dates){
    require(permissions[_patientAddress][msg.sender].read, "Doctor has no update rights");
    require(patients[_patientAddress].EHRFiles.length>0, "Patient has no EHR record");
    uint length = patients[_patientAddress].EHRFiles.length;
    uint16[] memory assetKeys = new uint16[](length);
    bytes32[] memory encryptHash = new bytes32[](length);
    address[] memory issuers = new address[](length);
    uint[] memory dates = new uint[](length);

    for (uint i=0; i<length; i++){
      (assetKeys[i], encryptHash[i], issuers[i], dates[i]) = getRecordIdx(_patientAddress, i);
    }
    return (assetKeys, encryptHash, issuers, dates);
  }

  /// @notice Get the medical records of the patient
  function getOwnRecords() public view onlyPatients returns (uint16[] memory _accessKeys, bytes32[] memory _encryptHash ,address[] memory _issuers ,uint256[] memory _dates){
    require(patients[msg.sender].EHRFiles.length>0, "Patient has no EHR record");
    uint length = patients[msg.sender].EHRFiles.length;
    uint16[] memory assetKeys = new uint16[](length);
    bytes32[] memory encryptHash = new bytes32[](length);
    address[] memory issuers = new address[](length);
    uint[] memory dates = new uint[](length);

    for (uint i=0; i<length; i++){
      (assetKeys[i], encryptHash[i], issuers[i], dates[i]) = getRecordIdx(msg.sender, i);
    }
    return (assetKeys, encryptHash, issuers, dates);
  }

  /// @notice Fetch the patient EHR data at a specific index
  /// @param _patientAddress address of the patient
  /// @param idx index
  function getRecordIdx(address _patientAddress, uint idx) public view returns (uint16 accessKey, bytes32 encryptHash, address issuer, uint date){
    return (patients[_patientAddress].EHRFiles[idx].assetKey, 
      patients[_patientAddress].EHRFiles[idx].EHRhash,
      patients[_patientAddress].EHRFiles[idx].issuer,
      patients[_patientAddress].EHRFiles[idx].date);
  }

  /// @notice Returns addresses in the network 
  /// @dev Needed in frontend deployment for admin account.
  function getNetwork() public view returns (address[] memory){
    return (networkKeys[msg.sender].keysAdded);
  }






}