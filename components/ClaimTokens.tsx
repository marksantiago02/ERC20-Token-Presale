import React, { useState } from 'react';
import styled from 'styled-components';

const ClaimTokensContainer = styled.div`
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  border-radius: 20px;
  padding: 2rem;
  margin: 2rem 0;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
`;

const ClaimTokensHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  
  h2 {
    font-size: 2.5rem;
    margin: 0;
    background: linear-gradient(45deg, #667eea, #764ba2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  p {
    font-size: 1.1rem;
    color: #666;
    margin: 0.5rem 0;
  }
`;

const ClaimTokensContent = styled.div`
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const VestingSchedule = styled.div`
  margin: 2rem 0;
  
  h3 {
    color: #333;
    margin-bottom: 1rem;
    font-size: 1.3rem;
  }
`;

const VestingPeriod = styled.div<{ isActive: boolean; isCompleted: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  margin: 0.5rem 0;
  background: ${props => {
    if (props.isCompleted) return 'rgba(81, 207, 102, 0.1)';
    if (props.isActive) return 'rgba(102, 126, 234, 0.1)';
    return 'rgba(134, 142, 150, 0.1)';
  }};
  border: 2px solid ${props => {
    if (props.isCompleted) return '#51cf66';
    if (props.isActive) return '#667eea';
    return '#868e96';
  }};
  border-radius: 12px;
  
  .period-info {
    .period-name {
      font-weight: 600;
      color: #333;
      margin-bottom: 0.25rem;
    }
    
    .period-date {
      font-size: 0.9rem;
      color: #666;
    }
  }
  
  .period-amount {
    text-align: right;
    
    .amount-value {
      font-size: 1.1rem;
      font-weight: bold;
      color: #667eea;
    }
    
    .amount-label {
      font-size: 0.8rem;
      color: #666;
    }
  }
  
  .period-status {
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: white;
    background: ${props => {
      if (props.isCompleted) return 'linear-gradient(45deg, #51cf66, #40c057)';
      if (props.isActive) return 'linear-gradient(45deg, #667eea, #764ba2)';
      return 'linear-gradient(45deg, #868e96, #495057)';
    }};
  }
`;

const ClaimSummary = styled.div`
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  padding: 2rem;
  border-radius: 15px;
  margin: 2rem 0;
  text-align: center;
  
  .summary-title {
    font-size: 1.2rem;
    margin-bottom: 1rem;
    opacity: 0.9;
  }
  
  .summary-amount {
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }
  
  .summary-label {
    opacity: 0.8;
    font-size: 0.9rem;
  }
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  background: ${props => props.variant === 'secondary' 
    ? 'linear-gradient(45deg, #868e96, #495057)' 
    : 'linear-gradient(45deg, #51cf66, #40c057)'
  };
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ClaimTokens: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const vestingPeriods = [
    {
      id: 1,
      name: 'Cliff Period',
      date: '2024-05-01',
      amount: '5000',
      status: 'completed',
      isActive: false,
      isCompleted: true
    },
    {
      id: 2,
      name: 'Month 1',
      date: '2024-06-01',
      amount: '2500',
      status: 'completed',
      isActive: false,
      isCompleted: true
    },
    {
      id: 3,
      name: 'Month 2',
      date: '2024-07-01',
      amount: '2500',
      status: 'active',
      isActive: true,
      isCompleted: false
    },
    {
      id: 4,
      name: 'Month 3',
      date: '2024-08-01',
      amount: '2500',
      status: 'upcoming',
      isActive: false,
      isCompleted: false
    },
    {
      id: 5,
      name: 'Month 4',
      date: '2024-09-01',
      amount: '2500',
      status: 'upcoming',
      isActive: false,
      isCompleted: false
    }
  ];

  const totalClaimable = vestingPeriods
    .filter(period => period.status === 'active')
    .reduce((sum, period) => sum + parseInt(period.amount), 0);

  const handleClaim = async () => {
    setLoading(true);
    // TODO: Implement actual claim logic
    setTimeout(() => {
      setLoading(false);
      alert('Tokens claimed successfully!');
    }, 2000);
  };

  return (
    <ClaimTokensContainer>
      <ClaimTokensHeader>
        <h2>🎁 Claim Your Tokens</h2>
        <p>Claim your vested HMESH tokens according to the schedule</p>
      </ClaimTokensHeader>
      
      <ClaimTokensContent>
        <ClaimSummary>
          <div className="summary-title">Available to Claim</div>
          <div className="summary-amount">{totalClaimable.toLocaleString()} HMESH</div>
          <div className="summary-label">From Round 2 - Private Sale</div>
        </ClaimSummary>
        
        <VestingSchedule>
          <h3>📅 Vesting Schedule</h3>
          {vestingPeriods.map((period) => (
            <VestingPeriod
              key={period.id}
              isActive={period.isActive}
              isCompleted={period.isCompleted}
            >
              <div className="period-info">
                <div className="period-name">{period.name}</div>
                <div className="period-date">{period.date}</div>
              </div>
              
              <div className="period-amount">
                <div className="amount-value">{period.amount} HMESH</div>
                <div className="amount-label">Tokens</div>
              </div>
              
              <div className="period-status">
                {period.status === 'completed' && '✅ Claimed'}
                {period.status === 'active' && '🚀 Claim Now'}
                {period.status === 'upcoming' && '⏳ Locked'}
              </div>
            </VestingPeriod>
          ))}
        </VestingSchedule>
        
        {totalClaimable > 0 && (
          <Button onClick={handleClaim} disabled={loading}>
            {loading ? 'Processing...' : '🎁 Claim Available Tokens'}
          </Button>
        )}
        
        {totalClaimable === 0 && (
          <Button variant="secondary" disabled>
            ⏳ No Tokens Available for Claim
          </Button>
        )}
        
        <div style={{ textAlign: 'center', marginTop: '1rem', color: '#666', fontSize: '0.9rem' }}>
          Tokens are automatically vested according to the schedule. You can claim them once they become available.
        </div>
      </ClaimTokensContent>
    </ClaimTokensContainer>
  );
};

export default ClaimTokens; 