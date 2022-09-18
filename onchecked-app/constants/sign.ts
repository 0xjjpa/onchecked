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