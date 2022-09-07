// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.7;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

using ECDSA for bytes32; 

contract PoE {
    struct Proof {
      string _blockhash;
      uint256 _blocknumber;
    }
    mapping(address => Proof) signatures;
    function verifyBlockhash(string memory _blockhash, uint256 _blocknumber) public view returns (bool) {
      console.log("* Block Number:", block.number);
      console.log("* Blockhash:", _toString(blockhash(block.number - 1)));
      console.log("- Block Number:", _blocknumber);
      console.log("- Blockhash:", _blockhash);
      console.log("*'%s' == -'%s'", _toString(blockhash(_blocknumber)), _blockhash);
      console.log("Eq?", _equal(_toString(blockhash(_blocknumber)), _blockhash));
      return _equal(_toString(blockhash(_blocknumber)), _blockhash);
    }
    function verifySignature(string memory _message, bytes memory _signature, address _address) public view returns (bool) {
      // Hash the plain text message
      bytes32 messageHash = keccak256(bytes(_message));
      console.log("keccak256 bH:", _toString(messageHash));
      console.log("Address", _address);
      bytes32 message = ECDSA.toEthSignedMessageHash(messageHash);
      address signeraddress = ECDSA.recover(message, _signature);
      console.log("signer", signeraddress);
      if (_address == signeraddress) {
          //The message is authentic
          return true;
      } else {
          //msg.sender didnt sign this message.
          return false;
      }
    }
    function verifySignedBlockhash(string memory _blockhash, uint256 _blocknumber, bytes memory _signature, address _address) public view  returns(bool) {
      //Ensure that given blockhash is within the 256 limit
      bool isValidBlock = verifyBlockhash(_blockhash, _blocknumber);
      if (isValidBlock == false) {
        return false;
      }
      console.log("Is Valid?", isValidBlock);
      return verifySignature(_blockhash, _signature, _address);      
    }
    function verifyCosignedBlockhash(string memory _blockhash, string memory _signedBlockhash, uint256 _blocknumber, bytes memory _signature, bytes memory _cosignature, address _signer, address _cosigner) public view returns(bool) {
      bool isValidBlock = verifyBlockhash(_blockhash, _blocknumber);
      if (isValidBlock == false) {
        return false;
      }
      bool isSigner;
      bool isCosigner;
      (isSigner) = verifySignature(_blockhash, _signature, _signer);
      if (isSigner) {
          (isCosigner) = verifySignature(_signedBlockhash, _cosignature, _cosigner);
          if (isCosigner) {
            // _addSignature(_cosigner, _blockhash, _blocknumber);
            // bytes32 key = keccak256(abi.encodePacked(cosigner, _blockhash, _blocknumber));
            // signatures[key] = signer;
            return true;
          } else {
            return false;
          }
      } else {
          return false;
      }
    }
    function _addSignature(address _address, string memory _blockhash, uint256 _blocknumber) private {
      Proof memory _proof = Proof(_blockhash, _blocknumber);
      signatures[_address] = _proof;
    }
    function _toString(bytes32 arg) pure private returns (string memory) {
      return Strings.toHexString(uint256(arg), 32);
    }
    function _equal(string memory a, string memory b) pure private returns (bool) {
      return keccak256(abi.encode(a)) == keccak256(abi.encode(b));
    }
    function echo() external view returns (bytes32, uint256) {
      return (blockhash(block.number - 1), block.number - 1);
    }
}
