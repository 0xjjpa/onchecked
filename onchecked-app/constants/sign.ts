import { Chain, chain } from "wagmi";

export const ONCHECKED_SIGN_DOMAIN = {
  name: 'Onchecked',
  version: '1',
};

export type ONCHECKED_MESSAGE_TYPE = {
  blockhash: string
};

export const ONCHECKED_SIGN_TYPES = {
  Payload: [
    { name: 'blockhash', type: 'string' }
  ],
};

// @TODO: Setup environment to load this automatically.
export const customLocalhost: Chain = {
  id: 31337,
  name: 'Gitpod Localhost',
  network: 'gitpod',
  rpcUrls: { default: 'https://8545-0xjjpa-onchecked-c4ecpae0bj7.ws-eu64.gitpod.io/' }
}

export const DEFAULT_CHAIN: Chain = chain.polygonMumbai;

export const SUPPORTED_CHAINS = [
  chain.polygon,
  chain.optimism,
  ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true" || true
    ? [chain.polygonMumbai]
    : []),
]

// @TODO: Make this an env rather than hardcoded
export const POE_CONTRACTS = {
  [chain.polygonMumbai.id]: "0x72Ea42755bE336416bAE4E88cb8E6242bF2EB3bf",
  [chain.polygon.id]: "0x8D01EBd66718e33B070519792a60BC9c4d1C1BA0",
  [chain.optimism.id]: "0x4DEB39F5dd9Ec0d8C680233C80ca1647Adb9c59E",
  [customLocalhost.id]: "0x7C4FeBbF95db0f758380cF2FAB5Da864050A928F",
};

export const POE_CONTRACTS_BLOCK = {
  [chain.polygonMumbai.id]: 28163190,
  [chain.optimism.id]: 24738721,
  [chain.polygon.id]: 33453276,
  [customLocalhost.id]: 1
}