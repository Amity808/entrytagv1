import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { bscTestnet, sepolia, zetachainAthensTestnet } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "ZetaTickets NFT Platform",
  projectId: "ZETA_TICKETS_PROJECT",
  chains: [zetachainAthensTestnet, sepolia, bscTestnet], // Put ZetaChain first as primary
  ssr: true, // Enable SSR support
});