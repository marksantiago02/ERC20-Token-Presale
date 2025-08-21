// Contract Addresses for different networks
export const CONTRACT_ADDRESSES = {
  // Ethereum Mainnet (Chain ID: 1)
  1: {
    HMESH_PRESALE: process.env.NEXT_PUBLIC_PRESALE_CONTRACT_ADDRESS_MAINNET,
    HMESH_TOKEN: process.env.NEXT_PUBLIC_HMESH_TOKEN_ADDRESS_MAINNET,
    USDT: process.env.NEXT_PUBLIC_USDT_MAINNET,
    USDC: process.env.NEXT_PUBLIC_USDC_MAINNET,
    DAI: process.env.NEXT_PUBLIC_DAI_MAINNET,
  },
  // Sepolia Testnet (Chain ID: 11155111)
  11155111: {
    HMESH_PRESALE: process.env.NEXT_PUBLIC_PRESALE_CONTRACT_ADDRESS_SEPOLIA,
    HMESH_TOKEN: process.env.NEXT_PUBLIC_HMESH_TOKEN_ADDRESS_SEPOLIA,
    USDT: process.env.NEXT_PUBLIC_USDT_SEPOLIA,
    USDC: process.env.NEXT_PUBLIC_USDC_SEPOLIA,
    DAI: process.env.NEXT_PUBLIC_DAI_SEPOLIA,
  },
} as const;

// Helper function to get contract address for current chain
export const getContractAddress = (chainId: number | undefined, contractName: keyof typeof CONTRACT_ADDRESSES[1]) => {
  if (!chainId || !CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]) {
    console.warn(`Unsupported chain ID: ${chainId}`);
    return '0x0000000000000000000000000000000000000000';
  }
  
  return CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES][contractName];
};

// Network configurations
export const NETWORK_CONFIG = {
  1: {
    name: 'Ethereum Mainnet',
    explorer: 'https://etherscan.io',
    rpcUrl: process.env.NEXT_PUBLIC_RPC_URL_MAINNET || 'https://eth-mainnet.g.alchemy.com/v2/demo',
  },
  11155111: {
    name: 'Sepolia Testnet',
    explorer: 'https://sepolia.etherscan.io',
    rpcUrl: process.env.NEXT_PUBLIC_RPC_URL_SEPOLIA || 'https://eth-sepolia.g.alchemy.com/v2/demo',
  },
} as const;

// Default contract address fallback (uses environment variable or zero address)
export const DEFAULT_PRESALE_CONTRACT = process.env.NEXT_PUBLIC_PRESALE_CONTRACT_ADDRESS_SEPOLIA;

// Presale configuration
export const PRESALE_CONFIG = {
  supportedTokens: ['USDT', 'USDC', 'DAI'] as const,
  defaultSlippage: 3, // 0.5%
  maxSlippage: 10, // 5%
} as const;