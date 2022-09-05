// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.7;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract PoE {
    function verify(string memory _blockhash, uint256 _blocknumber) external view returns (bool) {
      console.log("* Block Number:", block.number);
      console.log("* Blockhash:", _toString(blockhash(block.number - 1)));
      console.log("- Block Number:", _blocknumber);
      console.log("- Blockhash:", _blockhash);
      console.log("*'%s' == -'%s'", _toString(blockhash(_blocknumber)), _blockhash);
      console.log("Eq?", _equal(_toString(blockhash(_blocknumber)), _blockhash));
      return _equal(_toString(blockhash(_blocknumber)), _blockhash);
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
