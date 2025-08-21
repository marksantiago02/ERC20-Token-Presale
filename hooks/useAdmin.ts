import { useAccount, useReadContract, useChainId } from 'wagmi';
import HMESHPresaleABI from '../abi/HMESHPresale.json';
import { getContractAddress } from '../utils/constants';

export const useAdmin = () => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  
  // Get contract address for current chain
  const presaleAddress = getContractAddress(chainId, 'HMESH_PRESALE');
  
  // Contract reads
  const { data: owner, isLoading, error } = useReadContract({
    address: presaleAddress as `0x${string}`,
    abi: HMESHPresaleABI,
    functionName: 'getOwner',
    query: {
      enabled: !!presaleAddress && presaleAddress !== '0x0000000000000000000000000000000000000000' && isConnected,
    },
  });
  
  // Check if current user is owner
  const isAdmin = address && owner && typeof owner === 'string' && address.toLowerCase() === owner.toLowerCase();
  
  return {
    isAdmin,
    isLoading,
    error,
    presaleAddress,
    owner: owner as string | undefined,
  };
};

