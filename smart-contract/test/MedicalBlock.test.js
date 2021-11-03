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
    it("ContractOwner -> Should add admin to blockchain", async function () {
      await contract.addAdmin(admin.address);
      var exist = await contract.seeAdminExists(admin.address);
      expect(exist).to.equal(true);
    });
  
    it("ContractOwner -> Should add doctors to blockchain", async function () {
      await expect(contract.addDoctor(doctorA.address, "Dr Monk"))
        .to.emit(contract, 'AddedProvider')
        .withArgs(contractOwner.address, doctorA.address);
      var exist = await contract.seeDoctorExists(doctorA.address);
      expect(exist).to.equal(true);
    });
  });
  describe("Admin methods", function () {
    it("Admin -> Should add doctors to blockchain", async function () {
      await expect(contract.connect(admin).addDoctor(doctorB.address, "Dr House"))
        .to.emit(contract, 'AddedProvider')
        .withArgs(admin.address, doctorB.address);
      var exist = await contract.seeDoctorExists(doctorB.address);
      expect(exist).to.equal(true);
    });
  });
  describe("Doctor methods", function() {
    it("Doctors -> Should add patients to blockchain", async function () {
      await expect(contract.connect(doctorA).addPatient(patientA.address, "Theo Bigwig"))
        .to.emit(contract, 'AddedPatient')
        .withArgs(doctorA.address, patientA.address);
      await expect(contract.connect(doctorB).addPatient(patientB.address, "Susan Smith"))
        .to.emit(contract, 'AddedPatient')
        .withArgs(doctorB.address, patientB.address);
      var exist = await contract.seePatientExists(patientA.address);
      var exist2 = await contract.seePatientExists(patientB.address);
      expect(exist).to.equal(true);
      expect(exist2).to.equal(true);
    });
  });

  describe("Get roles", function () {
    it("Should get right roles", async () => {
      const ownerRole = await contract.getRole();
      const adminRole = await contract.connect(admin).getRole();
      const doctorRole = await contract.connect(doctorA).getRole();
      const patientRole = await contract.connect(patientA).getRole();
      
      expect(ownerRole).to.equal(0);
      expect(adminRole).to.equal(1);
      expect(doctorRole).to.equal(2);
      expect(patientRole).to.equal(3);
    });
  });

  describe("Grant access", function () {
    it("Patient A grants access to DoctorA", async function () {
      await expect(contract.connect(patientA).grantAccess(doctorA.address))
        .to.emit(contract, 'AccessGranted')
        .withArgs(patientA.address, doctorA.address);
      var perm = await contract.getPermissions(patientA.address, doctorA.address);
      expect(perm.read).to.equal(true);
      expect(perm.write).to.equal(true);
    });
    it("Patient A revokes access to DoctorA", async () => {
      await expect(contract.connect(patientA).revokeAccess(doctorA.address))
        .to.emit(contract, 'AccessRevoked')
        .withArgs(patientA.address, doctorA.address);
      var perm = await contract.getPermissions(patientA.address, doctorA.address);
      expect(perm.read).to.equal(false);
      expect(perm.write).to.equal(false);
    });
    it("Patient B grants access to DoctorA", async function () {
      await expect(contract.connect(patientB).grantAccess(doctorA.address))
        .to.emit(contract, 'AccessGranted')
        .withArgs(patientB.address, doctorA.address);
      var perm = await contract.getPermissions(patientB.address, doctorA.address);
      expect(perm.read).to.equal(true);
      expect(perm.write).to.equal(true);
    });
    it("DoctorA can read patient info of PatientB", async function () {
      expect(await contract.seePatientExists(patientB.address)).to.equal(true);
      var patientInfo = await contract.connect(doctorA).getPatientInfo(patientB.address);
      expect(patientInfo[1]).to.equal("Susan Smith");
      expect(patientInfo[2]).to.equal(patientB.address);
    });
    it("DoctorB can not read patient info of PatientB", async function () {
      expect(await contract.seePatientExists(patientB.address)).to.equal(true);
      await expect(contract.connect(doctorB).getPatientInfo(patientB.address)).to.be.reverted;
    });
  });

  describe("Add Digital EHR", function () {
    it("Create empty EhR", async () => {
      expect(await contract.seePatientExists(patientB.address)).to.equal(true);
      await expect(contract.connect(patientB).createEmptyEHR())
        .to.emit(contract, 'CreateEHR')
        .withArgs(patientB.address);
    });
    it("Permissioned doctor can update patient's EHR", async () => {
      const EHRhash = ethers.utils.id("this is an update"); 
      await expect(contract.connect(doctorA).updateEHR(patientB.address, EHRhash))
        .to.emit(contract, 'UpdatedEHR')
        .withArgs(patientB.address, doctorA.address, EHRhash);
    });
    it("Permissoned doctor can get all records of patient", async () => {
      const EHRhash = ethers.utils.id("new update");
      await contract.connect(doctorA).updateEHR(patientB.address, EHRhash);
      const records = await contract.connect(doctorA).getRecords(patientB.address);
      expect(records._accessKeys.length).to.equal(3);
    })
  })
  describe("Get all authorized records", function() {
    it("Doctor A should have 2 patients (A/B) under the supervision", async () => {
      await expect(contract.connect(patientA).grantAccess(doctorA.address))
        .to.emit(contract, 'AccessGranted')
        .withArgs(patientA.address, doctorA.address);
      const patients = await contract.connect(doctorA).getAuthPatients();
    });
    it("Patient A should have 2 authorized doctors", async () => {
      await expect(contract.connect(patientA).grantAccess(doctorB.address))
        .to.emit(contract, 'AccessGranted')
        .withArgs(patientA.address, doctorB.address);
      const doctors = await contract.connect(patientA).getAuthDoctors();
    });
  })
});


