import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Tfoot,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useNetwork } from "wagmi";
import { getPoEAddress, getPoEDeployedBlock } from "../lib/sign";

export const ProofsTable = () => {
  const { chain: currentChain } = useNetwork();

  useEffect(() => {
    const loadProofs = async() => {
      if (currentChain) {
        const poeContractAddress = getPoEAddress(currentChain);
        const poeDeployedBlock = getPoEDeployedBlock(currentChain);
        const proofs = await fetch(`/api/proofs?contractAddress=${poeContractAddress}&initialBlock=${poeDeployedBlock}`);
      }
    }
    loadProofs();
  }, [currentChain]);

  return (
    <TableContainer>
      <Table size="sm">
        <Thead>
          <Tr>
            <Th>Signer</Th>
            <Th>Cosigner</Th>
            <Th>Transaction</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>0x123456...789</Td>
            <Td>0x234567...980</Td>
            <Td>0x111111...111</Td>
          </Tr>
        </Tbody>
        <Tfoot>
          <Tr>
            <Th>Signer</Th>
            <Th>Cosigner</Th>
            <Th>Transaction</Th>
          </Tr>
        </Tfoot>
      </Table>
    </TableContainer>
  );
};
