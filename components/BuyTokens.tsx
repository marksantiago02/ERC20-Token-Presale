import React, { useState } from 'react';
import styled from 'styled-components';

const BuyTokensContainer = styled.div`
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
  border-radius: 20px;
  padding: 2rem;
  margin: 2rem 0;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
`;

const BuyTokensHeader = styled.div`
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

const BuyTokensForm = styled.div`
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #333;
    font-size: 1rem;
  }
  
  input, select {
    width: 100%;
    padding: 1rem;
    border: 2px solid #e9ecef;
    border-radius: 12px;
    background: white;
    color: #333;
    font-size: 1rem;
    transition: all 0.3s ease;
    
    &:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
  }
`;

const PaymentOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin: 1.5rem 0;
`;

const PaymentOption = styled.div<{ selected: boolean }>`
  padding: 1rem;
  border: 2px solid ${props => props.selected ? '#667eea' : '#e9ecef'};
  border-radius: 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.selected ? 'rgba(102, 126, 234, 0.1)' : 'white'};
  
  &:hover {
    border-color: #667eea;
    transform: translateY(-2px);
  }
  
  .token-icon {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }
  
  .token-name {
    font-weight: 600;
    color: #333;
  }
`;

const TokenAmount = styled.div`
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  padding: 1.5rem;
  border-radius: 15px;
  text-align: center;
  margin: 1.5rem 0;
  
  .amount-label {
    font-size: 0.9rem;
    opacity: 0.9;
    margin-bottom: 0.5rem;
  }
  
  .amount-value {
    font-size: 2rem;
    font-weight: bold;
  }
`;

const Button = styled.button`
  background: linear-gradient(45deg, #ff6b6b, #ee5a52);
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

const BuyTokens: React.FC = () => {
  const [selectedToken, setSelectedToken] = useState('USDT');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const paymentTokens = [
    { symbol: 'USDT', name: 'Tether USD', icon: '💵' },
    { symbol: 'USDC', name: 'USD Coin', icon: '🪙' },
    { symbol: 'DAI', name: 'Dai', icon: '🟡' }
  ];

  const handleBuy = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    
    setLoading(true);
    // TODO: Implement actual buy logic
    setTimeout(() => {
      setLoading(false);
      alert('Buy transaction submitted!');
    }, 2000);
  };

  const calculateTokens = (amount: string) => {
    if (!amount || parseFloat(amount) <= 0) return '0';
    const price = 0.15; // $0.15 per token
    return (parseFloat(amount) / price).toFixed(2);
  };

  return (
    <BuyTokensContainer>
      <BuyTokensHeader>
        <h2>💎 Buy HMESH Tokens</h2>
        <p>Join the presale and secure your HMESH tokens</p>
      </BuyTokensHeader>
      
      <BuyTokensForm>
        <FormGroup>
          <label>Payment Token</label>
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
        </FormGroup>
        
        <FormGroup>
          <label>Amount to Pay ({selectedToken})</label>
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
            step="0.01"
          />
        </FormGroup>
        
        {amount && parseFloat(amount) > 0 && (
          <TokenAmount>
            <div className="amount-label">You will receive</div>
            <div className="amount-value">{calculateTokens(amount)} HMESH</div>
          </TokenAmount>
        )}
        
        <Button onClick={handleBuy} disabled={loading || !amount || parseFloat(amount) <= 0}>
          {loading ? 'Processing...' : '🚀 Buy Tokens'}
        </Button>
        
        <div style={{ textAlign: 'center', marginTop: '1rem', color: '#666', fontSize: '0.9rem' }}>
          Current Price: $0.15 per HMESH
        </div>
      </BuyTokensForm>
    </BuyTokensContainer>
  );
};

export default BuyTokens; 