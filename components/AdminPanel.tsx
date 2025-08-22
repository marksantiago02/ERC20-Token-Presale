import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAccount, useReadContract, useWriteContract, useChainId } from 'wagmi';
import HMESHPresaleABI from '../abi/HMESHPresale.json';
import { getContractAddress } from '../utils/constants';
import { 
  Shield, 
  Play, 
  Pause, 
  Plus, 
  Square, 
  DollarSign, 
  RefreshCw, 
  UserCheck,
  BarChart3,
  Users,
  Settings,
  Clock,
  Star,
  TrendingUp,
  UserPlus,
  Eye,
  Loader2
} from 'lucide-react';

const AdminContainer = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 2rem;
  margin: 2rem 0;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  color: white;
`;

const AdminHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  
  h2 {
    font-size: 2.5rem;
    margin: 0;
    background: linear-gradient(45deg, #fff, #f0f0f0);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  p {
    font-size: 1.1rem;
    opacity: 0.9;
    margin: 0.5rem 0;
  }
`;

const AdminGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const AdminCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  }
  
  h3 {
    margin: 0 0 1rem 0;
    font-size: 1.3rem;
    color: #fff;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #fff;
    font-size: 0.9rem;
  }
  
  input, select {
    width: 100%;
    padding: 0.75rem;
    border: none;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.9);
    color: #333;
    font-size: 0.9rem;
    
    &:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
    }
  }
`;

const Button = styled.button<{ variant?: 'primary' | 'danger' | 'success' }>`
  background: ${props => {
    switch (props.variant) {
      case 'danger': return 'linear-gradient(45deg, #ff6b6b, #ee5a52)';
      case 'success': return 'linear-gradient(45deg, #51cf66, #40c057)';
      default: return 'linear-gradient(45deg, #667eea, #764ba2)';
    }
  }};
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const StatusMessage = styled.div<{ type: 'success' | 'error' | 'info' }>`
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  background: ${props => {
    switch (props.type) {
      case 'success': return 'rgba(81, 207, 102, 0.2)';
      case 'error': return 'rgba(255, 107, 107, 0.2)';
      default: return 'rgba(102, 126, 234, 0.2)';
    }
  }};
  border: 1px solid ${props => {
    switch (props.type) {
      case 'success': return 'rgba(81, 207, 102, 0.5)';
      case 'error': return 'rgba(255, 107, 107, 0.5)';
      default: return 'rgba(102, 126, 234, 0.5)';
    }
  }};
  color: #fff;
`;

const TabContainer = styled.div`
  display: flex;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 0.25rem;
  margin-bottom: 2rem;
  overflow-x: auto;
`;

const Tab = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  background: ${props => props.$active ? 'rgba(255, 255, 255, 0.2)' : 'transparent'};
  color: white;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`;

const TabContent = styled.div<{ hidden: boolean }>`
  display: ${props => props.hidden ? 'none' : 'block'};
`;

const PromoterCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  }
  
  .promoter-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    
    .promoter-address {
      font-family: 'monospace';
      font-size: 0.9rem;
      color: #fff;
      background: rgba(255, 255, 255, 0.1);
      padding: 0.5rem;
      border-radius: 8px;
    }
    
    .promoter-status {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
      
      &.active {
        background: rgba(81, 207, 102, 0.2);
        color: #51cf66;
        border: 1px solid rgba(81, 207, 102, 0.4);
      }
      
      &.inactive {
        background: rgba(255, 107, 107, 0.2);
        color: #ff6b6b;
        border: 1px solid rgba(255, 107, 107, 0.4);
      }
    }
  }
  
  .promoter-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 1rem;
    margin-bottom: 1rem;
    
    .stat-item {
      text-align: center;
      padding: 0.75rem;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      
      .stat-value {
        font-size: 1.2rem;
        font-weight: bold;
        color: #fff;
        margin-bottom: 0.25rem;
      }
      
      .stat-label {
        font-size: 0.75rem;
        opacity: 0.8;
        color: #fff;
      }
    }
  }
  
  .promoter-followers {
    margin-top: 1rem;
    
    .followers-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
      
      h4 {
        margin: 0;
        color: #fff;
        font-size: 1rem;
      }
    }
    
    .followers-list {
      max-height: 200px;
      overflow-y: auto;
      
      .follower-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem;
        margin: 0.25rem 0;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 6px;
        font-size: 0.85rem;
        
        .follower-address {
          font-family: 'monospace';
          color: #fff;
        }
        
        .follower-amount {
          color: #51cf66;
          font-weight: 600;
        }
      }
    }
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
  }
`;

const AdminPanel: React.FC = () => {
  const { address } = useAccount();
  const chainId = useChainId();
  const [activeTab, setActiveTab] = useState<'overview' | 'rounds' | 'users' | 'promoters' | 'settings'>('overview');
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  
  // Promoter-related states
  const [promoterSearch, setPromoterSearch] = useState('');
  const [selectedPromoter, setSelectedPromoter] = useState<string | null>(null);
  const [promoterFollowers, setPromoterFollowers] = useState<any[]>([]);
  const [promoterStats, setPromoterStats] = useState<any>(null);
  
  // Form states for create round
  const [roundForm, setRoundForm] = useState({
    roundId: '',
    tokenPrice: '',
    tokenAmount: '',
    startTime: '',
    endTime: '',
    cliffDuration: '',
    vestingDuration: '',
    vestingTimeUnit: '',
    releasePercentageAfterCliff: '',
    userBonusPercentage: '',
    promoterRewardPercentage: '',
    releasePercentages: [''] // Array for monthly release percentages
  });

  // Form states for other admin functions
  const [endRoundForm, setEndRoundForm] = useState({ roundId: '' });
  const [extendRoundForm, setExtendRoundForm] = useState({ roundId: '', newEndTime: '' });
  const [withdrawForm, setWithdrawForm] = useState({ roundId: '' });
  const [refundForm, setRefundForm] = useState({ roundId: '' });
  const [refundBatchForm, setRefundBatchForm] = useState({ roundId: '', batchSize: '' });
  const [transferOwnershipForm, setTransferOwnershipForm] = useState({ newOwner: '' });
  const [slippageForm, setSlippageForm] = useState({ slippage: '' });
  const [walletForm, setWalletForm] = useState({ wallet: '' });
  const [promoterForm, setPromoterForm] = useState({ promoterAddress: '' });
  const [promoCodeStatusForm, setPromoCodeStatusForm] = useState({ promoterAddress: '', isActive: true });
  const [userPurchaseForm, setUserPurchaseForm] = useState({ userAddress: '', roundId: '' });
  const [justRegisteredAddress, setJustRegisteredAddress] = useState<string | null>(null);
  
  // Get contract address for current chain
  const presaleAddress = getContractAddress(chainId, 'HMESH_PRESALE');
  
  // Contract reads
  const { data: owner } = useReadContract({
    address: presaleAddress as `0x${string}`,
    abi: HMESHPresaleABI,
    functionName: 'getOwner',
  });
  
  const { data: isPaused } = useReadContract({
    address: presaleAddress as `0x${string}`,
    abi: HMESHPresaleABI,
    functionName: 'paused',
  });
  
  const { data: totalRounds } = useReadContract({
    address: presaleAddress as `0x${string}`,
    abi: HMESHPresaleABI,
    functionName: 'totalRounds',
  });

  // Fetch stats (including promo code) for a newly registered promoter
  const { data: justRegisteredStats, refetch: refetchJustRegisteredStats, isLoading: isLoadingJustRegisteredStats } = useReadContract({
    address: presaleAddress as `0x${string}`,
    abi: HMESHPresaleABI,
    functionName: 'getPromoterStats',
    args: [justRegisteredAddress as `0x${string}`],
    query: {
      enabled: !!presaleAddress && !!justRegisteredAddress && presaleAddress !== '0x0000000000000000000000000000000000000000',
    },
  });

  // Read a user's round purchase details
  const { data: userPurchaseData, isLoading: isLoadingUserPurchase, refetch: refetchUserPurchase } = useReadContract({
    address: presaleAddress as `0x${string}`,
    abi: HMESHPresaleABI,
    functionName: 'getUserRoundPurchase',
    args: [userPurchaseForm.userAddress as `0x${string}`, userPurchaseForm.roundId ? parseInt(userPurchaseForm.roundId) : 0],
    query: {
      enabled: false,
    },
  });
  const userPurchaseJson = userPurchaseData ? JSON.stringify(userPurchaseData as any, null, 2) : null;

  // Get all promoters
  const { data: promoters, isLoading: isLoadingPromoters, refetch: refetchPromoters } = useReadContract({
    address: presaleAddress as `0x${string}`,
    abi: HMESHPresaleABI,
    functionName: 'getPromoters',
    query: {
      enabled: !!presaleAddress && presaleAddress !== '0x0000000000000000000000000000000000000000',
    },
  });

  // Get promoter followers for selected promoter
  const { data: followersData, isLoading: isLoadingFollowers } = useReadContract({
    address: presaleAddress as `0x${string}`,
    abi: HMESHPresaleABI,
    functionName: 'getPromoterFollowers',
    args: [selectedPromoter as `0x${string}`],
    query: {
      enabled: !!presaleAddress && presaleAddress !== '0x0000000000000000000000000000000000000000' && !!selectedPromoter,
    },
  });

  // Get promoter stats for selected promoter
  const { data: statsData, isLoading: isLoadingStats } = useReadContract({
    address: presaleAddress as `0x${string}`,
    abi: HMESHPresaleABI,
    functionName: 'getPromoterStats',
    args: [selectedPromoter as `0x${string}`],
    query: {
      enabled: !!presaleAddress && presaleAddress !== '0x0000000000000000000000000000000000000000' && !!selectedPromoter,
    },
  });

  // Get promoter potential rewards for selected promoter
  const { data: potentialRewardsData, isLoading: isLoadingPotentialRewards } = useReadContract({
    address: presaleAddress as `0x${string}`,
    abi: HMESHPresaleABI,
    functionName: 'getPromoterPotentialRewards',
    args: [selectedPromoter as `0x${string}`],
    query: {
      enabled: !!presaleAddress && presaleAddress !== '0x0000000000000000000000000000000000000000' && !!selectedPromoter,
    },
  });

  // Get promoter total potential rewards for selected promoter
  const { data: totalPotentialRewardsData, isLoading: isLoadingTotalPotentialRewards } = useReadContract({
    address: presaleAddress as `0x${string}`,
    abi: HMESHPresaleABI,
    functionName: 'getPromoterTotalPotentialRewards',
    args: [selectedPromoter as `0x${string}`],
    query: {
      enabled: !!presaleAddress && presaleAddress !== '0x0000000000000000000000000000000000000000' && !!selectedPromoter,
    },
  });

  // Get user promo code for selected promoter
  const { data: userPromoCodeData, isLoading: isLoadingUserPromoCode } = useReadContract({
    address: presaleAddress as `0x${string}`,
    abi: HMESHPresaleABI,
    functionName: 'getUserPromoCode',
    args: [selectedPromoter as `0x${string}`],
    query: {
      enabled: !!presaleAddress && presaleAddress !== '0x0000000000000000000000000000000000000000' && !!selectedPromoter,
    },
  });

  // Update promoter data when selection changes
  useEffect(() => {
    if (followersData) {
      setPromoterFollowers(Array.isArray(followersData) ? followersData : []);
    }
  }, [followersData]);

  useEffect(() => {
    if (statsData) {
      setPromoterStats(statsData);
    }
  }, [statsData]);

  // Filter promoters based on search
  const filteredPromoters = promoters && Array.isArray(promoters) 
    ? promoters.filter((promoter: string) => 
        promoter.toLowerCase().includes(promoterSearch.toLowerCase())
      )
    : [];
  
  // Contract writes
  const { writeContract: pauseContract, isPending: pauseLoading } = useWriteContract();
  const { writeContract: unpauseContract, isPending: unpauseLoading } = useWriteContract();
  const { writeContract: createRoundContract, isPending: createRoundLoading } = useWriteContract();
  const { writeContract: endRoundContract, isPending: endRoundLoading } = useWriteContract();
  const { writeContract: extendRoundContract, isPending: extendRoundLoading } = useWriteContract();
  const { writeContract: withdrawContract, isPending: withdrawLoading } = useWriteContract();
  const { writeContract: refundContract, isPending: refundLoading } = useWriteContract();
  const { writeContract: refundBatchContract, isPending: refundBatchLoading } = useWriteContract();
  const { writeContract: transferOwnershipContract, isPending: transferLoading } = useWriteContract();
  const { writeContract: setSlippageContract, isPending: setSlippageLoading } = useWriteContract();
  const { writeContract: setWalletContract, isPending: setWalletLoading } = useWriteContract();
  const { writeContract: registerPromoterContract, isPending: registerPromoterLoading } = useWriteContract();
  const { writeContract: setPromoCodeStatusContract, isPending: setPromoCodeStatusLoading } = useWriteContract();
  
  // Check if current user is owner
  const isOwner = address && owner && typeof owner === 'string' && address.toLowerCase() === owner.toLowerCase();
  
  if (!isOwner) {
    return null;
  }
  
  const handlePause = () => {
    if (!presaleAddress || presaleAddress === '0x0000000000000000000000000000000000000000') {
      setStatus({ type: 'error', message: 'Contract address not configured for this network' });
      return;
    }
    
    pauseContract({
      address: presaleAddress as `0x${string}`,
      abi: HMESHPresaleABI,
      functionName: 'pause',
    });
    setStatus({ type: 'info', message: 'Pausing contract...' });
  };
  
  const handleUnpause = () => {
    if (!presaleAddress || presaleAddress === '0x0000000000000000000000000000000000000000') {
      setStatus({ type: 'error', message: 'Contract address not configured for this network' });
      return;
    }
    
    unpauseContract({
      address: presaleAddress as `0x${string}`,
      abi: HMESHPresaleABI,
      functionName: 'unpause',
    });
    setStatus({ type: 'info', message: 'Unpausing contract...' });
  };
  
  const handleCreateRound = () => {
    if (!presaleAddress || presaleAddress === '0x0000000000000000000000000000000000000000') {
      setStatus({ type: 'error', message: 'Contract address not configured for this network' });
      return;
    }
    
    // Validate form data
    if (!roundForm.roundId || !roundForm.tokenPrice || !roundForm.tokenAmount || 
        !roundForm.startTime || !roundForm.endTime || !roundForm.cliffDuration || 
        !roundForm.vestingDuration || !roundForm.vestingTimeUnit || 
        !roundForm.releasePercentageAfterCliff || !roundForm.userBonusPercentage || 
        !roundForm.promoterRewardPercentage) {
      setStatus({ type: 'error', message: 'Please fill in all required fields' });
      return;
    }
    
    // Convert form data to proper types
    const roundId = parseInt(roundForm.roundId);
    const tokenPrice = BigInt(Math.floor(parseFloat(roundForm.tokenPrice) * 1e18));
    const tokenAmount = BigInt(Math.floor(parseFloat(roundForm.tokenAmount) * 1e18));
    const startTime = BigInt(Math.floor(new Date(roundForm.startTime).getTime() / 1000));
    const endTime = BigInt(Math.floor(new Date(roundForm.endTime).getTime() / 1000));
    const cliffDuration = BigInt(parseInt(roundForm.cliffDuration));
    const vestingDuration = BigInt(parseInt(roundForm.vestingDuration));
    const vestingTimeUnit = BigInt(parseInt(roundForm.vestingTimeUnit));
    const releasePercentageAfterCliff = parseInt(roundForm.releasePercentageAfterCliff);
    const userBonusPercentage = parseInt(roundForm.userBonusPercentage);
    const promoterRewardPercentage = parseInt(roundForm.promoterRewardPercentage);
    
    // Convert release percentages array
    const releasePercentages = roundForm.releasePercentages
      .filter(p => p.trim() !== '')
      .map(p => parseInt(p));
    
    createRoundContract({
      address: presaleAddress as `0x${string}`,
      abi: HMESHPresaleABI,
      functionName: 'createRound',
      args: [
        roundId,
        tokenPrice,
        tokenAmount,
        startTime,
        endTime,
        cliffDuration,
        vestingDuration,
        vestingTimeUnit,
        releasePercentageAfterCliff,
        releasePercentages,
        userBonusPercentage,
        promoterRewardPercentage
      ],
    });
    setStatus({ type: 'info', message: 'Creating round...' });
  };
  
  const addReleasePercentage = () => {
    setRoundForm(prev => ({
      ...prev,
      releasePercentages: [...prev.releasePercentages, '']
    }));
  };
  
  const updateReleasePercentage = (index: number, value: string) => {
    setRoundForm(prev => ({
      ...prev,
      releasePercentages: prev.releasePercentages.map((p, i) => i === index ? value : p)
    }));
  };
  
  const removeReleasePercentage = (index: number) => {
    setRoundForm(prev => ({
      ...prev,
      releasePercentages: prev.releasePercentages.filter((_, i) => i !== index)
    }));
  };

  // Handler functions for other admin operations
  const handleEndRound = () => {
    if (!presaleAddress || presaleAddress === '0x0000000000000000000000000000000000000000') {
      setStatus({ type: 'error', message: 'Contract address not configured for this network' });
      return;
    }
    
    if (!endRoundForm.roundId) {
      setStatus({ type: 'error', message: 'Please enter a round ID' });
      return;
    }
    
    endRoundContract({
      address: presaleAddress as `0x${string}`,
      abi: HMESHPresaleABI,
      functionName: 'endRound',
      args: [parseInt(endRoundForm.roundId)],
    });
    setStatus({ type: 'info', message: 'Ending round...' });
  };

  const handleExtendRound = () => {
    if (!presaleAddress || presaleAddress === '0x0000000000000000000000000000000000000000') {
      setStatus({ type: 'error', message: 'Contract address not configured for this network' });
      return;
    }
    
    if (!extendRoundForm.roundId || !extendRoundForm.newEndTime) {
      setStatus({ type: 'error', message: 'Please fill in all fields' });
      return;
    }
    
    const newEndTime = BigInt(Math.floor(new Date(extendRoundForm.newEndTime).getTime() / 1000));
    
    extendRoundContract({
      address: presaleAddress as `0x${string}`,
      abi: HMESHPresaleABI,
      functionName: 'extendRound',
      args: [parseInt(extendRoundForm.roundId), newEndTime],
    });
    setStatus({ type: 'info', message: 'Extending round...' });
  };

  const handleWithdraw = () => {
    if (!presaleAddress || presaleAddress === '0x0000000000000000000000000000000000000000') {
      setStatus({ type: 'error', message: 'Contract address not configured for this network' });
      return;
    }
    
    if (!withdrawForm.roundId) {
      setStatus({ type: 'error', message: 'Please enter a round ID' });
      return;
    }
    
    withdrawContract({
      address: presaleAddress as `0x${string}`,
      abi: HMESHPresaleABI,
      functionName: 'withdraw',
      args: [parseInt(withdrawForm.roundId)],
    });
    setStatus({ type: 'info', message: 'Withdrawing funds...' });
  };

  const handleRefundUnsoldTokens = () => {
    if (!presaleAddress || presaleAddress === '0x0000000000000000000000000000000000000000') {
      setStatus({ type: 'error', message: 'Contract address not configured for this network' });
      return;
    }
    
    if (!refundForm.roundId) {
      setStatus({ type: 'error', message: 'Please enter a round ID' });
      return;
    }
    
    refundContract({
      address: presaleAddress as `0x${string}`,
      abi: HMESHPresaleABI,
      functionName: 'refundUnsoldToken',
      args: [parseInt(refundForm.roundId)],
    });
    setStatus({ type: 'info', message: 'Refunding unsold tokens...' });
  };

  const handleRefundBatch = () => {
    if (!presaleAddress || presaleAddress === '0x0000000000000000000000000000000000000000') {
      setStatus({ type: 'error', message: 'Contract address not configured for this network' });
      return;
    }
    
    if (!refundBatchForm.roundId || !refundBatchForm.batchSize) {
      setStatus({ type: 'error', message: 'Please fill in all fields' });
      return;
    }
    
    refundBatchContract({
      address: presaleAddress as `0x${string}`,
      abi: HMESHPresaleABI,
      functionName: 'refundBatch',
      args: [parseInt(refundBatchForm.roundId), parseInt(refundBatchForm.batchSize)],
    });
    setStatus({ type: 'info', message: 'Processing refund batch...' });
  };

  const handleTransferOwnership = () => {
    if (!presaleAddress || presaleAddress === '0x0000000000000000000000000000000000000000') {
      setStatus({ type: 'error', message: 'Contract address not configured for this network' });
      return;
    }
    
    if (!transferOwnershipForm.newOwner) {
      setStatus({ type: 'error', message: 'Please enter the new owner address' });
      return;
    }
    
    transferOwnershipContract({
      address: presaleAddress as `0x${string}`,
      abi: HMESHPresaleABI,
      functionName: 'transferOwnership',
      args: [transferOwnershipForm.newOwner as `0x${string}`],
    });
    setStatus({ type: 'info', message: 'Transferring ownership...' });
  };

  const handleSetSlippage = () => {
    if (!presaleAddress || presaleAddress === '0x0000000000000000000000000000000000000000') {
      setStatus({ type: 'error', message: 'Contract address not configured for this network' });
      return;
    }
    
    if (!slippageForm.slippage) {
      setStatus({ type: 'error', message: 'Please enter slippage tolerance' });
      return;
    }
    
    setSlippageContract({
      address: presaleAddress as `0x${string}`,
      abi: HMESHPresaleABI,
      functionName: 'setDefaultSlippageTolerance',
      args: [parseInt(slippageForm.slippage)],
    });
    setStatus({ type: 'info', message: 'Setting slippage tolerance...' });
  };

  const handleSetWallet = () => {
    if (!presaleAddress || presaleAddress === '0x0000000000000000000000000000000000000000') {
      setStatus({ type: 'error', message: 'Contract address not configured for this network' });
      return;
    }
    
    if (!walletForm.wallet) {
      setStatus({ type: 'error', message: 'Please enter wallet address' });
      return;
    }
    
    setWalletContract({
      address: presaleAddress as `0x${string}`,
      abi: HMESHPresaleABI,
      functionName: 'setWallet',
      args: [walletForm.wallet as `0x${string}`],
    });
    setStatus({ type: 'info', message: 'Setting wallet address...' });
  };

  const handleRegisterPromoter = () => {
    if (!presaleAddress || presaleAddress === '0x0000000000000000000000000000000000000000') {
      setStatus({ type: 'error', message: 'Contract address not configured for this network' });
      return;
    }
    
    if (!promoterForm.promoterAddress) {
      setStatus({ type: 'error', message: 'Please enter promoter address' });
      return;
    }
    
    registerPromoterContract({
      address: presaleAddress as `0x${string}`,
      abi: HMESHPresaleABI,
      functionName: 'registerPromoter',
      args: [promoterForm.promoterAddress as `0x${string}`],
    });
    setStatus({ type: 'info', message: 'Registering promoter...' });
    setJustRegisteredAddress(promoterForm.promoterAddress as string);
    // Attempt a refresh shortly after to pick up the new promo code
    setTimeout(() => {
      refetchJustRegisteredStats();
    }, 2000);
  };

  const handleSetPromoCodeStatus = () => {
    if (!presaleAddress || presaleAddress === '0x0000000000000000000000000000000000000000') {
      setStatus({ type: 'error', message: 'Contract address not configured for this network' });
      return;
    }
    
    if (!promoCodeStatusForm.promoterAddress) {
      setStatus({ type: 'error', message: 'Please enter promoter address' });
      return;
    }
    
    setPromoCodeStatusContract({
      address: presaleAddress as `0x${string}`,
      abi: HMESHPresaleABI,
      functionName: 'setPromoCodeStatus',
      args: [promoCodeStatusForm.promoterAddress as `0x${string}`, promoCodeStatusForm.isActive],
    });
    setStatus({ type: 'info', message: 'Updating promo code status...' });
  };

  const handleFetchUserPurchase = async () => {
    if (!presaleAddress || presaleAddress === '0x0000000000000000000000000000000000000000') {
      setStatus({ type: 'error', message: 'Contract address not configured for this network' });
      return;
    }
    if (!userPurchaseForm.userAddress || !userPurchaseForm.roundId) {
      setStatus({ type: 'error', message: 'Enter user address and round ID' });
      return;
    }
    setStatus({ type: 'info', message: 'Fetching user purchase...' });
    try {
      await refetchUserPurchase();
      setStatus({ type: 'success', message: 'Fetched user purchase' });
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to fetch user purchase' });
    }
  };
  
  // Handler for viewing promoter details
  const handleViewPromoter = (promoterAddress: string) => {
    setSelectedPromoter(promoterAddress);
  };

  // Handler for refreshing promoter data
  const handleRefreshPromoters = () => {
    refetchPromoters();
    setStatus({ type: 'info', message: 'Refreshing promoter data...' });
  };
  
  return (
    <AdminContainer>
      <AdminHeader>
        <h2>
          <Shield size={32} />
          Admin Panel
        </h2>
        <p>Manage presale rounds and contract settings</p>
      </AdminHeader>
      
      {status && (
        <StatusMessage type={status.type}>
          {status.message}
        </StatusMessage>
      )}
      
      <TabContainer>
        <Tab $active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>
          <BarChart3 size={18} style={{ marginRight: '8px' }} />
          Overview
        </Tab>
        <Tab $active={activeTab === 'rounds'} onClick={() => setActiveTab('rounds')}>
          <Plus size={18} style={{ marginRight: '8px' }} />
          Manage Rounds
        </Tab>
        <Tab $active={activeTab === 'users'} onClick={() => setActiveTab('users')}>
          <Users size={18} style={{ marginRight: '8px' }} />
          Investor management
        </Tab>
        <Tab $active={activeTab === 'promoters'} onClick={() => setActiveTab('promoters')}>
          <Star size={18} style={{ marginRight: '8px' }} />
          Promoter Management
        </Tab>
        <Tab $active={activeTab === 'settings'} onClick={() => setActiveTab('settings')}>
          <Settings size={18} style={{ marginRight: '8px' }} />
          Contract Settings
        </Tab>
      </TabContainer>
      
      {/* Overview Tab */}
      <TabContent hidden={activeTab !== 'overview'}>
        <AdminGrid>
          <AdminCard>
            <h3>
              <Shield size={20} />
              Contract Status
            </h3>
            <p>Current contract state</p>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Status:</strong> {isPaused ? '⏸️ Paused' : '▶️ Active'}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Total Rounds:</strong> {totalRounds ? Number(totalRounds) : 0}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Owner:</strong> {owner ? `${owner.slice(0, 6)}...${owner.slice(-4)}` : 'Loading...'}
            </div>
          </AdminCard>
          
          <AdminCard>
            <h3>
              {Boolean(isPaused) ? <Pause size={20} /> : <Play size={20} />}
              {Boolean(isPaused) ? 'Pause Contract' : 'Unpause Contract'}
            </h3>
            <p>{Boolean(isPaused) ? 'Contract is currently paused' : 'Contract is currently active'}</p>
            <Button 
              variant={Boolean(isPaused) ? 'success' : 'danger'}
              onClick={Boolean(isPaused) ? handleUnpause : handlePause}
              disabled={pauseLoading || unpauseLoading}
            >
              {pauseLoading ? 'Pausing...' : unpauseLoading ? 'Unpausing...' : Boolean(isPaused) ? 'Unpause Contract' : 'Pause Contract'}
            </Button>
          </AdminCard>
        </AdminGrid>
      </TabContent>
      
      {/* Rounds Tab */}
      <TabContent hidden={activeTab !== 'rounds'}>
        <AdminGrid>
          <AdminCard>
            <h3>
              <Plus size={20} />
              Create New Round
            </h3>
            <p>Create a new presale round</p>
            
            <FormGroup>
              <label>Round ID</label>
              <input
                type="number"
                value={roundForm.roundId}
                onChange={(e) => setRoundForm(prev => ({ ...prev, roundId: e.target.value }))}
                placeholder="1"
              />
            </FormGroup>
            
            <FormGroup>
              <label>Token Price (USD)</label>
              <input
                type="number"
                step="0.01"
                value={roundForm.tokenPrice}
                onChange={(e) => setRoundForm(prev => ({ ...prev, tokenPrice: e.target.value }))}
                placeholder="0.15"
              />
            </FormGroup>
            
            <FormGroup>
              <label>Token Amount</label>
              <input
                type="number"
                value={roundForm.tokenAmount}
                onChange={(e) => setRoundForm(prev => ({ ...prev, tokenAmount: e.target.value }))}
                placeholder="1000000"
              />
            </FormGroup>
            
            <FormGroup>
              <label>Start Time</label>
              <input
                type="datetime-local"
                value={roundForm.startTime}
                onChange={(e) => setRoundForm(prev => ({ ...prev, startTime: e.target.value }))}
              />
            </FormGroup>
            
            <FormGroup>
              <label>End Time</label>
              <input
                type="datetime-local"
                value={roundForm.endTime}
                onChange={(e) => setRoundForm(prev => ({ ...prev, endTime: e.target.value }))}
              />
            </FormGroup>
            
            <FormGroup>
              <label>Cliff Duration (seconds)</label>
              <input
                type="number"
                value={roundForm.cliffDuration}
                onChange={(e) => setRoundForm(prev => ({ ...prev, cliffDuration: e.target.value }))}
                placeholder="2592000"
              />
            </FormGroup>
            
            <FormGroup>
              <label>Vesting Duration (seconds)</label>
              <input
                type="number"
                value={roundForm.vestingDuration}
                onChange={(e) => setRoundForm(prev => ({ ...prev, vestingDuration: e.target.value }))}
                placeholder="7776000"
              />
            </FormGroup>
            
            <FormGroup>
              <label>Vesting Time Unit (seconds)</label>
              <input
                type="number"
                value={roundForm.vestingTimeUnit}
                onChange={(e) => setRoundForm(prev => ({ ...prev, vestingTimeUnit: e.target.value }))}
                placeholder="2592000"
              />
            </FormGroup>
            
            <FormGroup>
              <label>Release % After Cliff</label>
              <input
                type="number"
                value={roundForm.releasePercentageAfterCliff}
                onChange={(e) => setRoundForm(prev => ({ ...prev, releasePercentageAfterCliff: e.target.value }))}
                placeholder="20"
              />
            </FormGroup>
            
            <FormGroup>
              <label>User Bonus %</label>
              <input
                type="number"
                value={roundForm.userBonusPercentage}
                onChange={(e) => setRoundForm(prev => ({ ...prev, userBonusPercentage: e.target.value }))}
                placeholder="5"
              />
            </FormGroup>
            
            <FormGroup>
              <label>Promoter Reward %</label>
              <input
                type="number"
                value={roundForm.promoterRewardPercentage}
                onChange={(e) => setRoundForm(prev => ({ ...prev, promoterRewardPercentage: e.target.value }))}
                placeholder="3"
              />
            </FormGroup>
            
            <div style={{ marginBottom: '1rem' }}>
              <label>Monthly Release Percentages</label>
              {roundForm.releasePercentages.map((percentage, index) => (
                <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input
                    type="number"
                    value={percentage}
                    onChange={(e) => updateReleasePercentage(index, e.target.value)}
                    placeholder="10"
                    style={{ flex: 1 }}
                  />
                  <Button 
                    variant="danger" 
                    onClick={() => removeReleasePercentage(index)}
                    style={{ width: 'auto', padding: '0.5rem 1rem' }}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button variant="primary" onClick={addReleasePercentage} style={{ marginTop: '0.5rem' }}>
                Add Percentage
              </Button>
            </div>
            
            <Button 
              variant="primary" 
              onClick={handleCreateRound}
              disabled={createRoundLoading}
            >
              {createRoundLoading ? 'Creating...' : 'Create Round'}
            </Button>
          </AdminCard>
          
          <AdminCard>
            <h3>
              <Square size={20} />
              End Round
            </h3>
            <p>End an active presale round</p>
            <FormGroup>
              <label>Round ID</label>
              <input 
                type="number" 
                placeholder="1"
                value={endRoundForm.roundId}
                onChange={(e) => setEndRoundForm(prev => ({ ...prev, roundId: e.target.value }))}
              />
            </FormGroup>
            <Button 
              variant="danger"
              onClick={handleEndRound}
              disabled={endRoundLoading}
            >
              {endRoundLoading ? 'Ending...' : 'End Round'}
            </Button>
          </AdminCard>

          <AdminCard>
            <h3>
              <Clock size={20} />
              Extend Round
            </h3>
            <p>Extend the duration of a presale round</p>
            <FormGroup>
              <label>Round ID</label>
              <input 
                type="number" 
                placeholder="1"
                value={extendRoundForm.roundId}
                onChange={(e) => setExtendRoundForm(prev => ({ ...prev, roundId: e.target.value }))}
              />
            </FormGroup>
            <FormGroup>
              <label>New End Time</label>
              <input 
                type="datetime-local"
                value={extendRoundForm.newEndTime}
                onChange={(e) => setExtendRoundForm(prev => ({ ...prev, newEndTime: e.target.value }))}
              />
            </FormGroup>
            <Button 
              variant="primary"
              onClick={handleExtendRound}
              disabled={extendRoundLoading}
            >
              {extendRoundLoading ? 'Extending...' : 'Extend Round'}
            </Button>
          </AdminCard>
          
          <AdminCard>
            <h3>
              <DollarSign size={20} />
              Withdraw Funds
            </h3>
            <p>Withdraw funds from a round</p>
            <FormGroup>
              <label>Round ID</label>
              <input 
                type="number" 
                placeholder="1"
                value={withdrawForm.roundId}
                onChange={(e) => setWithdrawForm(prev => ({ ...prev, roundId: e.target.value }))}
              />
            </FormGroup>
            <Button 
              variant="primary"
              onClick={handleWithdraw}
              disabled={withdrawLoading}
            >
              {withdrawLoading ? 'Withdrawing...' : 'Withdraw'}
            </Button>
          </AdminCard>
          
          <AdminCard>
            <h3>
              <RefreshCw size={20} />
              Refund Unsold Tokens
            </h3>
            <p>Refund unsold tokens from a round</p>
            <FormGroup>
              <label>Round ID</label>
              <input 
                type="number" 
                placeholder="1"
                value={refundForm.roundId}
                onChange={(e) => setRefundForm(prev => ({ ...prev, roundId: e.target.value }))}
              />
            </FormGroup>
            <Button 
              variant="danger"
              onClick={handleRefundUnsoldTokens}
              disabled={refundLoading}
            >
              {refundLoading ? 'Refunding...' : 'Refund'}
            </Button>
          </AdminCard>

          <AdminCard>
            <h3>
              <RefreshCw size={20} />
              Refund Batch
            </h3>
            <p>Refund funds in batches</p>
            <FormGroup>
              <label>Round ID</label>
              <input 
                type="number" 
                placeholder="1"
                value={refundBatchForm.roundId}
                onChange={(e) => setRefundBatchForm(prev => ({ ...prev, roundId: e.target.value }))}
              />
            </FormGroup>
            <FormGroup>
              <label>Batch Size</label>
              <input 
                type="number" 
                placeholder="10"
                value={refundBatchForm.batchSize}
                onChange={(e) => setRefundBatchForm(prev => ({ ...prev, batchSize: e.target.value }))}
              />
            </FormGroup>
            <Button 
              variant="danger"
              onClick={handleRefundBatch}
              disabled={refundBatchLoading}
            >
              {refundBatchLoading ? 'Processing...' : 'Process Batch'}
            </Button>
          </AdminCard>
        </AdminGrid>
      </TabContent>
      
      {/* Users Tab */}
      <TabContent hidden={activeTab !== 'users'}>
        <AdminGrid>
          <AdminCard>
            <h3>
              <Users size={20} />
              User Overview
            </h3>
            <p>View and manage user data</p>
            <Button variant="primary">
              View Users
            </Button>
          </AdminCard>

          <AdminCard>
            <h3>
              <Users size={20} />
              User Management
            </h3>
            <p>View a user's round purchase details</p>
            <FormGroup>
              <label>User Address</label>
              <input 
                type="text" 
                placeholder="0x..."
                value={userPurchaseForm.userAddress}
                onChange={(e) => setUserPurchaseForm(prev => ({ ...prev, userAddress: e.target.value }))}
              />
            </FormGroup>
            <FormGroup>
              <label>Round ID</label>
              <input 
                type="number" 
                placeholder="1"
                value={userPurchaseForm.roundId}
                onChange={(e) => setUserPurchaseForm(prev => ({ ...prev, roundId: e.target.value }))}
              />
            </FormGroup>
            <Button 
              variant="primary"
              onClick={handleFetchUserPurchase}
              disabled={isLoadingUserPurchase}
            >
              {isLoadingUserPurchase ? 'Fetching...' : 'View Purchase'}
            </Button>
            {userPurchaseJson ? (
              <div style={{ marginTop: '1rem', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px' }}>
                <div style={{ color: '#fff', fontWeight: 600, marginBottom: '0.5rem' }}>Result</div>
                <pre style={{ whiteSpace: 'pre-wrap', color: '#fff', margin: 0 }}>{userPurchaseJson}</pre>
              </div>
            ) : null}
          </AdminCard>
        </AdminGrid>
      </TabContent>
      
      {/* Promoters Tab */}
      <TabContent hidden={activeTab !== 'promoters'}>
        <AdminGrid>
          <AdminCard>
            <h3>
              <UserCheck size={20} />
              Register Promoter
            </h3>
            <p>Register a new promoter with unique promo code</p>
            <FormGroup>
              <label>Promoter Address</label>
              <input 
                type="text" 
                placeholder="0x..."
                value={promoterForm.promoterAddress}
                onChange={(e) => setPromoterForm(prev => ({ ...prev, promoterAddress: e.target.value }))}
              />
            </FormGroup>
            <Button 
              variant="primary"
              onClick={handleRegisterPromoter}
              disabled={registerPromoterLoading}
            >
              {registerPromoterLoading ? 'Registering...' : 'Register Promoter'}
            </Button>
            {justRegisteredAddress && (
              <div style={{ marginTop: '1rem', background: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '8px' }}>
                <div style={{ color: '#fff', fontWeight: 600, marginBottom: '0.25rem' }}>Promo Code</div>
                <div style={{ color: '#ffc107' }}>
                  {isLoadingJustRegisteredStats ? 'Fetching promo code...' : (justRegisteredStats ? String((justRegisteredStats as any)._promoCode ?? '') : 'No promo code yet')}
                </div>
                <div>
                  <Button 
                    variant="primary" 
                    onClick={() => refetchJustRegisteredStats()} 
                    style={{ width: 'auto', marginTop: '0.5rem', padding: '0.4rem 0.75rem' }}
                  >
                    Refresh
                  </Button>
                </div>
              </div>
            )}
          </AdminCard>

          <AdminCard>
            <h3>
              <UserCheck size={20} />
              Set Promo Code Status
            </h3>
            <p>Activate or deactivate a promoter's promo code</p>
            <FormGroup>
              <label>Promoter Address</label>
              <input 
                type="text" 
                placeholder="0x..."
                value={promoCodeStatusForm.promoterAddress}
                onChange={(e) => setPromoCodeStatusForm(prev => ({ ...prev, promoterAddress: e.target.value }))}
              />
            </FormGroup>
            <FormGroup>
              <label>Status</label>
              <select 
                value={promoCodeStatusForm.isActive ? 'true' : 'false'}
                onChange={(e) => setPromoCodeStatusForm(prev => ({ ...prev, isActive: e.target.value === 'true' }))}
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </FormGroup>
            <Button 
              variant={promoCodeStatusForm.isActive ? 'success' : 'danger'}
              onClick={handleSetPromoCodeStatus}
              disabled={setPromoCodeStatusLoading}
            >
              {setPromoCodeStatusLoading ? 'Updating...' : 'Update Status'}
            </Button>
          </AdminCard>

          <AdminCard>
            <h3>
              <Star size={20} />
              Promoter Overview
            </h3>
            <p>Total promoters: {promoters && Array.isArray(promoters) ? promoters.length : 0}</p>
            <Button variant="primary" onClick={handleRefreshPromoters}>
              <RefreshCw size={16} style={{ marginRight: '8px' }} />
              Refresh Data
            </Button>
          </AdminCard>
          
          <AdminCard>
            <h3>
              <TrendingUp size={20} />
              Total Referrals
            </h3>
            <p>Combined referral count across all promoters</p>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#51cf66', textAlign: 'center', margin: '1rem 0' }}>
              {promoters && Array.isArray(promoters) ? 
                promoters.reduce((total, promoter) => {
                  // This would need to be calculated from individual promoter stats
                  // For now, showing placeholder
                  return total + 0;
                }, 0) : 0
              }
            </div>
          </AdminCard>
          
          <AdminCard>
            <h3>
              <DollarSign size={20} />
              Total Rewards
            </h3>
            <p>Combined potential rewards for all promoters</p>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#51cf66', textAlign: 'center', margin: '1rem 0' }}>
              {promoters && Array.isArray(promoters) ? 
                promoters.reduce((total, promoter) => {
                  // This would need to be calculated from individual promoter stats
                  // For now, showing placeholder
                  return total + 0;
                }, 0) : 0
              } HMESH
            </div>
          </AdminCard>
        </AdminGrid>

        {/* Promoter Search */}
        <div style={{ marginBottom: '2rem' }}>
          <SearchInput
            type="text"
            placeholder="Search promoters by address..."
            value={promoterSearch}
            onChange={(e) => setPromoterSearch(e.target.value)}
          />
        </div>

        {/* Promoters List */}
        {isLoadingPromoters ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '2rem', 
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '1.1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}>
            <Loader2 size={20} className="animate-spin" />
            Loading promoters...
          </div>
        ) : filteredPromoters.length > 0 ? (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {filteredPromoters.map((promoter: string, index: number) => (
              <PromoterCard key={index}>
                <div className="promoter-header">
                  <div className="promoter-address">
                    {promoter.slice(0, 6)}...{promoter.slice(-4)}
                  </div>
                  <div className="promoter-status active">
                    Active
                  </div>
                </div>
                
                <div className="promoter-stats">
                  <div className="stat-item">
                    <div className="stat-value">#{index + 1}</div>
                    <div className="stat-label">Rank</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-value">
                      {promoter === selectedPromoter ? (
                        isLoadingFollowers ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          promoterFollowers.length
                        )
                      ) : (
                        <Eye 
                          size={16} 
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleViewPromoter(promoter)}
                        />
                      )}
                    </div>
                    <div className="stat-label">Followers</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-value">
                      {promoter === selectedPromoter ? (
                        isLoadingStats ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          promoterStats ? Number(promoterStats.totalReferrals || 0) : 0
                        )
                      ) : (
                        <TrendingUp 
                          size={16} 
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleViewPromoter(promoter)}
                        />
                      )}
                    </div>
                    <div className="stat-label">Referrals</div>
                  </div>
                </div>

                {/* Show detailed stats when promoter is selected */}
                {promoter === selectedPromoter && (
                  <>
                                         {promoterStats && (
                       <div style={{ 
                         marginTop: '1rem', 
                         padding: '1rem', 
                         background: 'rgba(255, 255, 255, 0.05)', 
                         borderRadius: '8px',
                         fontSize: '0.85rem'
                       }}>
                         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                           <div>
                             <strong style={{ color: '#fff' }}>Total Referrals:</strong> {Number(promoterStats.totalReferrals || 0)}
                           </div>
                           <div>
                             <strong style={{ color: '#fff' }}>Followers Count:</strong> {promoterFollowers.length}
                           </div>
                           <div>
                             <strong style={{ color: '#fff' }}>Potential Rewards:</strong> {Number(promoterStats.potentialRewards || 0) / 1e18} HMESH
                           </div>
                           <div>
                             <strong style={{ color: '#fff' }}>Total Potential Rewards:</strong> {Number(totalPotentialRewardsData || 0) / 1e18} HMESH
                           </div>
                         </div>
                       </div>
                     )}

                     {/* Promo Code Information */}
                     {Boolean(userPromoCodeData) && (
                       <div style={{ 
                         marginTop: '1rem', 
                         padding: '1rem', 
                         background: 'rgba(255, 193, 7, 0.1)', 
                         borderRadius: '8px',
                         fontSize: '0.85rem',
                         border: '1px solid rgba(255, 193, 7, 0.3)'
                       }}>
                         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                           <div>
                             <strong style={{ color: '#ffc107' }}>Promo Code:</strong> {`${userPromoCodeData ?? ''}`}
                           </div>
                           <div>
                             <strong style={{ color: '#ffc107' }}>Status:</strong> 
                             <span style={{ 
                               color: '#51cf66', 
                               marginLeft: '0.5rem',
                               padding: '0.25rem 0.5rem',
                               background: 'rgba(81, 207, 102, 0.2)',
                               borderRadius: '4px',
                               fontSize: '0.8rem'
                             }}>
                               Active
                             </span>
                           </div>
                         </div>
                       </div>
                     )}

                    {/* Followers List */}
                    {promoterFollowers.length > 0 && (
                      <div className="promoter-followers">
                        <div className="followers-header">
                          <h4>Followers ({promoterFollowers.length})</h4>
                        </div>
                        <div className="followers-list">
                          {promoterFollowers.map((follower: any, followerIndex: number) => (
                            <div key={followerIndex} className="follower-item">
                              <div className="follower-address">
                                {follower.user ? `${follower.user.slice(0, 6)}...${follower.user.slice(-4)}` : 'Unknown'}
                              </div>
                              <div className="follower-amount">
                                {follower.amount ? `${(Number(follower.amount) / 1e18).toFixed(2)} HMESH` : 'N/A'}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

                <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                  <Button 
                    variant="primary" 
                    onClick={() => handleViewPromoter(promoter)}
                    style={{ width: 'auto', padding: '0.5rem 1rem' }}
                  >
                    {promoter === selectedPromoter ? 'Hide Details' : 'View Details'}
                  </Button>
                </div>
              </PromoterCard>
            ))}
          </div>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '2rem', 
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '1.1rem'
          }}>
            {promoterSearch ? 'No promoters found matching your search.' : 'No promoters registered yet.'}
          </div>
        )}
      </TabContent>
      
      {/* Settings Tab */}
      <TabContent hidden={activeTab !== 'settings'}>
        <AdminGrid>
          <AdminCard>
            <h3>
              <UserCheck size={20} />
              Transfer Ownership
            </h3>
            <p>Transfer contract ownership to a new address</p>
            <FormGroup>
              <label>New Owner Address</label>
              <input 
                type="text" 
                placeholder="0x..."
                value={transferOwnershipForm.newOwner}
                onChange={(e) => setTransferOwnershipForm(prev => ({ ...prev, newOwner: e.target.value }))}
              />
            </FormGroup>
            <Button 
              variant="danger"
              onClick={handleTransferOwnership}
              disabled={transferLoading}
            >
              {transferLoading ? 'Transferring...' : 'Transfer Ownership'}
            </Button>
          </AdminCard>

          <AdminCard>
            <h3>
              <Settings size={20} />
              Set Slippage Tolerance
            </h3>
            <p>Set default slippage tolerance (basis points)</p>
            <FormGroup>
              <label>Slippage (basis points)</label>
              <input 
                type="number" 
                placeholder="300"
                value={slippageForm.slippage}
                onChange={(e) => setSlippageForm(prev => ({ ...prev, slippage: e.target.value }))}
              />
            </FormGroup>
            <Button 
              variant="primary"
              onClick={handleSetSlippage}
              disabled={setSlippageLoading}
            >
              {setSlippageLoading ? 'Setting...' : 'Set Slippage'}
            </Button>
          </AdminCard>

          <AdminCard>
            <h3>
              <DollarSign size={20} />
              Set Withdrawal Wallet
            </h3>
            <p>Set the wallet address for withdrawing funds</p>
            <FormGroup>
              <label>Wallet Address</label>
              <input 
                type="text" 
                placeholder="0x..."
                value={walletForm.wallet}
                onChange={(e) => setWalletForm(prev => ({ ...prev, wallet: e.target.value }))}
              />
            </FormGroup>
            <Button 
              variant="primary"
              onClick={handleSetWallet}
              disabled={setWalletLoading}
            >
              {setWalletLoading ? 'Setting...' : 'Set Wallet'}
            </Button>
          </AdminCard>
        </AdminGrid>
      </TabContent>
    </AdminContainer>
  );
};

export default AdminPanel;
