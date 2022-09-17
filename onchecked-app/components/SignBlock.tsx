import { Button, Code, Box, SimpleGrid } from "@chakra-ui/react";
import { utils } from "ethers";
import {
  useAccount,
  useBlockNumber,
  useProvider,
  useSigner,
  useSignTypedData,
} from "wagmi";

export const SignBlock = ({
  signedSignature,
  signedAddress,
  setSignature,
  setBlockhash,
  setBlocknumber,
  setAddress,
  setCosignature,
}: {
  signedSignature?: string;
  signedAddress?: string;
  setSignature: (signature: string) => void;
  setBlockhash: (blockhash: string) => void;
  setBlocknumber: (blocknumber: number) => void;
  setAddress: (address: string) => void;
  setCosignature: (cosignature: string) => void;
}) => {
  const { isConnected, address } = useAccount();
  const { data: signer } = useSigner();
  const provider = useProvider();
  const { data, isError, isLoading } = useBlockNumber({
    watch: true,
  });
  const { isLoading: isLoadingSigning } = useSignTypedData();

  const getBlockhash = async (blocknumber: number): Promise<string> => {
    const block = await provider.getBlock(blocknumber);
    console.log(blocknumber, block.hash);
    return block.hash;
  };

  const signPayload = async (blocknumber: number | undefined) => {
    const blockhash = await getBlockhash(blocknumber || 0);
    const message = signedSignature
      ? utils.solidityPack(["string"], [signedSignature])
      : utils.solidityPack(["string"], [blockhash]);
    const hashedMessage = utils.solidityKeccak256(["bytes"], [message]);
    // @TODO: Verify signer is there.
    const signature = await signer?.signMessage(utils.arrayify(hashedMessage));
    // @TODO: Migrate to EIP-712
    // const payload: ONCHECKED_MESSAGE_TYPE = {
    //   blockhash,
    // };
    // const signature = await signTypedDataAsync({
    //   domain: ONCHECKED_SIGN_DOMAIN,
    //   types: ONCHECKED_SIGN_TYPES,
    //   value: payload,
    // });

    if (signature && signedSignature && signedAddress) {
      setCosignature(signature);
      console.log("⛓ Blockhash", blockhash);
      console.log("⛓ SignedBlockhash (1)", signedSignature);
      console.log("⛓ Blocknumber", blocknumber);
      console.log("⛓ Address (current)", address);
      console.log("⛓ Address (cosigner)", signedAddress);
      console.log("⛓ CosignedBlockhash", signature);
    } else {
      setBlockhash(blockhash);
      setBlocknumber(blocknumber || 0);
      signature && setSignature(signature);
      address && setAddress(address);
    }
  };

  if (isLoading) return <Code>Fetching block number…</Code>;
  if (isError) return <Code>Error fetching block number</Code>;
  return (
    <SimpleGrid columns={1} spacing={5} justifyItems="center">
      <Box>
        <Code>Block number: {data}</Code>
      </Box>
      <Box>
        {isConnected && (
          <Button
            isLoading={isLoadingSigning}
            onClick={() => signPayload(data)}
          >
            Sign
          </Button>
        )}
      </Box>
    </SimpleGrid>
  );
};
