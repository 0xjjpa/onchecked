import { Button } from "@chakra-ui/react";
import { PoE__factory } from "../types";
import { Chain, chain, useNetwork, useSigner } from "wagmi";
import { customLocalhost } from "../constants/sign";

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
  const { chain: currentChain, chains } = useNetwork();
  console.log("Chain", chains);
  // @TODO: Make this an env rather than hardcoded

  const getPoEAddress = (_chain: Chain): string | undefined => {
    const POE_CONTRACTS = {
      [chain.polygonMumbai.id]: '0xc48451a1c88BbBdc37E0E32Ab885e5bBBFc78802',
      [customLocalhost.id]: '0x7C4FeBbF95db0f758380cF2FAB5Da864050A928F'
    }
    return POE_CONTRACTS[_chain.id];
  }
  const POE_ADDRESS = '0x7C4FeBbF95db0f758380cF2FAB5Da864050A928F'
  const submitSignature = async () => {
    // @TODO: Ensure signer is around.
    if (!signer) return;
    // @TODO: Ensure currenct chain is around;
    if (!currentChain) return;
    const poeContractAddress = getPoEAddress(currentChain);
    // @TODO: Fail gracefully if contract not in current network.
    if (!poeContractAddress) return;
    const contract = PoE__factory.connect(poeContractAddress, signer);
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
