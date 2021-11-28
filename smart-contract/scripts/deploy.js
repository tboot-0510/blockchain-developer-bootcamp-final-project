// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const HealthContractFactory = await hre.ethers.getContractFactory('MedicalBlock');
  const HealthContract = await HealthContractFactory.deploy();
  await HealthContract.deployed();
  console.log('Contract deployed to:', HealthContract.address);
  console.log("Contract deployed by:", owner.address);
  await HealthContract.addAdmin("0x54639a506d5C0BF68e765775fb895c0d4413B5De")
  console.log('Added Admin 0x54639a506d5C0BF68e765775fb895c0d4413B5De');

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
