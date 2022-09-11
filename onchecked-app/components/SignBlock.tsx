import { Button, Code, Box, SimpleGrid } from "@chakra-ui/react";
import {
  useAccount,
  useBlockNumber,
  useProvider,
  useSignTypedData,
} from "wagmi";
import {
  ONCHECKED_MESSAGE_TYPE,
  ONCHECKED_SIGN_DOMAIN,
  ONCHECKED_SIGN_TYPES,
} from "../constants/sign";

export const SignButton = ({
  blocknumber,
  blockhash,
}: {
  blocknumber: number;
  blockhash: string;
}) => {};

export const SignBlock = () => {
  const { isConnected } = useAccount();
  const provider = useProvider();
  const { data, isError, isLoading } = useBlockNumber({
    watch: true,
  });
  const {
    data: signedData,
    signTypedDataAsync,
  } = useSignTypedData();

  const getBlockhash = async (blocknumber: number): Promise<string> => {
    const block = await provider.getBlock(blocknumber);
    console.log(blocknumber, block.hash);
    return block.hash;
  };

  const signPayload = async (blocknumber: number | undefined) => {
    const blockhash = await getBlockhash(blocknumber || 0);
    const payload: ONCHECKED_MESSAGE_TYPE = {
      blockhash,
      blocknumber: blocknumber || 0,
    };
    const data = await signTypedDataAsync({
      domain: ONCHECKED_SIGN_DOMAIN,
      types: ONCHECKED_SIGN_TYPES,
      value: payload,
    });
    console.log("Data", data);
  };

  if (isLoading) return <Code>Fetching block number…</Code>;
  if (isError) return <Code>Error fetching block number</Code>;
  return (
    <SimpleGrid columns={1} spacing={5} justifyItems="center">
      <Box>
        <Code>Block number: {data}</Code>
      </Box>
      <Box>
        {isConnected && <Button onClick={() => signPayload(data)}>Sign</Button>}
      </Box>
    </SimpleGrid>
  );
};
