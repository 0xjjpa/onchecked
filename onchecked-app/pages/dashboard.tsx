import { ConnectButton } from "@rainbow-me/rainbowkit";
import { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useAccount } from "wagmi";
import { Link } from "../components/Link";
import { NavMenu } from "../components/NavMenu";
import { ProofsTable } from "../components/ProofsTable";
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
        <NavMenu />

        <h1 className={styles.title}>Dashboard</h1>

        <Image
          src="/images/onchecked-scan.png"
          width="264px"
          height="283px"
          alt="Two individuals looking at their phones"
        />

        <p className={styles.description}>
          See all proof-of-presence successful proofs.
        </p>

        <ProofsTable />
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

export default Scan;
