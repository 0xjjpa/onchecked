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
      // We obtain bH = y and bN = b where {b: y} from smart contract
      const prevBlock = await hre.ethers.provider.getBlock(latestBlock.number - 2);
      console.log("(JS) [ n-2 Block] Blockhash from Node + RPC Call", prevBlock.hash, prevBlock.number);

      // We mine the next block such as {a+1: y}
      await hre.ethers.provider.send("evm_mine", []);

      // We ensure that given {a, x} we return true
      expect(await this.poe.connect(this.signers.admin).verify(
        blockhash,
        blockNumber
      )).to.be.true

      await hre.ethers.provider.send("evm_mine", []);

      // We ensure that given {b, y} we return true
      expect(await this.poe.connect(this.signers.admin).verify(
        prevBlock.hash,
        prevBlock.number
      )).to.be.true

      await hre.ethers.provider.send("evm_mine", []);

      // We ensure that given {a+1, x} we revert
      expect(await this.poe.connect(this.signers.admin).verify(
        blockhash,
        blockNumber.add(1).toString()
      )).to.be.false

    });

    it('should return false if more than 256 blocks have passed the current block number', async function() {
      // We obtain bH = x and bN = a where {a: x} from smart contract
      const [blockhash, blockNumber]: [string, BigNumber] = await this.poe.connect(this.signers.admin).echo();
      // We ensure that given {a, x} we return true
      expect(await this.poe.connect(this.signers.admin).verify(
        blockhash,
        blockNumber
      )).to.be.true

      
      // We mine 256 blocks
      let counter = 0;
      while(counter <= 254) { // Only 254 as we are already 2 blocks in.
        await hre.ethers.provider.send("evm_mine", []);
        counter++;
      }

      // We ensure that given {a, x} we return true, as block.number - a <= 256
      expect(await this.poe.connect(this.signers.admin).verify(
        blockhash,
        blockNumber
      )).to.be.true

      await hre.ethers.provider.send("evm_mine", []);

      // We ensure that given {a, x} we return false, as block.number - a > 256
      expect(await this.poe.connect(this.signers.admin).verify(
        blockhash,
        blockNumber
      )).to.be.false
    })
  });
});
