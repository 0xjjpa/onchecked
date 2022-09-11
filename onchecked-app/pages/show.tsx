import { Button } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useAccount } from "wagmi";
import { Block, SignBlock } from "../components/SignBlock";
import styles from "../styles/Home.module.css";

const Show: NextPage = () => {
  const { address, isConnected } = useAccount();
  return (
    <div className={styles.container}>
      <Head>
        <title>Onchecked</title>
        <meta
          name="description"
          content="Proof-of-Existence between two Ethereum wallets"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <ConnectButton />

        <h1 className={styles.title}>Onchecked</h1>

        <Image
          src="/images/onchecked-show-qr.png"
          width="264px"
          height="283px"
          alt="Two individuals looking at their phones"
        />

        <p className={styles.description}>
          <b>Sign and show</b> <br />
          We’ll grab the latest blockhash from the current network and prompt
          you to sign it with your wallet.
        </p>

        <p className={styles.block}>
          <SignBlock />
        </p>
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
