import { truncate } from "../lib/helpers";
import { getPoEAddress, getPoEDeployedBlock } from "../lib/sign";
import { ProofsDataResponse, Proof } from "../pages/api/proofs";
import { ProofTable } from "./ProofTable";
import { CheckCircleIcon } from "@chakra-ui/icons";
import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Tfoot,
  Icon,
} from "@chakra-ui/react";
import { useEffect, useState, Fragment } from "react";
import { useNetwork } from "wagmi";

export const ProofsTable = () => {
  const { chain: currentChain } = useNetwork();
  const [proofs, setProofs] = useState<Proof[]>([]);
  const [selectedProof, setSelectedProof] = useState<Proof>();

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
            <Th>Proof</Th>
            <Th>Type</Th>
            <Th>Timestamp</Th>
          </Tr>
        </Thead>
        <Tbody>
          {proofs.map((proof) => {
            const isCurrentSelectedProof =
              selectedProof && selectedProof.transaction == proof.transaction;
            return (
              <Fragment key={proof.transaction}>
                <Tr
                  onClick={() =>
                    isCurrentSelectedProof
                      ? setSelectedProof(undefined)
                      : setSelectedProof(proof)
                  }
                >
                  <Td>{truncate(proof.signer, 40)}-{truncate(proof.cosigner, 40)}</Td>
                  <Td textAlign="center">
                    <Icon
                      color={
                        proof.eventType == "witnessed"
                          ? "blue.500"
                          : "green.500"
                      }
                      as={CheckCircleIcon}
                    />
                  </Td>
                  <Td>{new Date(proof.timestamp).toLocaleString()}</Td>
                </Tr>
                {isCurrentSelectedProof && (
                  <Tr>
                    <Td colSpan={3} style={{ padding: 0 }}>
                      <ProofTable
                        transaction={proof.transaction}
                        signer={proof.signer}
                        cosigner={proof.cosigner}
                        blocknumber={proof.blocknumber}
                        signedBlocknumber={proof.signedBlocknumber}
                      />
                    </Td>
                  </Tr>
                )}
              </Fragment>
            );
          })}
        </Tbody>
        <Tfoot>
          <Tr>
            <Th>Proof</Th>
            <Th>Type</Th>
            <Th>Timestamp</Th>
          </Tr>
        </Tfoot>
      </Table>
    </TableContainer>
  );
};
