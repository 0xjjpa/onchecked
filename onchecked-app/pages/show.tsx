import { Button, SimpleGrid, Box } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { useAccount } from "wagmi";
import QRCode from "qrcode-svg";

import { SignBlock } from "../components/SignBlock";
import styles from "../styles/Home.module.css";

const Show: NextPage = () => {
  const { isConnected } = useAccount();
  const [signature, setSignature] = useState("0x0");
  const [isDisplayingQR, setDisplayingQR] = useState(false);

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

        <h1
          style={isDisplayingQR ? { visibility: "hidden" } : {}}
          className={styles.title}
        >
          Sign and show
        </h1>

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
                content: String(signature),
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
              signature.length > 0
                ? "/images/onchecked-show-qr.png"
                : "/images/onchecked-show.png"
            }
            width="264px"
            height="283px"
            alt="Two individuals looking at their phones"
          />
        )}

        <Box style={isDisplayingQR ? { visibility: "hidden" } : {}}>
          {signature.length > 0 ? (
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

        {isConnected && signature.length > 0 ? (
          <SimpleGrid columns={isDisplayingQR ? 1 : 2} spacing={5}>
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
            <SignBlock setSignature={setSignature} />
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
