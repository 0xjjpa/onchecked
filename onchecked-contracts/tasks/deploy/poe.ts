import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

import type { PoE } from "../../src/types/PoE";
import type { PoE__factory } from "../../src/types/factories/PoE__factory";

task("deploy:PoE")
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const signers: SignerWithAddress[] = await ethers.getSigners();
    const poeFactory: PoE__factory = <PoE__factory>await ethers.getContractFactory("PoE");
    console.log("👤 Deployer Address:", signers[0].address);
    const poe: PoE = <PoE>await poeFactory.connect(signers[0]).deploy();
    await poe.deployed();
    console.log("PoE deployed to: ", poe.address);
  });
