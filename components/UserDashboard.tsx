import React from 'react';
import styled from 'styled-components';

const DashboardContainer = styled.div`
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
  border-radius: 20px;
  padding: 2rem;
  margin: 2rem 0;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
`;

const DashboardHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  
  h2 {
    font-size: 2.5rem;
    margin: 0;
    background: linear-gradient(45deg, #ff6b6b, #ee5a52);
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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 1.5rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  }
  
  .stat-value {
    font-size: 2rem;
    font-weight: bold;
    color: #ff6b6b;
    margin-bottom: 0.5rem;
  }
  
  .stat-label {
    color: #666;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
`;

const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const ActionCard = styled.div`
  background: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  }
  
  h3 {
    margin: 0 0 1rem 0;
    color: #333;
    font-size: 1.3rem;
  }
  
  p {
    color: #666;
    margin-bottom: 1rem;
    line-height: 1.6;
  }
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  background: ${props => props.variant === 'secondary' 
    ? 'linear-gradient(45deg, #667eea, #764ba2)' 
    : 'linear-gradient(45deg, #ff6b6b, #ee5a52)'
  };
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
`;

const UserDashboard: React.FC = () => {
  return (
    <DashboardContainer>
      <DashboardHeader>
        <h2>🚀 HMESH Presale</h2>
        <p>Join the future of decentralized networking</p>
      </DashboardHeader>
      
      <StatsGrid>
        <StatCard>
          <div className="stat-value">3</div>
          <div className="stat-label">Active Rounds</div>
        </StatCard>
        <StatCard>
          <div className="stat-value">$2.5M</div>
          <div className="stat-label">Total Raised</div>
        </StatCard>
        <StatCard>
          <div className="stat-value">1,247</div>
          <div className="stat-label">Participants</div>
        </StatCard>
        <StatCard>
          <div className="stat-value">$0.15</div>
          <div className="stat-label">Current Price</div>
        </StatCard>
      </StatsGrid>
      
      <ActionGrid>
        <ActionCard>
          <h3>💎 Buy Tokens</h3>
          <p>Purchase HMESH tokens in the current presale round. Multiple payment options available including USDT, USDC, and DAI.</p>
          <Button variant="primary">Buy Now</Button>
        </ActionCard>
        
        <ActionCard>
          <h3>🎁 Claim Tokens</h3>
          <p>Claim your purchased tokens after the presale ends. Tokens are released according to the vesting schedule.</p>
          <Button variant="secondary">Claim Tokens</Button>
        </ActionCard>
        
        <ActionCard>
          <h3>🎯 Referral Program</h3>
          <p>Earn rewards by referring friends to the presale. Get bonus tokens for every successful referral.</p>
          <Button variant="secondary">View Referrals</Button>
        </ActionCard>
        
        <ActionCard>
          <h3>📊 Round Details</h3>
          <p>View detailed information about current and upcoming presale rounds, including pricing and token allocation.</p>
          <Button variant="secondary">View Rounds</Button>
        </ActionCard>
      </ActionGrid>
    </DashboardContainer>
  );
};

export default UserDashboard;

