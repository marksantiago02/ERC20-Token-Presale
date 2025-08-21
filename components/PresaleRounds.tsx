import React from 'react';
import styled from 'styled-components';

const RoundsContainer = styled.div`
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  border-radius: 20px;
  padding: 2rem;
  margin: 2rem 0;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
`;

const RoundsHeader = styled.div`
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

const RoundsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
`;

const RoundCard = styled.div<{ isActive?: boolean; isCompleted?: boolean }>`
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  padding: 2rem;
  border: 3px solid ${props => {
    if (props.isActive) return '#51cf66';
    if (props.isCompleted) return '#868e96';
    return 'transparent';
  }};
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => {
      if (props.isActive) return 'linear-gradient(45deg, #51cf66, #40c057)';
      if (props.isCompleted) return 'linear-gradient(45deg, #868e96, #495057)';
      return 'linear-gradient(45deg, #667eea, #764ba2)';
    }};
  }
  
  .round-status {
    position: absolute;
    top: 1rem;
    right: 1rem;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: white;
    background: ${props => {
      if (props.isActive) return 'linear-gradient(45deg, #51cf66, #40c057)';
      if (props.isCompleted) return 'linear-gradient(45deg, #868e96, #495057)';
      return 'linear-gradient(45deg, #667eea, #764ba2)';
    }};
  }
`;

const RoundInfo = styled.div`
  margin-bottom: 1.5rem;
  
  h3 {
    font-size: 1.5rem;
    margin: 0 0 1rem 0;
    color: #333;
  }
  
  .round-id {
    font-size: 0.9rem;
    color: #666;
    margin-bottom: 1rem;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
  margin: 1rem 0;
  
  .progress-fill {
    height: 100%;
    background: linear-gradient(45deg, #51cf66, #40c057);
    border-radius: 4px;
    transition: width 0.3s ease;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin: 1.5rem 0;
`;

const StatItem = styled.div`
  text-align: center;
  
  .stat-value {
    font-size: 1.2rem;
    font-weight: bold;
    color: #667eea;
    margin-bottom: 0.25rem;
  }
  
  .stat-label {
    font-size: 0.8rem;
    color: #666;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  background: ${props => props.variant === 'secondary' 
    ? 'linear-gradient(45deg, #868e96, #495057)' 
    : 'linear-gradient(45deg, #51cf66, #40c057)'
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
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const PresaleRounds: React.FC = () => {
  const rounds = [
    {
      id: 1,
      name: "Seed Round",
      status: "completed",
      progress: 100,
      price: "$0.10",
      raised: "$500K",
      participants: 150,
      startDate: "2024-01-15",
      endDate: "2024-02-15"
    },
    {
      id: 2,
      name: "Private Round",
      status: "active",
      progress: 75,
      price: "$0.15",
      raised: "$1.2M",
      participants: 300,
      startDate: "2024-03-01",
      endDate: "2024-04-30"
    },
    {
      id: 3,
      name: "Public Round",
      status: "upcoming",
      progress: 0,
      price: "$0.20",
      raised: "$0",
      participants: 0,
      startDate: "2024-05-01",
      endDate: "2024-06-30"
    }
  ];

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return '🟢 Active';
      case 'completed': return '✅ Completed';
      case 'upcoming': return '⏳ Upcoming';
      default: return '❓ Unknown';
    }
  };

  return (
    <RoundsContainer>
      <RoundsHeader>
        <h2>📊 Presale Rounds</h2>
        <p>Current and upcoming investment opportunities</p>
      </RoundsHeader>
      
      <RoundsGrid>
        {rounds.map((round) => (
          <RoundCard 
            key={round.id}
            isActive={round.status === 'active'}
            isCompleted={round.status === 'completed'}
          >
            <div className="round-status">
              {getStatusText(round.status)}
            </div>
            
            <RoundInfo>
              <h3>{round.name}</h3>
              <div className="round-id">Round #{round.id}</div>
              
              <ProgressBar>
                <div 
                  className="progress-fill" 
                  style={{ width: `${round.progress}%` }}
                />
              </ProgressBar>
              
              <div>Progress: {round.progress}%</div>
            </RoundInfo>
            
            <StatsGrid>
              <StatItem>
                <div className="stat-value">{round.price}</div>
                <div className="stat-label">Token Price</div>
              </StatItem>
              <StatItem>
                <div className="stat-value">{round.raised}</div>
                <div className="stat-label">Raised</div>
              </StatItem>
              <StatItem>
                <div className="stat-value">{round.participants}</div>
                <div className="stat-label">Participants</div>
              </StatItem>
              <StatItem>
                <div className="stat-value">{round.status === 'upcoming' ? 'TBD' : round.endDate}</div>
                <div className="stat-label">End Date</div>
              </StatItem>
            </StatsGrid>
            
            {round.status === 'active' && (
              <Button variant="primary">
                🚀 Join Round
              </Button>
            )}
            
            {round.status === 'upcoming' && (
              <Button variant="secondary" disabled>
                ⏳ Coming Soon
              </Button>
            )}
            
            {round.status === 'completed' && (
              <Button variant="secondary">
                📊 View Results
              </Button>
            )}
          </RoundCard>
        ))}
      </RoundsGrid>
    </RoundsContainer>
  );
};

export default PresaleRounds; 