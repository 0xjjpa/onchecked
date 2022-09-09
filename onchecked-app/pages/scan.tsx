import { ConnectButton } from "@rainbow-me/rainbowkit";
import { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useAccount } from "wagmi";
import styles from "../styles/Home.module.css";

const Scan: NextPage = () => {
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
          src="/images/onchecked-scan.png"
          width="264px"
          height="283px"
          alt="Two individuals looking at their phones"
        />

        <p className={styles.description}>
          Generate a proof-of-presence between you and other web3 frend by
          cosigning blocks in a given timeframe.
        </p>

        {isConnected && (
          <div className={styles.grid}>
            <a href="/show" className={styles.card}>
              <h2>Sign and show proof &rarr;</h2>
              <p>
                Use your web3 wallet to sign a given blockhash to place yourself
                in a given time.
              </p>
            </a>

            <a href="/scan" className={styles.card}>
              <h2>Scan and cosign proof &rarr;</h2>
              <p>
                Scan a signed payload and cosign it with your web3 wallet to
                create an attestation.
              </p>
            </a>
          </div>
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

export default Scan;
