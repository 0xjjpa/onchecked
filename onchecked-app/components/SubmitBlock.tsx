import { getPoEAddress } from "../lib/sign";
import { PoE__factory } from "../types";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";
import { useState } from "react";
import { useNetwork, useSigner } from "wagmi";
import { Link } from "./Link";

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

  const submitSignature = async () => {
    // @TODO: Ensure signer is around.
    if (!signer) return;
    // @TODO: Ensure currenct chain is around;
    if (!currentChain) return;
    const poeContractAddress = getPoEAddress(currentChain);
    // @TODO: Fail gracefully if contract not in current network.
    if (!poeContractAddress) return;

    setIsLoadingSubmit(true);

    // @TODO: Restore timeout w/a failed message.
    // setTimeout(() => {
    //   setIsLoadingSubmit(false);
    // }, 30000);

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
    // @TODO: Ensure event is found upon submission
    // const filter = contract.filters.Witnessed();
    // const events = await contract.queryFilter(filter, +(blocknumber) - 32, 'latest');
    // const [event] = events;
    // const { blockHash: bh } = event;

    setIsLoadingSubmit(false);
    // @TODO: Ensure event is found upon submission
    //setIsSuccessful(bh === blockhash);
    setIsSuccessful(true);
  };
  return isSuccessful ? (
    <Link href="/dashboard">
      <Button
        rightIcon={<CheckCircleIcon />}
        colorScheme="green"
        variant="outline"
      >
        Success (Go to Dashboard)
      </Button>
    </Link>
  ) : (
    <Button isLoading={isLoadingSubmit} onClick={() => submitSignature()}>
      Submit
    </Button>
  );
};
