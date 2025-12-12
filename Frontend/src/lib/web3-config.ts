import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';

const VITE_APP_NAME = import.meta.env.VITE_APP_NAME || 'Certenize';
const VITE_APP_DESCRIPTION = import.meta.env.VITE_APP_DESCRIPTION || 'Earn immutable blockchain credentials. Complete AI-powered assessments and mint Soulbound Tokens as proof of your knowledge on Ethereum.';

// Thirdweb contract address for Soulbound Tokens (Sepolia testnet)
export const SOULBOUND_CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';

// Thirdweb client ID
export const THIRDWEB_CLIENT_ID = import.meta.env.VITE_THIRDWEB_CLIENT_ID || 'your-thirdweb-client-id';

// RainbowKit config
export const wagmiConfig = getDefaultConfig({
  appName: 'Certenize',
  projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || `${VITE_APP_NAME}-education-platform`,
  chains: [sepolia],
  ssr: false,
});

export const supportedChains = [sepolia];
