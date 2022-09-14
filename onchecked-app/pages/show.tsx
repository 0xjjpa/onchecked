import {
  Button,
  SimpleGrid,
  Box,
  Tag,
  TagLabel,
  TagRightIcon,
} from "@chakra-ui/react";
import { CheckIcon, InfoOutlineIcon } from "@chakra-ui/icons";
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

const Show: NextPage = () => {
  const { isConnected } = useAccount();
  const router = useRouter();
  const {
    signature: maybeSignature,
    blockhash: maybeBlockhash,
    blocknumber: maybeBlocknumber,
  } = router?.query;
  const [cosignature, setCosignature] = useState("0x0");

  const [signature, setSignature] = useState("0x0");
  const [blockhash, setBlockhash] = useState("");
  const [blocknumber, setBlocknumber] = useState(0);
  const [hasSignature, setHasSignature] = useState(false);
  const [hasBlockhash, setHasBlockhash] = useState(false);
  const [hasBlocknumber, setHasBlocknumber] = useState(false);

  const [qrPayload, setQRpayload] = useState("0x0");
  const [host, setHost] = useState("");
  const [isDisplayingQR, setDisplayingQR] = useState(false);

  const hasMaybeSignature = maybeSignature && maybeSignature.length > 3;
  const COLUMNS_NUMBER_WHEN_QR_DISPLAYED = 1;
  const COLUMNS_NUMBER_WHEN_NO_QR_DISPLAYED = 2;

  useEffect(() => {
    if (window) {
      const host = window.location.href;
      setHost(host);
      console.log("Host", host);
    }
  }, []);

  useEffect(() => {
    maybeBlockhash && setHasBlockhash(maybeBlockhash.length > 0);
  }, [maybeBlockhash]);

  useEffect(() => {
    signature && setHasSignature(signature.length > 3);
  }, [signature]);

  useEffect(() => {
    maybeBlocknumber && setHasBlocknumber(maybeBlocknumber != "0");
  }, [maybeBlocknumber]);

  useEffect(() => {
    console.log("Maybe Signature", maybeSignature);
    console.log("Maybe Blockhash", maybeBlockhash);
    console.log("Maybe Blocknumber", maybeBlocknumber);
  }, [maybeSignature, maybeBlockhash, maybeBlocknumber]);

  useEffect(() => {
    const payload =
      host +
      "?signature=" +
      signature +
      "&blockhash=" +
      blockhash +
      "&blocknumber=" +
      blocknumber;
    setQRpayload(payload);
    console.log("Payload", payload);
  }, [host, signature, blockhash, blocknumber]);

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

        {hasMaybeSignature ? (
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
              top: "25%",
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
              hasMaybeSignature
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
          {hasMaybeSignature ? (
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
          <SimpleGrid mb={5} spacing={2} columns={2}>
            <Tag
              variant="outline"
              colorScheme={hasBlockhash ? "green" : "blue"}
            >
              <TagLabel>Blockhash</TagLabel>
              <TagRightIcon as={hasBlockhash ? CheckIcon : InfoOutlineIcon} />
            </Tag>
            <Tag
              variant="outline"
              colorScheme={hasBlocknumber ? "green" : "blue"}
            >
              <TagLabel>Blocknumber</TagLabel>
              <TagRightIcon as={hasBlocknumber ? CheckIcon : InfoOutlineIcon} />
            </Tag>
          </SimpleGrid>
        )}

        {isConnected && hasSignature ? (
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
              onClick={() => setSignature("")}
            >
              Back
            </Button>
            <Button onClick={() => setDisplayingQR(!isDisplayingQR)}>
              {isDisplayingQR ? "Hide" : "Display"}
            </Button>
          </SimpleGrid>
        ) : (
          <p className={styles.block}>
            <SignBlock
              setSignature={setSignature}
              setBlockhash={setBlockhash}
              setBlocknumber={setBlocknumber}
            />
          </p>
        )}
      </main>

      <footer className={styles.footer}>
        <a
          href="https://twitter.com/0xjjpa"
          target="_blank"
          rel="noopener noreferrer"
        >
          Made with ❤️ by 0xjjpa
        </a>
      </footer>
    </div>
  );
};

export default Show;
