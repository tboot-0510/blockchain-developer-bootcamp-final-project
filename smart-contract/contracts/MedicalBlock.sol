//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

/**
  /// @title A Medical Blockchain 
  /// @author Thomas Boot
  /// @notice You can use this contract to register the identity of patients, providers and providing access control
  /// @dev All function calls are currently implemented without side effects
*/
contract MedicalBlock {
  address owner;

  struct Token {
    int status;
    bool read;
    bool write;
  }

  enum Role {
    Owner,
    Admin,
    Doctor,
    Patient,
    Undefined
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
    address[] doctorKeysList;
  }

  struct ServiceProvider {
    bool exists; // checks if state provider exists 
    string name;
    address providerAddress;
    address creator;
    // get list of patients + list of EHR provided 
    address[] patientKeysList;
  }

  struct Permission {
    bool exists;
    bool read; /// permission to read EHR
    bool write; /// permission to write EHR
  }

  mapping(address => bool) admins;
  mapping(address => ServiceProvider) private serviceProviders;
  mapping(address => Patient) private patients;
  mapping(address => Token) private tokens;
  mapping(address => mapping(address => Permission)) private permissions;
  mapping(address => mapping(bytes32 => uint)) private tokensToFile;

  // modifier
  modifier isAdminOrOwner(){
    require(admins[msg.sender] || owner == msg.sender, "Nor admin nor ownwer");
    _;
  }

  modifier onlyOwner(){
    require(msg.sender == owner, "Only Admin is allowed");
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

  /// @notice Event Declaration 
  // event verifiedToken(address patient, address serviceProvider, bytes32 token);
  // event encryptKeyAdded(address patient, address serviceProvider);
  event CreateEHR(address patient);
  event UpdatedEHR(address patient, address serviceProvider, bytes32 EHRhash);
  event AddedProvider(address admin, address provider);
  event AddedPatient(address admin, address patient);
  event AccessGranted(address patient, address doctor);
  event AccessRevoked(address patient, address doctor);

  constructor() {
    owner = msg.sender;
  }
  
  function addPatient(address _patientAddress, string memory _name) public onlyProviders{
    require(!patients[_patientAddress].exists, "patient exists");
    // patients[_patientAddress] = Patient({exists:true, name:_name, patientAddress:_patientAddress, EHRFiles:ehr, creator:msg.sender});
    patients[_patientAddress].exists = true;
    patients[_patientAddress].name = _name;
    patients[_patientAddress].patientAddress = _patientAddress;
    patients[_patientAddress].creator = msg.sender;
    emit AddedPatient(msg.sender, _patientAddress);
  }

  function addDoctor(address _doctorAddress, string memory _name) public isAdminOrOwner{
    require(!serviceProviders[_doctorAddress].exists, "doctor exists");
    serviceProviders[_doctorAddress] = ServiceProvider({exists:true, name:_name, providerAddress:_doctorAddress, creator:msg.sender, patientKeysList: new address[](0)});
    emit AddedProvider(msg.sender, _doctorAddress);
  }

  function addAdmin(address _adminAddress) public onlyOwner{
    require(!admins[_adminAddress], "admin already exists");
    admins[_adminAddress] = true;
  }
  /// Request and Revoke access to doctors
  /// @notice Practitioner proves the token to request access to patient 
  /// @param _doctorAddress address of practitioner
  function grantAccess(address _doctorAddress) public onlyPatients{
    require(!permissions[msg.sender][_doctorAddress].exists, "Already Authorized");
    require(msg.sender != _doctorAddress, "Can't add yourself");
    permissions[msg.sender][_doctorAddress].exists = true;
    permissions[msg.sender][_doctorAddress].read = true;
    permissions[msg.sender][_doctorAddress].write = true;
    emit AccessGranted(msg.sender, _doctorAddress);
    patients[msg.sender].doctorKeysList.push(_doctorAddress);
    serviceProviders[_doctorAddress].patientKeysList.push(msg.sender);
  }

  /// @notice Practitioner revokes access to patient 
  /// @param _doctorAddress address of practitioner
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

  function removeIndex(address[] storage array, address _addr) internal {
    uint16 index;
    bool check;
    for (uint16 i=0; i<array.length; i++){
      if (array[i] == _addr){
        index = i;
        check = true;
      }
    }
    if (!check) revert();
    else {
      array[index] = array[array.length-1];
      delete array[array.length-1];
    }
  }

  /// @notice Patient creates Electronic Health Record (EHR)
  function createEmptyEHR() public onlyPatients{
    require(seePatientExists(msg.sender), "Patient doesn't exist");
    bytes32 EHRhash = keccak256(abi.encodePacked("GenesisHash", msg.sender));
    patients[msg.sender].EHRFiles.push(EHR(1, EHRhash, msg.sender, block.timestamp));
    emit CreateEHR(msg.sender);
  }

  /// @notice Doctor updates the patient's EHR 
  function updateEHR(address _patientAddress, bytes32 EHRhash) public onlyProviders{
    require(seePatientExists(_patientAddress), "Patient doesn't exist");
    require(permissions[_patientAddress][msg.sender].write, "Doctor has no update rights");
    uint16 last_idx = patients[_patientAddress].EHRFiles[patients[_patientAddress].EHRFiles.length-1].assetKey;
    last_idx++;
    patients[_patientAddress].EHRFiles.push(EHR(last_idx,EHRhash, msg.sender, block.timestamp));
    emit UpdatedEHR(_patientAddress, msg.sender, EHRhash);

  }

  /// Getter functions 
  function getRole() public view returns (Role){
    if (owner == msg.sender){
      return Role.Owner;
    }
    else if (admins[msg.sender]) {
        return Role.Admin;
    }
    else if(serviceProviders[msg.sender].exists) {
        return Role.Doctor;
    }
    else if(patients[msg.sender].exists) {
        return Role.Patient;
    }
    else{
      return Role.Undefined;
    }
  }

  function seePatientExists(address _address) public view returns (bool exists){
    return patients[_address].exists;
  }

  function seeDoctorExists(address _address) public view returns (bool exists){
    return serviceProviders[_address].exists;
  }

  function seeAdminExists(address _address) public view onlyOwner returns (bool exists){
    return admins[_address];
  }

  function getPermissions(address _patientAddress, address _serviceProvider) public view returns (bool read, bool write){
    return (permissions[_patientAddress][_serviceProvider].read, permissions[_patientAddress][_serviceProvider].write);
  }

  function getPatientInfo(address _patientAddress) public view onlyProviders returns (bool exist, string memory name, address addr, uint256 lengthEHR){
    require(seePatientExists(_patientAddress) && permissions[_patientAddress][msg.sender].read, "Patient does not exist and Not allowed to read patient data");
    Patient memory p = patients[_patientAddress];
    return (p.exists, p.name, p.patientAddress, p.EHRFiles.length);
  }

  function getAuthPatients() public view onlyProviders returns (address[] memory){
    return serviceProviders[msg.sender].patientKeysList;
  } 

  function getAuthDoctors() public view onlyPatients returns (address[] memory){
    return patients[msg.sender].doctorKeysList;
  }

  function getDoctorInfo(address _providerAddress) public view onlyOwner returns (address _address, string memory name){
    return (serviceProviders[_providerAddress].providerAddress, serviceProviders[_providerAddress].name);
  }

  function getRecords(address _patientAddress) public view onlyProviders returns (uint16[] memory _accessKeys, bytes32[] memory _encryptHash ,address[] memory _issuers ,uint256[] memory _dates){
    require(permissions[_patientAddress][msg.sender].read, "Doctor has no update rights");
    require(patients[_patientAddress].EHRFiles.length>0, "Patient has no EHR record");
    uint length = patients[_patientAddress].EHRFiles.length;
    uint16[] memory assetKeys = new uint16[](length);
    bytes32[] memory encryptHash = new bytes32[](length);
    address[] memory issuers = new address[](length);
    uint[] memory dates = new uint[](length);

    for (uint i=0; i<patients[_patientAddress].EHRFiles.length; i++){
      (assetKeys[i], encryptHash[i], issuers[i], dates[i]) = getRecordIdx(_patientAddress, i);
    }
    return (assetKeys, encryptHash, issuers, dates);
  }

  function getRecordIdx(address _patientAddress, uint idx) public view returns (uint16 accessKey, bytes32 encryptHash, address issuer, uint date){
    return (patients[_patientAddress].EHRFiles[idx].assetKey, 
      patients[_patientAddress].EHRFiles[idx].EHRhash,
      patients[_patientAddress].EHRFiles[idx].issuer,
      patients[_patientAddress].EHRFiles[idx].date);
  }

  // function getToken(bytes32 hashToken) public view returns (int status, bool read, bool write){
  //   return (patients[msg.sender].tokens[hashToken].status, 
  //     patients[msg.sender].tokens[hashToken].read,
  //     patients[msg.sender].tokens[hashToken].write
  //   );
  // }






}