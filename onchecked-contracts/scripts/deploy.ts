import { ethers } from "hardhat";

async function main() {
  const PoE = await ethers.getContractFactory("PoE");
  const poe = await PoE.deploy();

  await poe.deployed();

  console.log(`Deployed to ${poe.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});