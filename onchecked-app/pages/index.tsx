import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";

import Head from "next/head";
import Image from "next/image";
import { useAccount } from "wagmi";
import { Link } from "../components/Link";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
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
          src="/images/onchecked.png"
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
            <Link href="/sign" className={styles.card}>
              <h2>Sign and show proof &rarr;</h2>
              <p>
                Use your web3 wallet to sign a given blockhash to place yourself
                in a given time.
              </p>
            </Link>

            <Link href="/dashboard" className={styles.card}>
              <h2>Dashboard of proofs &rarr;</h2>
              <p>
                Review existing proofs from individuals that have co-signed
                a payload within 256 blocks.
              </p>
            </Link>
          </div>
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

export default Home;
