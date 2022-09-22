import { DEFAULT_CHAIN } from "../constants/sign";
import { truncate } from "../lib/helpers";
import { Link } from "./Link";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { SimpleGrid, Box, Flex, Tag, Text, Icon } from "@chakra-ui/react";
import { useNetwork } from "wagmi";

export const ProofTable = ({
  transaction,
  signer,
  cosigner,
  blocknumber,
  signedBlocknumber,
}: {
  transaction: string;
  signer: string;
  cosigner: string;
  blocknumber: string;
  signedBlocknumber?: string;
}) => {
  const { chain: currentChain } = useNetwork();
  const defaultChain = currentChain || DEFAULT_CHAIN;
  const blockDifference = +(blocknumber) - +(signedBlocknumber || 0)
  return (
    <SimpleGrid columns={2} my={2} spacing={2}>
      <Box justifyContent="center">
        <Tag>Transaction Hash</Tag>
      </Box>
      <Flex alignSelf="center">
        <Link
          style={{ display: "flex" }}
          isExternal
          href={`${defaultChain.blockExplorers?.default.url}/tx/${transaction}#eventlog`}
        >
          <Text>{truncate(transaction, 60)}</Text>
          <Icon as={ExternalLinkIcon} mx={1} />
        </Link>
      </Flex>
      <Box justifyContent="center">
        <Tag>Signer Account</Tag>
      </Box>
      <Flex alignSelf="center">
        <Link
          style={{ display: "flex" }}
          isExternal
          href={`${defaultChain.blockExplorers?.default.url}/address/${signer}`}
        >
          <Text>{truncate(signer, 40)}</Text>
          <Icon as={ExternalLinkIcon} mx={1} />
        </Link>
      </Flex>
      <Box justifyContent="center">
        <Tag>Cosigner Account</Tag>
      </Box>
      <Flex alignSelf="center">
        <Link
          style={{ display: "flex" }}
          isExternal
          href={`${defaultChain.blockExplorers?.default.url}/address/${cosigner}`}
        >
          <Text>{truncate(cosigner, 40)}</Text>
          <Icon as={ExternalLinkIcon} mx={1} />
        </Link>
      </Flex>
      <Box justifyContent="center">
        <Tag>Block Number</Tag>
      </Box>
      <Flex alignSelf="center">
        <Link
          style={{ display: "flex" }}
          isExternal
          href={`${defaultChain.blockExplorers?.default.url}/block/${blocknumber}`}
        >
          <Text>{blocknumber}</Text>
          <Icon as={ExternalLinkIcon} mx={1} />
        </Link>
      </Flex>
      {signedBlocknumber && (
        <>
          <Box justifyContent="center">
            <Tag>Block Difference</Tag>
          </Box>
          <Flex alignSelf="center">
            <Text>{blockDifference}</Text>
          </Flex>
        </>
      )}
    </SimpleGrid>
  );
};
