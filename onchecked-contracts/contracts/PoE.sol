// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.7;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract PoE {
    function verify(string memory _blockhash, uint256 _blocknumber) external view returns (bool) {
      console.log("* Block Number:", block.number);
      console.log("* Blockhash:", Strings.toHexString(uint256(blockhash(block.number - 1)), 32));
      console.log("- Block Number:", _blocknumber);
      console.log("- Blockhash:", _blockhash);
      console.log("*'%s' == -'%s'", Strings.toHexString(uint256(blockhash(_blocknumber)), 32), _blockhash);
      console.log("Cast *", Strings.toHexString(uint256(blockhash(_blocknumber)), 32));
      console.log("Cast -", Strings.toHexString(uint256(bytes32(bytes(_blockhash))), 32));
      console.log("Eq?", (keccak256(abi.encodePacked((blockhash(_blocknumber) )))) == (keccak256(abi.encodePacked((_blockhash)))));
      return (keccak256(abi.encodePacked((blockhash(_blocknumber) )))) == (keccak256(abi.encodePacked((_blockhash))));
    }
    function echo() external view returns (bytes32, uint256) {
      return (blockhash(block.number - 1), block.number - 1);
    }
}
