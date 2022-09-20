import {
  Button,
  SimpleGrid,
  Box,
  Tag,
  TagLabel,
  TagRightIcon,
  useClipboard,
} from "@chakra-ui/react";
import { CheckIcon, InfoOutlineIcon, NotAllowedIcon } from "@chakra-ui/icons";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { NextPage } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import QRCode from "qrcode-svg";

import { SignBlock } from "../components/SignBlock";
import styles from "../styles/Home.module.css";
import { TagBlock } from "../components/TagBlock";
import { utils } from "ethers";
import { verifySignature } from "../lib/sign";
import { SubmitBlock } from "../components/SubmitBlock";
import { Link } from "../components/Link";

const Show: NextPage = () => {
  const { isConnected, address: currentAddress } = useAccount();
  const router = useRouter();
  const {
    signature: maybeSignature,
    address: maybeAddress,
    blockhash: maybeBlockhash,
    blocknumber: maybeBlocknumber,
  } = router?.query;

  const [signedBlocknumber, setSignedBlocknumber] = useState(0);
  const [signedBlockhash, setSignedBlockhash] = useState("");
  const [signedAddress, setSignedAddress] = useState("");
  const [signedSignature, setSignedSignature] = useState("");
  const [hasBlockhash, setHasBlockhash] = useState(false);
  const [hasBlocknumber, setHasBlocknumber] = useState(false);
  const [hasAddress, setHasAddress] = useState(false);
  const [hasSignedSignature, setHasSignedSignature] = useState(false);

  const [signature, setSignature] = useState("0x0");
  const [blockhash, setBlockhash] = useState("");
  const [blocknumber, setBlocknumber] = useState(0);
  const [address, setAddress] = useState("0x0");

  const [hasSignature, setHasSignature] = useState(false);

  const [cosignature, setCosignature] = useState("0x0");
  const [hasCosignature, setHasCosignature] = useState(false);

  const [qrPayload, setQRpayload] = useState("0x0");
  const [host, setHost] = useState("");
  const [isDisplayingQR, setDisplayingQR] = useState(false);

  const COLUMNS_NUMBER_WHEN_QR_DISPLAYED = 1;
  const COLUMNS_NUMBER_WHEN_NO_QR_DISPLAYED = 2;

  const { hasCopied, onCopy } = useClipboard(qrPayload);

  useEffect(() => {
    if (window) {
      const host = window.location.href;
      setHost(host);
    }
  }, []);

  useEffect(() => {
    cosignature && setHasCosignature(cosignature.length > 3);
  }, [cosignature]);

  useEffect(() => {
    if (maybeBlockhash && utils.isHexString(maybeBlockhash, 32)) {
      const blockhash = maybeBlockhash.toString();
      setSignedBlockhash(blockhash);
      setHasBlockhash(maybeBlockhash.length > 0);
    } else if (maybeBlockhash) {
      setHasBlockhash(maybeBlockhash.length > 0);
    }
  }, [maybeBlockhash]);

  useEffect(() => {
    if (maybeAddress && utils.isAddress(maybeAddress.toString())) {
      const address = maybeAddress.toString();
      setHasAddress(maybeAddress.length > 0);
      setSignedAddress(address);
    } else if (maybeAddress) {
      setHasAddress(maybeAddress.length > 0);
    }
  }, [maybeAddress]);

  useEffect(() => {
    if (
      maybeSignature &&
      maybeAddress &&
      maybeBlockhash &&
      verifySignature({
        signature: maybeSignature.toString(),
        // @TODO: Migrate to EIP-712
        // { blockhash: maybeBlockhash?.toString() }
        message: maybeBlockhash.toString(),
        address: maybeAddress?.toString(),
      })
    ) {
      const signature = maybeSignature.toString();
      const address = maybeAddress.toString();
      setHasSignedSignature(maybeSignature.length > 0);
      setSignedSignature(signature);
      setSignedAddress(address);
    } else if (maybeSignature) {
      setHasSignedSignature(maybeSignature.length > 0);
    }
  }, [maybeSignature, maybeAddress, maybeBlockhash, maybeBlocknumber]);

  useEffect(() => {
    signature && setHasSignature(signature.length > 3);
  }, [signature]);

  useEffect(() => {
    maybeBlocknumber && setHasBlocknumber(maybeBlocknumber != "0");
    if (maybeBlocknumber) {
      const blocknumber = +maybeBlocknumber.toString();
      setSignedBlocknumber(blocknumber);
    }
  }, [maybeBlocknumber]);

  useEffect(() => {
    const payload =
      host +
      "?signature=" +
      signature +
      "&blockhash=" +
      blockhash +
      "&blocknumber=" +
      blocknumber +
      "&address=" +
      address;
    setQRpayload(payload);
  }, [host, signature, blockhash, blocknumber, address]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Onchecked - Sign and show</title>
        <meta
          name="description"
          content="Proof-of-Existence between two Ethereum wallets"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <ConnectButton />

        {hasCosignature ? (
          <h1 className={styles.title}>Submit co-signature</h1>
        ) : hasSignedSignature ? (
          <h1 className={styles.title}>Co-sign payload</h1>
        ) : (
          <h1
            style={isDisplayingQR ? { visibility: "hidden" } : {}}
            className={styles.title}
          >
            Sign and show
          </h1>
        )}

        {isDisplayingQR ? (
          <Box
            style={{
              maxWidth: "50vh",
              width: "50%",
              position: "absolute",
              top: "30%",
            }}
            onClick={() => {}}
            dangerouslySetInnerHTML={{
              __html: new QRCode({
                width: 256,
                height: 256,
                content: String(qrPayload),
                join: true,
                padding: 1,
                container: "svg-viewbox",
                color: "black",
                background: "none",
              }).svg(),
            }}
          />
        ) : (
          <Image
            src={
              hasCosignature
                ? "/images/onchecked-show-submit-signature.png"
                : hasSignedSignature
                ? "/images/onchecked-show-qr-cosign.png"
                : hasSignature
                ? "/images/onchecked-show-qr.png"
                : "/images/onchecked-show.png"
            }
            width="264px"
            height="283px"
            alt="Two individuals looking at their phones"
          />
        )}

        <Box style={isDisplayingQR ? { visibility: "hidden" } : {}}>
          {hasCosignature ? (
            <p className={styles.description}>
              <b>Submit</b> <br />
              We’ll now send your co-signature to our smart contract to record
              the interaction on-chain.
            </p>
          ) : hasSignedSignature ? (
            <p className={styles.description}>
              <b>Co-sign</b> <br />
              We’ll prompt your signature to create on-chain evidence of
              connection between you and the first signer.
            </p>
          ) : hasSignature ? (
            <p className={styles.description}>
              <b>Show</b> <br />
              Display the following QR code to a friend, so they can co-sign the
              payload with their wallet and submit the proof.
            </p>
          ) : (
            <p className={styles.description}>
              <b>Sign</b> <br />
              We’ll grab the latest blockhash from the current network and
              prompt you to sign it with your wallet.
            </p>
          )}
        </Box>

        {!isDisplayingQR && (
          <SimpleGrid mb={5} spacing={2} columns={1} justifyItems="center">
            <Tag
              variant="outline"
              colorScheme={
                hasBlockhash && signedBlockhash
                  ? "green"
                  : hasBlockhash
                  ? "red"
                  : "blue"
              }
            >
              <TagLabel>
                Blockhash{" "}
                {hasBlockhash && signedBlockhash
                  ? "(Valid)"
                  : hasBlockhash
                  ? "(Invalid)"
                  : "(Empty)"}
              </TagLabel>
              <TagRightIcon
                as={
                  hasBlockhash && signedBlockhash
                    ? CheckIcon
                    : hasBlockhash
                    ? NotAllowedIcon
                    : InfoOutlineIcon
                }
              />
            </Tag>
            <TagBlock
              hasBlocknumber={hasBlocknumber}
              signedBlocknumber={signedBlocknumber}
            />
            <Tag
              variant="outline"
              colorScheme={
                hasSignedSignature && signedSignature
                  ? "green"
                  : hasSignedSignature
                  ? "red"
                  : "blue"
              }
            >
              <TagLabel>
                Signature{" "}
                {hasSignedSignature && signedSignature
                  ? "(Valid)"
                  : hasSignedSignature
                  ? "(Invalid)"
                  : "(Empty)"}
              </TagLabel>
              <TagRightIcon
                as={
                  hasSignedSignature && signedSignature
                    ? CheckIcon
                    : hasSignedSignature
                    ? NotAllowedIcon
                    : InfoOutlineIcon
                }
              />
            </Tag>
          </SimpleGrid>
        )}

        {isConnected && hasCosignature ? (
          <SubmitBlock
            blockhash={signedBlockhash}
            blocknumber={signedBlocknumber}
            signature={signedSignature}
            cosignature={cosignature}
            signerAddress={signedAddress}
            cosignerAddress={String(currentAddress)}
          />
        ) : hasSignature ? (
          <SimpleGrid
            columns={
              isDisplayingQR
                ? COLUMNS_NUMBER_WHEN_QR_DISPLAYED
                : COLUMNS_NUMBER_WHEN_NO_QR_DISPLAYED
            }
            spacing={5}
          >
            <Button
              style={isDisplayingQR ? { display: "none" } : {}}
              onClick={onCopy}
            >
              {hasCopied ? "Copied" : "Copy"}
            </Button>
            <Button onClick={() => setDisplayingQR(!isDisplayingQR)}>
              {isDisplayingQR ? "Hide" : "Display"}
            </Button>
          </SimpleGrid>
        ) : (
          <p className={styles.block}>
            <SignBlock
              signedAddress={signedAddress}
              signedSignature={signedSignature}
              setCosignature={setCosignature}
              setSignature={setSignature}
              setBlockhash={setBlockhash}
              setBlocknumber={setBlocknumber}
              setAddress={setAddress}
            />
          </p>
        )}
      </main>

      <footer className={styles.footer}>
        <Link
          href="https://twitter.com/0xjjpa"
          target="_blank"
          rel="noopener noreferrer"
        >
          Made with ❤️ by 0xjjpa
        </Link>
      </footer>
    </div>
  );
};

export default Show;
