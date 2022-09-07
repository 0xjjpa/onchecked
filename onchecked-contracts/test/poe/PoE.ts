import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import hre, { ethers } from "hardhat";
import { expect } from "chai";
import { PoE, PoE__factory } from "../../src/types";

import type { Signers } from "../types";
import { BigNumber, providers, utils } from "ethers";
import { keccak256, toUtf8Bytes } from "ethers/lib/utils";

const mineBlocks = async (LIMIT = 255) => {
  let counter = 0;
  while (counter <= LIMIT) {
    await hre.ethers.provider.send("evm_mine", []);
    counter++;
  }
}

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
      expect(await this.poe.connect(this.signers.admin).verifyBlockhash(
        blockhash,
        blockNumber
      )).to.be.true

      await hre.ethers.provider.send("evm_mine", []);

      // We ensure that given {b, y} we return true
      expect(await this.poe.connect(this.signers.admin).verifyBlockhash(
        prevBlock.hash,
        prevBlock.number
      )).to.be.true

      await hre.ethers.provider.send("evm_mine", []);

      // We ensure that given {a+1, x} we revert
      expect(await this.poe.connect(this.signers.admin).verifyBlockhash(
        blockhash,
        blockNumber.add(1).toString()
      )).to.be.false

    });

    it('should return false if more than 256 blocks have passed the current block number', async function () {
      // We obtain bH = x and bN = a where {a: x} from smart contract
      const [blockhash, blockNumber]: [string, BigNumber] = await this.poe.connect(this.signers.admin).echo();
      // We ensure that given {a, x} we return true
      expect(await this.poe.connect(this.signers.admin).verifyBlockhash(
        blockhash,
        blockNumber
      )).to.be.true


      // We mine 256 blocks
      await mineBlocks(254); // Only 254 as we are already 2 blocks in, and want to mine the last manually

      // We ensure that given {a, x} we return true, as block.number - a <= 256
      expect(await this.poe.connect(this.signers.admin).verifyBlockhash(
        blockhash,
        blockNumber
      )).to.be.true

      await hre.ethers.provider.send("evm_mine", []);

      // We ensure that given {a, x} we return false, as block.number - a > 256
      expect(await this.poe.connect(this.signers.admin).verifyBlockhash(
        blockhash,
        blockNumber
      )).to.be.false
    })

    it('should return whether a signed blockhash belongs to the owner and is still valid', async function () {
      const [admin] = await ethers.getSigners();
      // We obtain bH = x and bN = a where {a: x} from smart contract
      const [blockhash, blockNumber]: [string, BigNumber] = await this.poe.connect(this.signers.admin).echo();

      // We obtain signed_bH and pass it over to the
      let message = ethers.utils.solidityPack(["string"], [blockhash]);
      message = ethers.utils.solidityKeccak256(["bytes"], [message]);
      const signedBlockhash = await admin.signMessage(ethers.utils.arrayify(message));
      //const signedBlockhash = await admin.signMessage(blockhash);
      console.log("Signed bH (JS)", signedBlockhash);
      console.log("Keccak256 bH (JS)", keccak256(toUtf8Bytes(blockhash)));
      console.log("Address (JS)", admin.address);

      const isValid = await this.poe.connect(this.signers.admin).verifySignedBlockhash(
        blockhash,
        blockNumber,
        signedBlockhash,
        admin.address
      )

      expect(isValid).to.be.true
    })

    it('should be able to validate the two parties that have signed a blockhash', async function () {
      const [alice, bob] = await ethers.getSigners();

      // We obtain bH = x and bN = a where {a: x} from smart contract
      const [blockhash, blockNumber]: [string, BigNumber] = await this.poe.connect(this.signers.admin).echo();

      // We obtain alice.signed_bH and pass it over to the
      let message = ethers.utils.solidityPack(["string"], [blockhash]);
      message = ethers.utils.solidityKeccak256(["bytes"], [message]);
      const signedBlockhashByAlice = await alice.signMessage(ethers.utils.arrayify(message));

      // We obtain bob.signed_aliceSignedBH and pass it over
      message = ethers.utils.solidityPack(["string"], [signedBlockhashByAlice]);
      message = ethers.utils.solidityKeccak256(["bytes"], [message]);
      const signedBlockhashByAliceAndBob = await bob.signMessage(ethers.utils.arrayify(message));

      // string memory _blockhash, string memory _signedBlockhash, uint256 _blocknumber, bytes memory _signature, bytes memory _cosignature, address _signer, address _cosigner
      const tx = await this.poe.connect(this.signers.admin).verifyCosignedBlockhash(
        blockhash,
        signedBlockhashByAlice,
        blockNumber,
        signedBlockhashByAlice,
        signedBlockhashByAliceAndBob,
        alice.address,
        bob.address
      );

      await ethers.provider.waitForTransaction(tx.hash);

      const filter = this.poe.filters.Witnessed();
      const events = await this.poe.queryFilter(filter);

      // Expect that we have emited the ”Witnessed” event
      const [event] = events;
      const { cosigner, blockhash: bh, blocknumber } = event.args;
      expect(cosigner).to.eq(bob.address);
      expect(blockhash).to.eq(bh);
      expect(blocknumber).to.eq(blockNumber);

      // Expect that we stored the proof inside the smart contract to check later
      const proof = await this.poe.getSignature(bob.address);
      expect(proof._blockhash).to.eq(blockhash);
      expect(proof._blocknumber).to.eq(blockNumber);
    })

    it('should fail to validate a two-parties signature if >256 blocks have passed', async function () {
      const [alice, bob] = await ethers.getSigners();

      // We obtain bH = x and bN = a where {a: x} from smart contract
      const [blockhash, blockNumber]: [string, BigNumber] = await this.poe.connect(this.signers.admin).echo();

      // We mine 254 blocks
      await mineBlocks(254);

      // We obtain alice.signed_bH and pass it over to the
      let message = ethers.utils.solidityPack(["string"], [blockhash]);
      message = ethers.utils.solidityKeccak256(["bytes"], [message]);
      const signedBlockhashByAlice = await alice.signMessage(ethers.utils.arrayify(message));

      // We obtain bob.signed_aliceSignedBH and pass it over
      message = ethers.utils.solidityPack(["string"], [signedBlockhashByAlice]);
      message = ethers.utils.solidityKeccak256(["bytes"], [message]);
      const signedBlockhashByAliceAndBob = await bob.signMessage(ethers.utils.arrayify(message));

      const tx = await this.poe.connect(this.signers.admin).verifyCosignedBlockhash(
        blockhash,
        signedBlockhashByAlice,
        blockNumber,
        signedBlockhashByAlice,
        signedBlockhashByAliceAndBob,
        alice.address,
        bob.address
      );

      await ethers.provider.waitForTransaction(tx.hash);

      const filter = this.poe.filters.Witnessed();
      const events = await this.poe.queryFilter(filter);

      // Expect that we have NOT emited the “Witnessed” event
      const [event] = events;
      expect(event).to.be.undefined;

      // Expect that there's no the proof stored inside the smart contract due to >256 blocks mined since bH
      const proof = await this.poe.getSignature(bob.address);
      expect(proof._blockhash).to.eq('');
      expect(proof._blocknumber).to.eq(0);
    })

    it('should emit an attestation event when two signatures have been confirmed within <256 blocks', async function() {
      const [alice, bob] = await ethers.getSigners();

      // We obtain bH = x and bN = a where {a: x} from smart contract
      const [blockhash, blockNumber]: [string, BigNumber] = await this.poe.connect(this.signers.admin).echo();

      // We obtain alice.signed_bH and pass it over to the
      let message = ethers.utils.solidityPack(["string"], [blockhash]);
      message = ethers.utils.solidityKeccak256(["bytes"], [message]);
      const signedBlockhashByAlice = await alice.signMessage(ethers.utils.arrayify(message));

      // We obtain bob.signed_aliceSignedBH and pass it over
      message = ethers.utils.solidityPack(["string"], [signedBlockhashByAlice]);
      message = ethers.utils.solidityKeccak256(["bytes"], [message]);
      const signedBlockhashByAliceAndBob = await bob.signMessage(ethers.utils.arrayify(message));

      const tx = await this.poe.connect(this.signers.admin).verifyCosignedBlockhash(
        blockhash,
        signedBlockhashByAlice,
        blockNumber,
        signedBlockhashByAlice,
        signedBlockhashByAliceAndBob,
        alice.address,
        bob.address
      );

      await ethers.provider.waitForTransaction(tx.hash);

      const filter = this.poe.filters.Witnessed();
      const events = await this.poe.queryFilter(filter);

      // Expect that we have emited the ”Witnessed” event
      const [event] = events;
      const { cosigner, blockhash: bh, blocknumber } = event.args;
      expect(cosigner).to.eq(bob.address);
      expect(blockhash).to.eq(bh);
      expect(blocknumber).to.eq(blockNumber);

      // Expect that we stored the proof inside the smart contract to check later
      const proof = await this.poe.getSignature(bob.address);
      expect(proof._blockhash).to.eq(blockhash);
      expect(proof._blocknumber).to.eq(blockNumber);

      // We mine 25 blocks
      await mineBlocks(25);

      // We obtain bH = x and bN = a where {a: x} from smart contract
      const [blockhash2, blockNumber2]: [string, BigNumber] = await this.poe.connect(this.signers.admin).echo();

      // We obtain bob.signed_bH and pass it over to the
      let message2 = ethers.utils.solidityPack(["string"], [blockhash2]);
      message2 = ethers.utils.solidityKeccak256(["bytes"], [message2]);
      const signedBlockhashByBob = await bob.signMessage(ethers.utils.arrayify(message2));

      // We obtain alice.signed_aliceSignedBH and pass it over
      message2 = ethers.utils.solidityPack(["string"], [signedBlockhashByBob]);
      message2 = ethers.utils.solidityKeccak256(["bytes"], [message2]);
      const signedBlockhashByBobAndAlice = await alice.signMessage(ethers.utils.arrayify(message2));

      const tx2 = await this.poe.connect(this.signers.admin).verifyCosignedBlockhash(
        blockhash2,
        signedBlockhashByBob,
        blockNumber2,
        signedBlockhashByBob,
        signedBlockhashByBobAndAlice,
        bob.address,
        alice.address
      );

      await ethers.provider.waitForTransaction(tx2.hash);

      const filter2 = this.poe.filters.Attested();
      const events2 = await this.poe.queryFilter(filter2);

      // Expect that we have emited the ”Attested” event
      const [event2] = events2;
      expect(event2).to.not.be.undefined
    })


  });
});
