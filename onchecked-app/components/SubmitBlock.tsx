import { Button } from "@chakra-ui/react";

export const SubmitBlock = ({
  blockhash,
  signature,
  blocknumber,
  cosignature,
  signerAddress,
  cosignerAddress,
}: {
  blockhash: string;
  signature: string;
  blocknumber: number;
  cosignature: string;
  signerAddress: string;
  cosignerAddress: string;
}) => {
  const submitSignature = () => {
    console.log("⛓ Blockhash", blockhash);
    console.log("⛓ SignedBlockhash (1)", signature);
    console.log("⛓ Blocknumber", blocknumber);
    console.log("⛓ Address (signer)", signerAddress);
    console.log("⛓ Address (cosigner)", cosignerAddress);
    console.log("⛓ CosignedBlockhash", cosignature);
  };
  return <Button onClick={() => submitSignature()}>Submit</Button>;
};
