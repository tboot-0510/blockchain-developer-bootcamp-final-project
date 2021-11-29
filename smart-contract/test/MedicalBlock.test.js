const { expect } = require("chai");
const { ethers, artifacts } = require("hardhat");

const MedicalBlock = artifacts.require("MedicalBlock");
const abi = MedicalBlock['abi'];
const bytecode = MedicalBlock['bytecode'];
const provider = new ethers.providers.JsonRpcProvider();

let healthSys;
let contract;
let addrs;

describe("MedicalBlock contract", function () {
  before(async () => {
    healthSys = await hre.ethers.getContractFactory('MedicalBlock');
    [contractOwner, admin, doctorA, doctorB, patientA, patientB, ...addrs] = await hre.ethers.getSigners();
    console.log('contractOwner', contractOwner.address);
    contract = await healthSys.deploy();
    await contract.deployed();
  });
  it("Should deploy with address", async function () {
    assert.ok(contract, 'test failed');
  });
  describe("ContractOwner methods", function () {
    /**
     * Checks that the contract inherits OpenZeppelin Ownable by using owner()
     */
    it("ContractOwner -> owner() should be same", async function () {
      expect(await contract.owner()).to.equal(contractOwner.address)
    })
    /**
     * Checks that the contract owner can add admin to blockchain
     */
    it("ContractOwner -> Should add admin to blockchain", async function () {
      await contract.addAdmin(admin.address);
      var exist = await contract.seeAdminExists(admin.address);
      expect(exist).to.equal(true);
    });
  });
  describe("Admin methods", function () {
    /**
     * Checks that admin can add doctors to the blockchain 
     */
    it("Admin -> Should add doctors to blockchain", async function () {
      await expect(contract.connect(admin).addDoctor(doctorB.address, "Dr House"))
        .to.emit(contract, 'AddedProvider')
        .withArgs(admin.address, doctorB.address);
        await expect(contract.connect(admin).addDoctor(doctorA.address, "Dr Monk"))
        .to.emit(contract, 'AddedProvider')
        .withArgs(admin.address, doctorA.address);
      var exist = await contract.seeDoctorExists(doctorB.address);
      var exist2 = await contract.seeDoctorExists(doctorA.address);
      expect(exist).to.equal(true);
      expect(exist2).to.equal(true);
    });
    /**
     * Checks that admin can add patients to the blockchain 
     */
    it("Admin -> Should add patients to blockchain", async function () {
      await expect(contract.connect(admin).addPatient(patientA.address, "Theo Bigwig"))
        .to.emit(contract, 'AddedPatient')
        .withArgs(admin.address, patientA.address);
      await expect(contract.connect(admin).addPatient(patientB.address, "Susan Smith"))
        .to.emit(contract, 'AddedPatient')
        .withArgs(admin.address, patientB.address);
      var exist = await contract.seePatientExists(patientA.address);
      var exist2 = await contract.seePatientExists(patientB.address);
      expect(exist).to.equal(true);
      expect(exist2).to.equal(true);
    });
    /**
     * Checks that admin can deleter users from the blockchain 
     */
    it("Admin -> Should delete patients & doctors from blockchain", async function () {
      await expect(contract.connect(admin).deleteAccount(patientB.address))
        .to.emit(contract, 'DeleteUser')
        .withArgs(admin.address, patientB.address);
      await expect(contract.connect(admin).deleteAccount(doctorB.address))
        .to.emit(contract, 'DeleteUser')
        .withArgs(admin.address, doctorB.address);
      var exist = await contract.seePatientExists(patientB.address);
      var exist2 = await contract.seeDoctorExists(doctorB.address);
      expect(exist).to.equal(false);
      expect(exist2).to.equal(false);
    });
  });

  describe("Get roles", function () {
    /**
     * Checks that roles of the added users
     */
    it("Should get right roles", async () => {
      const ownerRole = await contract.getRole(contractOwner.address);
      const adminRole = await contract.getRole(admin.address);
      const doctorRole = await contract.getRole(doctorA.address);
      const patientRole = await contract.getRole(patientA.address);
      
      expect(ownerRole).to.equal(0);
      expect(adminRole).to.equal(1);
      expect(doctorRole).to.equal(2);
      expect(patientRole).to.equal(3);
    });
  });

  describe("Grant access", function () {
    /**
     * Checks that PatientA grants access to DoctorA
     */
    it("Patient A grants access to DoctorA", async function () {
      await expect(contract.connect(patientA).grantAccess(doctorA.address))
        .to.emit(contract, 'AccessGranted')
        .withArgs(patientA.address, doctorA.address);
      var perm = await contract.getPermissions(patientA.address, doctorA.address);
      expect(perm.read).to.equal(1);
      expect(perm.write).to.equal(1);
    });
    /**
     * Checks that DoctorA grants patientA READ access to DoctorB
     */
    it("DoctorA grants READ access PatientA to DoctorB", async function () {
      await expect(contract.connect(admin).addDoctor(doctorB.address, "Dr House"));
      await expect(await contract.connect(doctorA).grantAccessDocToDoc(patientA.address, doctorB.address))
        .to.emit(contract, 'AccessGranted')
        .withArgs(doctorA.address, doctorB.address);
      var perm = await contract.getPermissions(patientA.address, doctorB.address);
        expect(perm.read).to.equal(1);
        expect(perm.write).to.equal(0);
    });
    /**
     * Checks that PatientA revokes access to DoctorB
     */
    it("Patient A revokes access to DoctorB", async () => {
      await expect(contract.connect(patientA).revokeAccess(doctorB.address))
        .to.emit(contract, 'AccessRevoked')
        .withArgs(patientA.address, doctorB.address);
      var perm = await contract.getPermissions(patientA.address, doctorB.address);
      expect(perm.read).to.equal(0);
      expect(perm.write).to.equal(0);
    });
    /**
     * Checks that PatientA revokes access to DoctorA
     */
    it("Patient A revokes access to DoctorA", async () => {
      await expect(contract.connect(patientA).revokeAccess(doctorA.address))
        .to.emit(contract, 'AccessRevoked')
        .withArgs(patientA.address, doctorA.address);
      var perm = await contract.getPermissions(patientA.address, doctorA.address);
      expect(perm.read).to.equal(0);
      expect(perm.write).to.equal(0);
    });
    /**
     * Checks that PatientB grants access to DoctorA
     */
    it("Patient B grants access to DoctorA", async function () {
      await expect(contract.connect(admin).addPatient(patientB.address, "Susan Smith"))
      await expect(contract.connect(patientB).grantAccess(doctorA.address))
        .to.emit(contract, 'AccessGranted')
        .withArgs(patientB.address, doctorA.address);
      var perm = await contract.getPermissions(patientB.address, doctorA.address);
      expect(perm.read).to.equal(1);
      expect(perm.write).to.equal(1);
    });
  });

  describe("Add Digital EHR", function () {
    /**
     * Checks that PatientB can create EHR
     */
    it("Create empty EhR", async () => {
      expect(await contract.seePatientExists(patientB.address)).to.equal(true);
      const EHRhash = ethers.utils.id("this is genesis block"); 
      await expect(contract.connect(patientB).createDefaultEHR(EHRhash))
        .to.emit(contract, 'CreateEHR')
        .withArgs(patientB.address);
    });
    /**
     * Checks that Permissioned doctor can update the patient's EHR
     */
    it("Permissioned doctor can update patient's EHR", async () => {
      const EHRhash = ethers.utils.id("this is an update"); 
      await expect(contract.connect(doctorA).updateEHR(patientB.address, EHRhash))
        .to.emit(contract, 'UpdatedEHR')
        .withArgs(patientB.address, doctorA.address, EHRhash);
    });
    /**
     * Checks that Permissoned doctor can access all patients records
     */
    it("Permissoned doctor can get all records of patient", async () => {
      const EHRhash = ethers.utils.id("new update");
      await contract.connect(doctorA).updateEHR(patientB.address, EHRhash);
      const records = await contract.connect(doctorA).getRecords(patientB.address);
      expect(records._accessKeys.length).to.equal(3);
    })
    /**
     * Checks that Patient can get his own EHRs
     */
    it("Patient can get access to records", async () => {
      const records = await contract.connect(patientB).getOwnRecords();
      expect(records._accessKeys.length).to.equal(3);
    })
  })
  describe("Get all authorized records", function() {
    /**
     * Checks that DoctorA should have 2 patients under his supervision
     */
    it("Doctor A should have 2 patients (A/B) under the supervision", async () => {
      await expect(contract.connect(patientA).grantAccess(doctorA.address))
        .to.emit(contract, 'AccessGranted')
        .withArgs(patientA.address, doctorA.address);
      const patients = await contract.connect(doctorA).getAuthPatients();
      expect(patients.length).to.equal(2);
    });
    /**
     * Checks that PatientA has access to authorized doctors
     */
    it("Patient A should have 2 authorized doctors", async () => {
      await expect(contract.connect(patientA).grantAccess(doctorB.address))
        .to.emit(contract, 'AccessGranted')
        .withArgs(patientA.address, doctorB.address);
      const doctors = await contract.connect(patientA).getAuthDoctors();
      expect(doctors.length).to.equal(2);
    });
  });
});


