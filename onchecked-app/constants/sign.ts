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

export const aurora: Chain = {
  id: 1313161554,
  name: 'Aurora',
  network: 'aurora',
  nativeCurrency: {
    name: 'Aurora',
    symbol: 'AURORA',
    decimals: 18
  },
  rpcUrls: { default: 'https://mainnet.aurora.dev' },
}

export const baseGoerli: Chain = {
  id: 84531,
  name: "Base Goerli",
  network: "basegoerli",
  nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: "https://goerli.base.org",
    public: "https://goerli.base.org",
  },
  blockExplorers: {
    etherscan: {
      name: "Base Goerli Explorer",
      url: "https://goerli.basescan.org"
    },
    default: {
      name: "Base Goerli Explorer",
      url: "https://goerli.basescan.org"
    },
  },
  testnet: true,
};

export const DEFAULT_CHAIN: Chain = chain.polygon;

export const SUPPORTED_CHAINS = [
  chain.polygon,
  chain.optimism,
  { iconUrl: '/icons/base-icon.svg', ...baseGoerli },
  { iconUrl: '/icons/aurora-icon.svg', ...aurora  },
  ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true" || true
    ? [chain.polygonMumbai]
    : []),
]

// @TODO: Make this an env rather than hardcoded
export const POE_CONTRACTS = {
  [chain.polygonMumbai.id]: "0x72Ea42755bE336416bAE4E88cb8E6242bF2EB3bf",
  [chain.polygon.id]: "0x8D01EBd66718e33B070519792a60BC9c4d1C1BA0",
  [chain.optimism.id]: "0x4DEB39F5dd9Ec0d8C680233C80ca1647Adb9c59E",
  [baseGoerli.id]: "0xf8b21a5013d6912957167f353210941c87Acc67f",
  [aurora.id]: "0xeade8f12a1f238a1ed603fe06499631fd2e08ab3",
  [customLocalhost.id]: "0x7C4FeBbF95db0f758380cF2FAB5Da864050A928F",
};

export const POE_CONTRACTS_BLOCK = {
  [chain.polygonMumbai.id]: 28163190,
  [chain.optimism.id]: 24738721,
  [chain.polygon.id]: 33453276,
  [baseGoerli.id]: 3510276,
  [aurora.id]: 74714517,
  [customLocalhost.id]: 1
}