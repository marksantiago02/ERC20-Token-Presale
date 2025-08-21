import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAccount, useReadContract, useWriteContract, useChainId } from 'wagmi';
import HMESHPresaleABI from '../abi/HMESHPresale.json';
import { getContractAddress, NETWORK_CONFIG } from '../utils/constants';
import { ShoppingCart, Gift, BarChart3, Coins, DollarSign, CreditCard, Zap, Lightbulb, CheckCircle, Rocket, Lock, Loader2, XCircle, Circle, Clock, AlertTriangle, Globe, Gem, Timer, TrendingUp, Users, Star} from 'lucide-react';

// Define the Round struct type based on the ABI
interface RoundInfo {
  tokenPrice: bigint;
  tokenAmount: bigint;
  startTime: bigint;
  endTime: bigint;
  soldAmount: bigint;
  cliffDuration: bigint;
  vestingDuration: bigint;
  vestingTimeUnit: bigint;
  roundId: number;
  releasePercentageAfterCliff: number;
  userBonusPercentage: number;
  promoterRewardPercentage: number;
  releasePercentageInVestingPerMonth: number[];
}

// Define the presale round type for UI
interface PresaleRound {
  id: number;
  name: string;
  status: 'upcoming' | 'active' | 'completed';
  price: string;
  progress: number;
  roundInfo: RoundInfo;
  remainingStartTime: number;
  remainingEndTime: number;
  totalFundsRaised: bigint;
}

// Define claimable token type
interface ClaimableToken {
  period: string;
  date: string;
  amount: string;
  status: 'claimed' | 'available' | 'locked';
  remainingCliffTime?: number;
  remainingVestingTime?: number;
}

// Define user purchase info
interface UserPurchase {
  amount: bigint;
  roundId: number;
}

// Define promoter info
interface PromoterInfo {
  followers: bigint;
  totalReferrals: bigint;
  potentialRewards: bigint;
}

// Countdown Timer Component
const CountdownTimer: React.FC<{ 
  timeLeft: number; 
  label: string; 
  variant?: 'primary' | 'secondary' | 'warning';
  showIcon?: boolean;
}> = ({ timeLeft, label, variant = 'primary', showIcon = true }) => {
  const formatTime = (seconds: number) => {
    if (seconds <= 0) return '00:00:00';
    
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (days > 0) {
      return `${days}d ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'warning':
        return { background: 'rgba(255, 193, 7, 0.2)', border: '1px solid rgba(255, 193, 7, 0.4)' };
      case 'secondary':
        return { background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)' };
      default:
        return { background: 'rgba(76, 175, 80, 0.2)', border: '1px solid rgba(76, 175, 80, 0.4)' };
    }
  };

  return (
    <div style={{
      padding: '0.75rem',
      borderRadius: '12px',
      textAlign: 'center',
      ...getVariantStyles()
    }}>
      <div style={{ 
        fontSize: '1.2rem', 
        fontWeight: 'bold', 
        color: '#fff',
        marginBottom: '0.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem'
      }}>
        {showIcon && <Timer size={18} />}
        {formatTime(timeLeft)}
      </div>
      <div style={{ fontSize: '0.8rem', opacity: 0.8, color: '#fff' }}>
        {label}
      </div>
    </div>
  );
};

const WidgetContainer = styled.div`
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%);
  border-radius: 20px;
  padding: 2rem;
  margin: 2rem 0;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  color: white;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  position: relative;
  overflow: hidden;
`;

const WidgetHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;
  
  h2 {
    font-size: 2rem;
    margin: 0;
    background: linear-gradient(45deg, #fff, #f0f0f0);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  p {
    font-size: 1rem;
    opacity: 0.9;
    margin: 0.5rem 0;
  }
`;

const TabContainer = styled.div`
  display: flex;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 0.25rem;
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;
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
  position: relative;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`;

const ContentContainer = styled.div`
  position: relative;
  z-index: 1;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #fff;
    font-size: 0.9rem;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  }
  
  input, select {
    width: 100%;
    padding: 0.875rem 1rem;
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.95);
    color: #333;
    font-size: 0.9rem;
    font-weight: 500;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-sizing: border-box;
    backdrop-filter: blur(10px);
    min-height: 44px;
    
    &:hover {
      border-color: rgba(255, 255, 255, 0.4);
      transform: translateY(-1px);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }
    
    &:focus {
      outline: none;
      border-color: rgba(255, 255, 255, 0.8);
      box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    }
    
    &::placeholder {
      color: rgba(0, 0, 0, 0.5);
      font-style: italic;
    }
  }
`;

const PaymentOptions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin: 0.75rem 0;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  width: 100%;
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 2px;
  }
`;

const PaymentOption = styled.div<{ selected: boolean }>`
  position: relative;
  padding: 0.5rem 0.6rem;
  border: 2px solid ${props => props.selected 
    ? 'rgba(255, 255, 255, 0.8)' 
    : 'rgba(255, 255, 255, 0.15)'
  };
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.selected 
    ? 'rgba(255, 255, 255, 0.2)' 
    : 'rgba(255, 255, 255, 0.1)'
  };
  backdrop-filter: blur(10px);
  white-space: nowrap;
  flex: 1;
  min-width: 0;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.4);
  }
  
  .token-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 20px;
    height: 20px;
    margin: 0 auto 0.2rem;
    color: ${props => props.selected ? '#fff' : 'rgba(255, 255, 255, 0.9)'};
    font-size: 0.9rem;
  }
  
  .token-name {
    font-weight: 600;
    color: #fff;
    font-size: 0.75rem;
    margin: 0;
  }
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  background: ${props => props.variant === 'secondary' 
    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))' 
    : 'linear-gradient(135deg, #ff6b6b, #ee5a52)'
  };
  color: white;
  border: ${props => props.variant === 'secondary' ? '2px solid rgba(255, 255, 255, 0.3)' : 'none'};
  padding: 0.75rem 1.25rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
  position: relative;
  overflow: hidden;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  min-height: 44px;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.6s ease;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  
  /* Add a subtle glow effect for primary buttons */
  ${props => props.variant !== 'secondary' && `
    box-shadow: 0 0 15px rgba(255, 107, 107, 0.2);
    
    &:hover {
      box-shadow: 0 0 20px rgba(255, 107, 107, 0.3);
    }
  `}
`;

const InfoCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1rem;
  margin: 1rem 0;
  
  .info-value {
    font-size: 1.5rem;
    font-weight: bold;
    color: #fff;
    margin-bottom: 0.25rem;
  }
  
  .info-label {
    font-size: 0.8rem;
    opacity: 0.8;
    color: #fff;
  }
`;

const ClaimableItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  margin: 0.5rem 0;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  
  .claim-info {
    .claim-period {
      font-weight: 600;
      color: #fff;
      font-size: 0.9rem;
    }
    .claim-date {
      font-size: 0.7rem;
      opacity: 0.8;
    }
  }
  
  .claim-amount {
    font-weight: bold;
    color: #fff;
  }
`;

const RoundDetailsCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  margin: 1rem 0;
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  .round-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    
    .round-title {
      font-size: 1.3rem;
      font-weight: bold;
      color: #fff;
    }
    
    .round-status {
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
      
      &.upcoming {
        background: rgba(255, 193, 7, 0.2);
        color: #ffc107;
        border: 1px solid rgba(255, 193, 7, 0.4);
      }
      
      &.active {
        background: rgba(76, 175, 80, 0.2);
        color: #4caf50;
        border: 1px solid rgba(76, 175, 80, 0.4);
      }
      
      &.completed {
        background: rgba(158, 158, 158, 0.2);
        color: #9e9e9e;
        border: 1px solid rgba(158, 158, 158, 0.4);
      }
    }
  }
  
  .round-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
    margin-bottom: 1rem;
    
    .stat-item {
      text-align: center;
      padding: 0.75rem;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      
      .stat-value {
        font-size: 1.1rem;
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
  
  .countdown-section {
    margin-top: 1rem;
    
    .countdown-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }
  }
`;

const PresaleWidget: React.FC = () => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [activeTab, setActiveTab] = useState<'buy' | 'claim' | 'rounds'>('buy');
  const [selectedToken, setSelectedToken] = useState('USDT');
  const [amount, setAmount] = useState('');
  const [roundId, setRoundId] = useState(1);
  const [promoCode, setPromoCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(Math.floor(Date.now() / 1000));

  // Get contract address for current chain
  const presaleAddress = getContractAddress(chainId, 'HMESH_PRESALE');
  const currentNetwork = NETWORK_CONFIG[chainId as keyof typeof NETWORK_CONFIG];

  // Update current time every second for countdowns
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Contract reads - using correct ABI function names
  const { data: totalRounds, isLoading: isLoadingRounds, error: roundsError } = useReadContract({
    address: presaleAddress as `0x${string}`,
    abi: HMESHPresaleABI,
    functionName: 'totalRounds',
    query: {
      enabled: !!presaleAddress && presaleAddress !== '0x0000000000000000000000000000000000000000',
    },
  });

  // Fetch round details for each round using correct ABI function
  const roundsData = Array.from({ length: Number(totalRounds || 0) }, (_, i) => i + 1).map(roundId => {
    const { data: roundInfo } = useReadContract({
      address: presaleAddress as `0x${string}`,
      abi: HMESHPresaleABI,
      functionName: 'getRound',
      args: [roundId],
      query: {
        enabled: !!presaleAddress && presaleAddress !== '0x0000000000000000000000000000000000000000',
      },
    });

    const { data: totalFundsRaised } = useReadContract({
      address: presaleAddress as `0x${string}`,
      abi: HMESHPresaleABI,
      functionName: 'getTotalFundsRaised',
      args: [roundId],
      query: {
        enabled: !!presaleAddress && presaleAddress !== '0x0000000000000000000000000000000000000000',
      },
    });

    return { roundId, roundInfo, totalFundsRaised };
  });

  // Get user purchase info for current round
  const { data: userPurchase } = useReadContract({
    address: presaleAddress as `0x${string}`,
    abi: HMESHPresaleABI,
    functionName: 'getUserRoundPurchase',
    args: [address, roundId],
    query: {
      enabled: !!presaleAddress && presaleAddress !== '0x0000000000000000000000000000000000000000' && !!address,
    },
  });

  // Type assertion for userPurchase
  const typedUserPurchase = userPurchase as UserPurchase | undefined;

  // Get promoter info if user is a promoter
  const { data: userPromoter } = useReadContract({
    address: presaleAddress as `0x${string}`,
    abi: HMESHPresaleABI,
    functionName: 'getUserPromoter',
    args: [address],
    query: {
      enabled: !!presaleAddress && presaleAddress !== '0x0000000000000000000000000000000000000000' && !!address,
    },
  });

  // Contract writes
  const { writeContract, isPending } = useWriteContract();

  // Get payment tokens from constants based on current network
  const paymentTokens = chainId && NETWORK_CONFIG[chainId as keyof typeof NETWORK_CONFIG] ? [
    { symbol: 'ETH', name: 'Ethereum', icon: <Zap size={20} />, address: null, isNative: true },
    { symbol: 'USDT', name: 'Tether', icon: <DollarSign size={20} />, address: getContractAddress(chainId, 'USDT'), isNative: false },
    { symbol: 'USDC', name: 'USD Coin', icon: <CreditCard size={20} />, address: getContractAddress(chainId, 'USDC'), isNative: false },
    { symbol: 'DAI', name: 'Dai', icon: <Coins size={20} />, address: getContractAddress(chainId, 'DAI'), isNative: false }
  ].filter(token => token.isNative || (token.address && token.address !== '0x0000000000000000000000000000000000000000')) : [];

  // Transform contract data to UI format with proper type checking and countdowns
  const presaleRounds: PresaleRound[] = roundsData
    .filter(item => item.roundInfo)
    .map(item => {
      const round = item.roundInfo as RoundInfo;
      if (!round) return null;
      
      // Calculate countdowns
      const remainingStartTime = Math.max(0, Number(round.startTime) - currentTime);
      const remainingEndTime = Math.max(0, Number(round.endTime) - currentTime);
      
      // Calculate progress percentage
      const progress = round.tokenAmount > 0 
        ? Math.round((Number(round.soldAmount) / Number(round.tokenAmount)) * 100)
        : 0;
      
      // Determine status based on time
      let status: 'upcoming' | 'active' | 'completed' = 'upcoming';
      
      if (currentTime >= Number(round.startTime) && currentTime <= Number(round.endTime)) {
        status = 'active';
      } else if (currentTime > Number(round.endTime)) {
        status = 'completed';
      }
      
      return {
        id: item.roundId,
        name: `Round ${item.roundId}`,
        status,
        price: `$${(Number(round.tokenPrice) / 1e18).toFixed(2)}`,
        progress,
        roundInfo: round,
        remainingStartTime,
        remainingEndTime,
        totalFundsRaised: item.totalFundsRaised || BigInt(0),
      };
    })
    .filter((round): round is NonNullable<typeof round> => round !== null) as PresaleRound[];

  // Calculate claimable tokens with countdowns
  const getClaimableTokens = (): ClaimableToken[] => {
    if (!presaleRounds.length || !typedUserPurchase || !typedUserPurchase.amount) return [];
    
    const round = presaleRounds.find(r => r.id === roundId);
    if (!round) return [];
    
    const roundInfo = round.roundInfo;
    const purchaseAmount = Number(typedUserPurchase.amount);
    if (purchaseAmount <= 0) return [];
    
    const tokens: ClaimableToken[] = [];
    const now = currentTime;
    const roundEndTime = Number(roundInfo.endTime);
    const cliffEndTime = roundEndTime + Number(roundInfo.cliffDuration);
    const vestingEndTime = cliffEndTime + Number(roundInfo.vestingDuration);
    
    // Cliff period
    if (now < cliffEndTime) {
      const remainingCliffTime = cliffEndTime - now;
      tokens.push({
        period: 'Cliff Period',
        date: new Date(cliffEndTime * 1000).toLocaleDateString(),
        amount: '0',
        status: 'locked',
        remainingCliffTime,
      });
    } else {
      // After cliff, show vesting periods
      const releasePercentage = roundInfo.releasePercentageAfterCliff;
      const immediateRelease = (purchaseAmount * releasePercentage) / 100;
      
      if (immediateRelease > 0) {
        tokens.push({
          period: 'Immediate Release',
          date: new Date(cliffEndTime * 1000).toLocaleDateString(),
          amount: immediateRelease.toFixed(2),
          status: 'available',
        });
      }
      
      // Calculate monthly vesting periods
      const monthlyVestingAmount = purchaseAmount - immediateRelease;
      const monthlyPercentage = roundInfo.releasePercentageInVestingPerMonth;
      const timeUnit = Number(roundInfo.vestingTimeUnit);
      
      monthlyPercentage.forEach((percentage, index) => {
        const periodStart = cliffEndTime + (index * timeUnit);
        const periodEnd = periodStart + timeUnit;
        const periodAmount = (monthlyVestingAmount * percentage) / 100;
        
        if (now < periodStart) {
          const remainingTime = periodStart - now;
          tokens.push({
            period: `Month ${index + 1}`,
            date: new Date(periodStart * 1000).toLocaleDateString(),
            amount: periodAmount.toFixed(2),
            status: 'locked',
            remainingVestingTime: remainingTime,
          });
        } else if (now >= periodStart && now < periodEnd) {
          tokens.push({
            period: `Month ${index + 1}`,
            date: new Date(periodStart * 1000).toLocaleDateString(),
            amount: periodAmount.toFixed(2),
            status: 'available',
          });
        }
      });
    }
    
    return tokens;
  };

  const claimableTokens = getClaimableTokens();

  const calculateTokens = (amount: string) => {
    if (!amount || parseFloat(amount) <= 0) return '0';
    
    // Get the current round price if available
    let tokenPrice = 0.15; // Default price
    if (presaleRounds.length > 0) {
      const currentRound = presaleRounds.find(r => r.id === roundId);
      if (currentRound) {
        tokenPrice = parseFloat(currentRound.price.replace('$', ''));
      }
    }
    
    return (parseFloat(amount) / tokenPrice).toFixed(2);
  };

  const handleBuy = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }
    
    if (!presaleAddress || presaleAddress === '0x0000000000000000000000000000000000000000') {
      alert('Contract not deployed on this network');
      return;
    }
    
    setLoading(true);
    
    try {
      // Call the appropriate buy function based on selected token
      switch (selectedToken) {
        case 'ETH':
          // For ETH, we need to send the value with the transaction
          const ethAmountInWei = BigInt(Math.floor(parseFloat(amount) * 1e18)); // ETH has 18 decimals
          // Note: slippageBasisPoints is set to 0 (no slippage protection)
          // In production, you might want to add slippage calculation
          await writeContract({
            address: presaleAddress as `0x${string}`,
            abi: HMESHPresaleABI,
            functionName: 'buyWithETH',
            args: [roundId, 0, promoCode], // roundId, slippageBasisPoints, promoCode
            value: ethAmountInWei, // Send ETH with the transaction
          });
          break;
        case 'USDT':
        case 'USDC':
        case 'DAI':
          // For stablecoins, convert amount to the correct format (assuming 6 decimals)
          const stablecoinAmountInWei = BigInt(Math.floor(parseFloat(amount) * 1e6));
          const functionName = selectedToken === 'USDT' ? 'buyWithUSDT' : 
                              selectedToken === 'USDC' ? 'buyWithUSDC' : 'buyWithDAI';
          
          await writeContract({
            address: presaleAddress as `0x${string}`,
            abi: HMESHPresaleABI,
            functionName,
            args: [stablecoinAmountInWei, roundId, promoCode],
          });
          break;
        default:
          throw new Error('Unsupported payment token');
      }
      
      alert('Buy transaction submitted!');
    } catch (error) {
      console.error('Buy error:', error);
      alert(`Buy failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }
    
    setLoading(true);
    // TODO: Implement actual claim logic using vesting contract
    setTimeout(() => {
      setLoading(false);
      alert('Claim functionality will be implemented with vesting contract');
    }, 1000);
  };

  const renderBuyTab = () => (
    <>
      <FormGroup>
        <label style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          fontSize: '1rem',
          fontWeight: '600',
          color: '#fff',
          marginBottom: '1rem'
        }}>
          <Coins size={18} />
          Select Payment Token
        </label>
        {paymentTokens.length > 0 ? (
          <>
            <PaymentOptions>
              {paymentTokens.map((token) => (
                <PaymentOption
                  key={token.symbol}
                  selected={selectedToken === token.symbol}
                  onClick={() => setSelectedToken(token.symbol)}
                >
                  <div className="token-icon">{token.icon}</div>
                  <div className="token-name">{token.symbol}</div>
                </PaymentOption>
              ))}
            </PaymentOptions>
            {/* {selectedToken === 'ETH' && (
              <div style={{ 
                textAlign: 'center', 
                padding: '1rem', 
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '0.85rem',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05))',
                borderRadius: '12px',
                marginTop: '1rem',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}>
                <Lightbulb size={18} />
                <span>ETH payments are sent directly - no token approval needed</span>
              </div>
            )} */}
          </>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '1rem', 
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '0.9rem',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '8px'
          }}>
            No payment tokens configured for this network.
          </div>
        )}
      </FormGroup>

      <FormGroup>
        <label>Amount ({selectedToken})</label>
        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="0"
          step="0.01"
        />
      </FormGroup>

      <FormGroup>
        <label>Round ID</label>
        <select value={roundId} onChange={(e) => setRoundId(Number(e.target.value))}>
          {presaleRounds.length > 0 ? (
            presaleRounds.map((round) => (
              <option key={round.id} value={round.id}>
                Round {round.id} - {round.name} ({round.price})
              </option>
            ))
          ) : (
            <option value="">No rounds available</option>
          )}
        </select>
      </FormGroup>

      <FormGroup>
        <label>Promo Code (Optional)</label>
        <input
          type="text"
          placeholder="Enter promo code"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
        />
      </FormGroup>

      {amount && parseFloat(amount) > 0 && (
        <InfoCard>
          <div className="info-value">{calculateTokens(amount)} HMESH</div>
          <div className="info-label">You will receive</div>
        </InfoCard>
      )}

      <Button onClick={handleBuy} disabled={loading || !amount || parseFloat(amount) <= 0}>
        {loading ? 'Processing...' : (
          <>
            <Zap size={18} style={{ marginRight: '8px' }} />
            Buy Tokens
          </>
        )}
      </Button>
    </>
  );

  const renderClaimTab = () => (
    <>
      <FormGroup>
        <label>Round ID</label>
        <select value={roundId} onChange={(e) => setRoundId(Number(e.target.value))}>
          {presaleRounds.filter(r => r.status !== 'upcoming').length > 0 ? (
            presaleRounds.filter(r => r.status !== 'upcoming').map((round) => (
              <option key={round.id} value={round.id}>
                Round {round.id} - {round.name}
              </option>
            ))
          ) : (
            <option value="">No completed rounds available</option>
          )}
        </select>
      </FormGroup>

      {typedUserPurchase && typedUserPurchase.amount && Number(typedUserPurchase.amount) > 0 ? (
        <>
          <InfoCard>
            <div className="info-value">{(Number(typedUserPurchase.amount) / 1e18).toFixed(2)} HMESH</div>
            <div className="info-label">Total Purchased in Round {roundId}</div>
          </InfoCard>

          <div>
            <label>Vesting Schedule & Claimable Tokens</label>
            {claimableTokens.length > 0 ? (
              claimableTokens.map((item, index) => (
                <ClaimableItem key={index}>
                  <div className="claim-info">
                    <div className="claim-period">{item.period}</div>
                    <div className="claim-date">{item.date}</div>
                  </div>
                  <div className="claim-amount">
                    {item.amount} HMESH
                    {item.status === 'claimed' && <CheckCircle size={16} style={{ marginLeft: '0.5rem' }} />}
                    {item.status === 'available' && <Rocket size={16} style={{ marginLeft: '0.5rem' }} />}
                    {item.status === 'locked' && <Lock size={16} style={{ marginLeft: '0.5rem' }} />}
                  </div>
                </ClaimableItem>
              ))
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: '1rem', 
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '0.9rem'
              }}>
                No claimable tokens available yet.
              </div>
            )}
          </div>

          {/* Countdown timers for cliff and vesting */}
          {claimableTokens.some(token => token.remainingCliffTime || token.remainingVestingTime) && (
            <div style={{ marginTop: '1rem' }}>
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                marginBottom: '1rem',
                fontSize: '1rem',
                fontWeight: '600',
                color: '#fff'
              }}>
                <Timer size={18} />
                Time Remaining
              </label>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {claimableTokens
                  .filter(token => token.remainingCliffTime || token.remainingVestingTime)
                  .map((token, index) => (
                    <div key={index}>
                      {token.remainingCliffTime && (
                        <CountdownTimer
                          timeLeft={token.remainingCliffTime}
                          label={`Cliff ends: ${token.date}`}
                          variant="warning"
                        />
                      )}
                      {token.remainingVestingTime && (
                        <CountdownTimer
                          timeLeft={token.remainingVestingTime}
                          label={`Vesting period ${token.period} starts: ${token.date}`}
                          variant="secondary"
                        />
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div style={{ 
          textAlign: 'center', 
          padding: '2rem', 
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: '1.1rem'
        }}>
          No tokens purchased in this round.
        </div>
      )}

      <Button onClick={handleClaim} disabled={loading || !claimableTokens.some(t => t.status === 'available')}>
        {loading ? 'Processing...' : (
          <>
            <Gift size={18} style={{ marginRight: '8px' }} />
            Claim Available Tokens
          </>
        )}
      </Button>
    </>
  );

  const renderRoundsTab = () => (
    <>
      {isLoadingRounds ? (
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
          Loading presale rounds...
        </div>
      ) : roundsError ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '2rem', 
          color: '#ff6b6b',
          fontSize: '1.1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem'
        }}>
          <XCircle size={20} />
          Error loading rounds: {roundsError.message}
        </div>
      ) : presaleRounds.length > 0 ? (
        presaleRounds.map((round) => (
          <RoundDetailsCard key={round.id}>
            <div className="round-header">
              <div className="round-title">{round.name}</div>
              <div className={`round-status ${round.status}`}>
                {round.status}
              </div>
            </div>
            
            <div className="round-stats">
              <div className="stat-item">
                <div className="stat-value">{round.price}</div>
                <div className="stat-label">Token Price</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{round.progress}%</div>
                <div className="stat-label">Progress</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">
                  ${(Number(round.totalFundsRaised) / 1e18).toFixed(2)}
                </div>
                <div className="stat-label">Funds Raised</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">
                  {(Number(round.roundInfo.tokenAmount) / 1e18).toLocaleString()}
                </div>
                <div className="stat-label">Total Supply</div>
              </div>
            </div>
            
            <div className="countdown-section">
              <div className="countdown-grid">
                {round.status === 'upcoming' && round.remainingStartTime && (
                  <CountdownTimer
                    timeLeft={round.remainingStartTime}
                    label="Until Round Starts"
                    variant="warning"
                  />
                )}
                {round.status === 'active' && round.remainingEndTime && (
                  <CountdownTimer
                    timeLeft={round.remainingEndTime}
                    label="Until Round Ends"
                    variant="primary"
                  />
                )}
                {round.status === 'completed' && (
                  <div style={{
                    padding: '0.75rem',
                    borderRadius: '12px',
                    textAlign: 'center',
                    background: 'rgba(158, 158, 158, 0.2)',
                    border: '1px solid rgba(158, 158, 158, 0.4)'
                  }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fff' }}>
                      <CheckCircle size={18} style={{ marginRight: '8px' }} />
                      Round Completed
                    </div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.8, color: '#fff' }}>
                      Ended on {new Date(Number(round.roundInfo.endTime) * 1000).toLocaleDateString()}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Additional round details */}
            <div style={{ 
              marginTop: '1rem', 
              padding: '1rem', 
              background: 'rgba(255, 255, 255, 0.05)', 
              borderRadius: '8px',
              fontSize: '0.85rem'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <strong style={{ color: '#fff' }}>Cliff Duration:</strong> {Number(round.roundInfo.cliffDuration) / 86400} days
                </div>
                <div>
                  <strong style={{ color: '#fff' }}>Vesting Duration:</strong> {Number(round.roundInfo.vestingDuration) / 86400} days
                </div>
                <div>
                  <strong style={{ color: '#fff' }}>Bonus:</strong> {round.roundInfo.userBonusPercentage}%
                </div>
                <div>
                  <strong style={{ color: '#fff' }}>Promoter Reward:</strong> {round.roundInfo.promoterRewardPercentage}%
                </div>
              </div>
            </div>
          </RoundDetailsCard>
        ))
      ) : (
        <div style={{ 
          textAlign: 'center', 
          padding: '2rem', 
          color: 'rgba(255, 255, 255, 0.8)',
          fontSize: '1.1rem'
        }}>
          {presaleAddress && presaleAddress !== '0x0000000000000000000000000000000000000000' 
            ? 'No presale rounds created yet. Connect as admin to create rounds.' 
            : 'Please connect to a supported network to view presale rounds.'
          }
        </div>
      )}
    </>
  );

  return (
    <WidgetContainer className="presale-widget">
      <WidgetHeader>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Gem size={24} />
          HMESH Presale
        </h2>
        <p>Your gateway to decentralized networking</p>
        {/* {currentNetwork && (
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.2)', 
            padding: '0.5rem 1rem', 
            borderRadius: '20px', 
            fontSize: '0.8rem',
            marginTop: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Globe size={16} />
            {currentNetwork.name}
          </div>
        )} */}
      </WidgetHeader>

      <TabContainer>
        <Tab $active={activeTab === 'buy'} onClick={() => setActiveTab('buy')}>
          <ShoppingCart size={18} style={{ marginRight: '8px' }} />
          Buy
        </Tab>
        <Tab $active={activeTab === 'claim'} onClick={() => setActiveTab('claim')}>
          <Gift size={18} style={{ marginRight: '8px' }} />
          Claim
        </Tab>
        <Tab $active={activeTab === 'rounds'} onClick={() => setActiveTab('rounds')}>
          <BarChart3 size={18} style={{ marginRight: '8px' }} />
          Rounds
        </Tab>
      </TabContainer>

      <ContentContainer>
        {activeTab === 'buy' && renderBuyTab()}
        {activeTab === 'claim' && renderClaimTab()}
        {activeTab === 'rounds' && renderRoundsTab()}
      </ContentContainer>

      {!isConnected && (
        <div style={{ 
          textAlign: 'center', 
          marginTop: '1rem', 
          fontSize: '0.9rem', 
          opacity: 0.8 
        }}>
          Please connect your wallet to continue
        </div>
      )}
      
      {isConnected && (!presaleAddress || presaleAddress === '0x0000000000000000000000000000000000000000') && (
        <div style={{ 
          textAlign: 'center', 
          marginTop: '1rem', 
          fontSize: '0.9rem', 
          color: '#ff6b6b',
          opacity: 0.9,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem'
        }}>
          <AlertTriangle size={18} />
          Contract not deployed on this network. Please switch to Ethereum Mainnet or Sepolia.
        </div>
      )}
    </WidgetContainer>
  );
};

export default PresaleWidget;

