import { Button } from "@chakra-ui/react";
import { PoE__factory } from "../types";
import { Chain, chain, useNetwork, useSigner } from "wagmi";
import { customLocalhost } from "../constants/sign";
import { useState } from "react";
import { ethers } from "ethers";
import { CheckCircleIcon } from "@chakra-ui/icons";

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
  const { chain: currentChain } = useNetwork();
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);

  // @TODO: Make this an env rather than hardcoded
  const getPoEAddress = (_chain: Chain): string | undefined => {
    const POE_CONTRACTS = {
      [chain.polygonMumbai.id]: "0xc48451a1c88BbBdc37E0E32Ab885e5bBBFc78802",
      [customLocalhost.id]: "0x7C4FeBbF95db0f758380cF2FAB5Da864050A928F",
    };
    return POE_CONTRACTS[_chain.id];
  };
  const submitSignature = async () => {
    // @TODO: Ensure signer is around.
    if (!signer) return;
    // @TODO: Ensure currenct chain is around;
    if (!currentChain) return;
    const poeContractAddress = getPoEAddress(currentChain);
    // @TODO: Fail gracefully if contract not in current network.
    if (!poeContractAddress) return;

    setIsLoadingSubmit(true);
    setTimeout(() => {
      setIsLoadingSubmit(false);
    }, 30000);

    const contract = PoE__factory.connect(poeContractAddress, signer);

    console.log("⛓ Blockhash", blockhash);
    console.log("⛓ SignedBlockhash (1)", signature);
    console.log("⛓ Blocknumber", blocknumber);
    console.log("⛓ Address (signer)", signerAddress);
    console.log("⛓ Address (cosigner)", cosignerAddress);
    console.log("⛓ CosignedBlockhash", cosignature);

    const tx = await contract.verifyCosignedBlockhash(
      blockhash,
      signature,
      blocknumber,
      signature,
      cosignature,
      signerAddress,
      cosignerAddress
    );

    await signer?.provider?.waitForTransaction(tx.hash);

    // Expect that we have emited the ”Witnessed” event
    const filter = contract.filters.Witnessed();
    const events = await contract.queryFilter(filter);
    const [event] = events;
    const { blockHash: bh } = event;

    setIsLoadingSubmit(false);
    setIsSuccessful(bh === blockhash);
  };
  return isSuccessful ? (
    <Button
      rightIcon={<CheckCircleIcon />}
      colorScheme="green"
      variant="outline"
    >
      Success (Go to Dashboard)
    </Button>
  ) : (
    <Button isLoading={isLoadingSubmit} onClick={() => submitSignature()}>
      Submit
    </Button>
  );
};
