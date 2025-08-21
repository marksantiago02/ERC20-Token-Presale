import React, { useState } from 'react';
import styled from 'styled-components';
import { useAccount, useReadContract, useWriteContract, useChainId } from 'wagmi';
import HMESHPresaleABI from '../abi/HMESHPresale.json';
import { getContractAddress, NETWORK_CONFIG } from '../utils/constants';
import { ShoppingCart, Gift, BarChart3, Coins, DollarSign, CreditCard, Zap, Lightbulb, CheckCircle, Rocket, Lock, Loader2, XCircle, Circle, Clock, AlertTriangle, Globe, Gem} from 'lucide-react';

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
}

// Define claimable token type
interface ClaimableToken {
  period: string;
  date: string;
  amount: string;
  status: 'claimed' | 'available' | 'locked';
}

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

const PresaleWidget: React.FC = () => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [activeTab, setActiveTab] = useState<'buy' | 'claim' | 'rounds'>('buy');
  const [selectedToken, setSelectedToken] = useState('USDT');
  const [amount, setAmount] = useState('');
  const [roundId, setRoundId] = useState(1);
  const [promoCode, setPromoCode] = useState('');
  const [loading, setLoading] = useState(false);

  // Get contract address for current chain
  const presaleAddress = getContractAddress(chainId, 'HMESH_PRESALE');
  const currentNetwork = NETWORK_CONFIG[chainId as keyof typeof NETWORK_CONFIG];

  // Contract reads - using correct ABI function names
  const { data: totalRounds, isLoading: isLoadingRounds, error: roundsError } = useReadContract({
    address: presaleAddress as `0x${string}`,
    abi: HMESHPresaleABI,
    functionName: 'totalRounds', // Correct function name from ABI
    query: {
      enabled: !!presaleAddress && presaleAddress !== '0x0000000000000000000000000000000000000000',
    },
  });

  // Fetch round details for each round using correct ABI function
  const roundsData = Array.from({ length: Number(totalRounds || 0) }, (_, i) => i + 1).map(roundId => {
    const { data: roundInfo } = useReadContract({
      address: presaleAddress as `0x${string}`,
      abi: HMESHPresaleABI,
      functionName: 'getRound', // Correct function name from ABI
      args: [roundId],
      query: {
        enabled: !!presaleAddress && presaleAddress !== '0x0000000000000000000000000000000000000000',
      },
    });
    return { roundId, roundInfo };
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

  // Transform contract data to UI format with proper type checking
  const presaleRounds: PresaleRound[] = roundsData
    .filter(item => item.roundInfo)
    .map(item => {
      const round = item.roundInfo as RoundInfo;
      if (!round) return null;
      
      // Calculate progress percentage
      const progress = round.tokenAmount > 0 
        ? Math.round((Number(round.soldAmount) / Number(round.tokenAmount)) * 100)
        : 0;
      
      // Determine status based on time
      const now = Math.floor(Date.now() / 1000);
      let status: 'upcoming' | 'active' | 'completed' = 'upcoming';
      
      if (now >= Number(round.startTime) && now <= Number(round.endTime)) {
        status = 'active';
      } else if (now > Number(round.endTime)) {
        status = 'completed';
      }
      
      return {
        id: item.roundId,
        name: `Round ${item.roundId}`,
        status,
        price: `$${(Number(round.tokenPrice) / 1e18).toFixed(2)}`,
        progress,
        roundInfo: round,
      };
    })
    .filter((round): round is PresaleRound => round !== null);

  // Mock claimable tokens for now - will be replaced with real contract calls
  const claimableTokens: ClaimableToken[] = [];

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

      <div>
        <label>Claimable Tokens</label>
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

      {claimableTokens.length > 0 ? (
        <InfoCard>
          <div className="info-value">2,500 HMESH</div>
          <div className="info-label">Available to claim</div>
        </InfoCard>
      ) : (
        <InfoCard style={{ opacity: 0.7 }}>
          <div className="info-value">0 HMESH</div>
          <div className="info-label">No tokens to claim</div>
        </InfoCard>
      )}

      <Button onClick={handleClaim} disabled={loading}>
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
          <InfoCard key={round.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div className="info-value">{round.name}</div>
                <div className="info-label">
                  {round.price} • {round.status} • {round.progress}% sold
                </div>
              </div>
              <div style={{ fontSize: '1.5rem' }}>
                {round.status === 'active' && <Circle size={20} style={{ color: '#4CAF50' }} />}
                {round.status === 'completed' && <CheckCircle size={20} style={{ color: '#4CAF50' }} />}
                {round.status === 'upcoming' && <Clock size={20} style={{ color: '#FFA726' }} />}
              </div>
            </div>
          </InfoCard>
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

