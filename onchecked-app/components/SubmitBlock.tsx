import { Button } from "@chakra-ui/react";
import { PoE__factory } from "../types";
import { useSigner } from "wagmi";

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
  const { data: signer } = useSigner();
  // @TODO: Make this an env rather than hardcoded
  const POE_ADDRESS = '0x7C4FeBbF95db0f758380cF2FAB5Da864050A928F'
  const submitSignature = async () => {
    // @TODO: Ensure signer is around.
    if (!signer) return;
    const contract = PoE__factory.connect(POE_ADDRESS, signer);
    console.log("⛓ Blockhash", blockhash);
    console.log("⛓ SignedBlockhash (1)", signature);
    console.log("⛓ Blocknumber", blocknumber);
    console.log("⛓ Address (signer)", signerAddress);
    console.log("⛓ Address (cosigner)", cosignerAddress);
    console.log("⛓ CosignedBlockhash", cosignature);
    await contract.verifyCosignedBlockhash(
      blockhash,
      signature,
      blocknumber,
      signature,
      cosignature,
      signerAddress,
      cosignerAddress
    );
  };
  return <Button onClick={() => submitSignature()}>Submit</Button>;
};
