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
import { useEffect, useState } from "react";
import { useNetwork } from "wagmi";
import { truncate } from "../lib/helpers";
import { getPoEAddress, getPoEDeployedBlock } from "../lib/sign";
import { ProofsDataResponse, Proof } from "../pages/api/proofs";

export const ProofsTable = () => {
  const { chain: currentChain } = useNetwork();
  const [proofs, setProofs] = useState<Proof[]>([]);

  useEffect(() => {
    const loadProofs = async () => {
      if (currentChain) {
        const poeContractAddress = getPoEAddress(currentChain);
        const poeDeployedBlock = getPoEDeployedBlock(currentChain);
        const proofs: ProofsDataResponse = await (
          await fetch(
            `/api/proofs?contractAddress=${poeContractAddress}&initialBlock=${poeDeployedBlock}`
          )
        ).json();
        if (proofs.responses) {
          setProofs(proofs.responses);
        }
      }
    };
    loadProofs();
  }, [currentChain]);

  return (
    <TableContainer>
      <Table size="sm">
        <Thead>
          <Tr>
            <Th>Signer</Th>
            <Th>Cosigner</Th>
            <Th>Tx Hash</Th>
          </Tr>
        </Thead>
        <Tbody>
          {proofs.map((proof) => (
            <Tr key={proof.transaction}>
              <Td>{truncate(proof.signer, 40)}</Td>
              <Td>{truncate(proof.cosigner, 40)}</Td>
              <Td>{truncate(proof.transaction, 62)}</Td>
            </Tr>
          ))}
        </Tbody>
        <Tfoot>
          <Tr>
            <Th>Signer</Th>
            <Th>Cosigner</Th>
            <Th>Tx Hahs</Th>
          </Tr>
        </Tfoot>
      </Table>
    </TableContainer>
  );
};
