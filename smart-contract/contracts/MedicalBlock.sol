//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "hardhat/console.sol";
import "./Interaction.sol";
import "./IMedicalBlock.sol";

/// @title Contract for automated storage & encryption of Electronic Health Records (EHR) 
/// @author Thomas Boot
/// @notice Allows Administrator (i.e. Hospital) to register the identity of patients, providers.
/// Registered providers (i.e. Doctors) can read/update/forward Medical Records of patients that have granted access
/// Registered patients can grant/revoke access to personal Medical Record from doctors
/// @dev Encryption of the medical data is performed on front-end side and data is stored on ipfs node.

contract MedicalBlock is Ownable, Interaction, IMedicalBlock {

  using SafeMath for uint256;
  address[] private patientList;
  address[] private doctorList;

  struct Admin {
    address[] keysAdded;
  }

  mapping(address => bool) admins;
  mapping(address => Admin) networkKeys;

  modifier onlyAdminOrOwner(){
    require(admins[msg.sender] || owner() == msg.sender, "Nor admin nor owner");
    _;
  }

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


  constructor() {}


  /// @notice Adds a patient to a given address
  /// @param _patientAddress Address to which the patient is linked
  /// @param _name Name to which the patient is referred
  /// @dev EHR value from patient structure is initialized automatically. 
  /// Add _patientAddress to NetworkKeys and DoctorList 
  function addPatient(address _patientAddress, string memory _name) public override onlyAdminOrOwner{
    require(patients[_patientAddress].exists == 0, "patient exists");
    patients[_patientAddress].exists = 1;
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
  function addDoctor(address _doctorAddress, string memory _name) public override onlyAdminOrOwner{
    require(serviceProviders[_doctorAddress].exists == 0, "doctor exists");
    serviceProviders[_doctorAddress] = ServiceProvider({exists:1, name:_name, providerAddress:_doctorAddress, creator:msg.sender, date:block.timestamp, patientKeysList: new address[](0)});
    emit AddedProvider(msg.sender, _doctorAddress);
    networkKeys[msg.sender].keysAdded.push(_doctorAddress);
    doctorList.push(_doctorAddress);
  }

  /// @notice Adds a admin to a given address
  /// @param _adminAddress Address to which the admin is linked
  function addAdmin(address _adminAddress) public override onlyOwner{
    require(!admins[_adminAddress] , "admin already exists");
    admins[_adminAddress] = true;
  }

  /// @notice Removes a registered account
  /// @param _userAddress Address to which the user is linked
  /// @dev Removes _userAddress from NetworkKeys, identifies the role of the address (doctor/patient) 
  /// and removes address instance from specific mapping
  function deleteAccount(address _userAddress) public override onlyAdminOrOwner{
    require(patients[_userAddress].exists == 1|| serviceProviders[_userAddress].exists == 1, "user doesn't exist");
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

  /// @notice Utility function to access the affiliated role of an address
  /// @param _userAddress address of the user 
  function getRole(address _userAddress) public view override returns (Role){
    if (owner() == _userAddress){
      return Role.Owner;
    }
    else if (admins[_userAddress]) {
        return Role.Admin;
    }
    else if(serviceProviders[_userAddress].exists == 1) {
        return Role.Doctor;
    }
    else if(patients[_userAddress].exists == 1) {
        return Role.Patient;
    }
    else{
      return Role.Undefined;
    }
  }

  /// @notice Check if the provided address is an Doctor
  /// @param _address address of the user 
  function seeDoctorExists(address _address) public view override returns (bool exists){
    return serviceProviders[_address].exists == 1;
  }

  /// @notice Check if the provided address is an Admin
  /// @param _address address of the user 
  function seeAdminExists(address _address) public view override returns (bool exists){
    return admins[_address];
  }

  /// @notice Returns the permission attribute between two parties 
  /// @param _patientAddress address of the patient 
  /// @param _serviceProvider address of the provider 
  function getPermissions(address _patientAddress, address _serviceProvider) public view override returns (uint8 read, uint8 write){
    return (permissions[_patientAddress][_serviceProvider].read, permissions[_patientAddress][_serviceProvider].write);
  }

  /// @notice Returns the patient information  
  /// @param _patientAddress address of the patient 
  /// @dev Help for frontend information display. This function doesn't provide EHR information  
  function getPatientDisplayInfo(address _patientAddress) public view override returns (uint8 exist, string memory name, address addr, uint256 date){
    require(seePatientExists(_patientAddress), "Patient does not exist");
    Patient memory p = patients[_patientAddress];
    return (p.exists, p.name, p.patientAddress, p.date);
  }

  /// @notice Returns doctor list
  /// @dev Needed in frontend deployment
  function getDoctorList() public view override returns (address[] memory){
    return doctorList;
  }
  /// @notice Returns patient list
  /// @dev Needed in frontend deployment
  function getPatientList() public view override returns (address[] memory){
    return patientList;
  }
  /// @notice Returns doctor info
  /// @param _providerAddress address of the provider
  function getDoctorInfo(address _providerAddress) public view override returns (address _address, string memory name, uint256 date){
    return (serviceProviders[_providerAddress].providerAddress, serviceProviders[_providerAddress].name, serviceProviders[_providerAddress].date);
  }

  /// @notice Get the medical records of the patient from a doctor's perspective
  /// @param _patientAddress address of the patient
  function getRecords(address _patientAddress) public view override onlyProviders returns (uint16[] memory _accessKeys, bytes32[] memory _encryptHash ,address[] memory _issuers ,uint256[] memory _dates){
    require(permissions[_patientAddress][msg.sender].read == 1, "Doctor has no update rights");
    require(patients[_patientAddress].EHRFiles.length>0, "Patient has no EHR record");
    return _retrieveRecords(_patientAddress);
  }

  /// @notice Core function to retrieve records 
  /// @param _passedAddress address given to the function 
  /// @dev Use ternary condition to designate the used address 
  function _retrieveRecords(address _passedAddress) public view override returns (uint16[] memory _accessKeys, bytes32[] memory _encryptHash ,address[] memory _issuers ,uint256[] memory _dates){

    address condition = (_passedAddress == address(0)) ? (msg.sender) : (_passedAddress); 
    
    uint length = patients[condition].EHRFiles.length;
    uint16[] memory assetKeys = new uint16[](length);
    bytes32[] memory encryptHash = new bytes32[](length);
    address[] memory issuers = new address[](length);
    uint[] memory dates = new uint[](length);

    for (uint idx=0; idx<length; idx++){
      (assetKeys[idx], encryptHash[idx], issuers[idx], dates[idx]) = (patients[condition].EHRFiles[idx].assetKey, 
                                                              patients[condition].EHRFiles[idx].EHRhash,
                                                              patients[condition].EHRFiles[idx].issuer,
                                                              patients[condition].EHRFiles[idx].date);
    }
    return (assetKeys, encryptHash, issuers, dates);
  }

  /// @notice Get the medical records of the patient
  function getOwnRecords() public view override onlyPatients returns (uint16[] memory _accessKeys, bytes32[] memory _encryptHash ,address[] memory _issuers ,uint256[] memory _dates){
    require(patients[msg.sender].EHRFiles.length>0, "Patient has no EHR record");
    return _retrieveRecords(msg.sender);
  }

  /// @notice Returns addresses in the network 
  /// @dev Needed in frontend deployment for admin account.
  function getNetwork() public view override returns (address[] memory){
    return (networkKeys[msg.sender].keysAdded);
  }
}