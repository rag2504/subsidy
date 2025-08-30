const hre = require("hardhat");
async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const C = await hre.ethers.getContractFactory("SubsidyProgram");
  const c = await C.deploy(deployer.address);
  await c.deployed();
  console.log("SubsidyProgram:", c.address);
  await (await c.setRole(hre.ethers.utils.id("AUDITOR_ROLE"), deployer.address, true)).wait();
  await (await c.setRole(hre.ethers.utils.id("BANK_ROLE"), deployer.address, true)).wait();
}
main().catch((e)=>{console.error(e);process.exit(1);});
