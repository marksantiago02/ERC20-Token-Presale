import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, sepolia } from 'wagmi/chains';

// Configure RainbowKit with the new v2 pattern
export const config = getDefaultConfig({
  appName: 'HMESH Presale',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
  chains: [mainnet, sepolia],
  ssr: true, // Enable SSR for Next.js
});