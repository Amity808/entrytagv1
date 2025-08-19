import { http, createConfig } from "wagmi"
import { mainnet, sepolia } from "wagmi/chains"
import { coinbaseWallet, injected, walletConnect } from "wagmi/connectors"

// ZetaChain configuration (using sepolia as placeholder for demo)
const zetaChain = {
  id: 7000,
  name: "ZetaChain Mainnet",
  nativeCurrency: {
    decimals: 18,
    name: "ZETA",
    symbol: "ZETA",
  },
  rpcUrls: {
    default: {
      http: ["https://zetachain-evm.blockpi.network/v1/rpc/public"],
    },
  },
  blockExplorers: {
    default: { name: "ZetaScan", url: "https://explorer.zetachain.com" },
  },
} as const

const zetaChainTestnet = {
  id: 7001,
  name: "ZetaChain Athens Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "ZETA",
    symbol: "ZETA",
  },
  rpcUrls: {
    default: {
      http: ["https://zetachain-athens-evm.blockpi.network/v1/rpc/public"],
    },
  },
  blockExplorers: {
    default: { name: "ZetaScan", url: "https://athens.explorer.zetachain.com" },
  },
} as const

export const config = createConfig({
  chains: [zetaChain, zetaChainTestnet, mainnet, sepolia],
  connectors: [
    injected(),
    coinbaseWallet(),
    walletConnect({ projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID || "demo" }),
  ],
  transports: {
    [zetaChain.id]: http(),
    [zetaChainTestnet.id]: http(),
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
})

declare module "wagmi" {
  interface Register {
    config: typeof config
  }
}
