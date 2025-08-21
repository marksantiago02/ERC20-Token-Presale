import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useChainId } from 'wagmi';
import styled from 'styled-components';
import { getContractAddress } from '../utils/constants';
import HMESHPresaleABI from '../abi/HMESHPresale.json';

const Card = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px #ffb6b9aa;
  margin-bottom: 2rem;
  padding: 1.5rem;
`;

export default function PromoCode() {
  const { address } = useAccount();
  const chainId = useChainId();
  const [promoCode, setPromoCode] = useState('');
  const [input, setInput] = useState('');
  const [valid, setValid] = useState<null | boolean>(null);
  
  // Get contract address for current chain
  const presaleAddress = getContractAddress(chainId, 'HMESH_PRESALE');

  useEffect(() => {
    async function fetchPromo() {
      if (!address || !presaleAddress || presaleAddress === '0x0000000000000000000000000000000000000000') return setPromoCode('');
      try {
        // For now, set a mock promo code until we implement the actual contract call
        setPromoCode('HMESH2024');
      } catch {
        setPromoCode('');
      }
    }
    fetchPromo();
  }, [address, presaleAddress]);

  const checkPromo = async () => {
    if (!presaleAddress || presaleAddress === '0x0000000000000000000000000000000000000000') {
      setValid(false);
      return;
    }
    
    try {
      // For now, use a simple validation until we implement the actual contract call
      const isValid = input.length > 0 && input.toLowerCase().includes('hmesh');
      setValid(isValid);
    } catch {
      setValid(false);
    }
  };

  return (
    <Card>
      <h3>Promo Code 🎟️</h3>
      {promoCode ? (
        <div>Your promo code: <b>{promoCode}</b> <span role="img" aria-label="party">🎉</span></div>
      ) : (
        <div>No promo code yet. Maybe you need to get famous first? 😜</div>
      )}
      <div style={{ marginTop: 12 }}>
        <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Check a promo code..." />
        <button onClick={checkPromo} style={{ marginLeft: 8 }}>Check</button>
        {valid === true && <span style={{ color: 'green', marginLeft: 8 }}>Valid! 🥳</span>}
        {valid === false && <span style={{ color: 'red', marginLeft: 8 }}>Nope! 🚫</span>}
      </div>
    </Card>
  );
} 