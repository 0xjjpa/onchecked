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

export const SUPPORTED_CHAINS = [
  chain.mainnet,
  chain.polygon,
  chain.optimism,
  chain.arbitrum,
  ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true" || true
    ? [chain.polygonMumbai, customLocalhost]
    : []),
]

// @TODO: Make this an env rather than hardcoded
export const POE_CONTRACTS = {
  [chain.polygonMumbai.id]: "0x72Ea42755bE336416bAE4E88cb8E6242bF2EB3bf",
  [customLocalhost.id]: "0x7C4FeBbF95db0f758380cF2FAB5Da864050A928F",
};

export const POE_CONTRACTS_BLOCK = {
  [chain.polygonMumbai.id]: 28163190,
  [customLocalhost.id]: 1
}