import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import hre, { ethers } from "hardhat";
import { expect } from "chai";
import { PoE, PoE__factory } from "../../src/types";

import type { Signers } from "../types";
import { BigNumber, utils } from "ethers";

describe("Unit tests", function () {
  before(async function () {
    this.signers = {} as Signers;

    const signers: SignerWithAddress[] = await ethers.getSigners();
    this.signers.admin = signers[0];

    this.loadFixture = loadFixture;
  });

  describe("PoE", function () {
    beforeEach(async function () {
      const signers: SignerWithAddress[] = await ethers.getSigners();
      const admin: SignerWithAddress = signers[0];

      const poeFactory: PoE__factory = <PoE__factory>await ethers.getContractFactory("PoE");
      const poe: PoE = <PoE>await poeFactory.connect(admin).deploy();
      await poe.deployed();
      this.poe = poe;
    });

    it("should return true if the given blockhash matches the respective block number", async function () {
      // We obtain bH = x and bN = a where {a: x} from smart contract
      const [blockhash, blockNumber]: [string, BigNumber] = await this.poe.connect(this.signers.admin).echo();
      console.log("(JS) [Last Block] Blockhash from Smart Contract", blockhash, blockNumber.toString());
      // We obtain the last block directly from the node by using a RPC call
      const latestBlock = await hre.ethers.provider.getBlock("latest");
      console.log("(JS) [Last Block] Blockhash from Node + RPC Call", latestBlock.hash, latestBlock.number);

      const prevBlock = await hre.ethers.provider.getBlock(latestBlock.number - 1);
      console.log("(JS) [Prev Block] Blockhash from Node + RPC Call", prevBlock.hash, prevBlock.number);

      // We mine the next block such as {a+1: y}
      await hre.ethers.provider.send("evm_mine", []);

      // We ensure that given {a, x} we return true
      const isTrue = await this.poe.connect(this.signers.admin).verify(
        blockhash,
        blockNumber
      )
      console.log("Is True", isTrue);
      // We ensure that given {a+1, x} we revert
      expect(await this.poe.connect(this.signers.admin).verify(
        blockhash,
        blockNumber.add(1).toString()
      )).to.be.false

    });
  });
});
