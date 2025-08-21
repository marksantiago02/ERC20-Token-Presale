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

export default function ReferralStats() {
  const { address } = useAccount();
  const chainId = useChainId();
  const [promoter, setPromoter] = useState('');
  const [referrals, setReferrals] = useState(0);
  const [rewards, setRewards] = useState('0');
  
  // Get contract address for current chain
  const presaleAddress = getContractAddress(chainId, 'HMESH_PRESALE');

  useEffect(() => {
    async function fetchStats() {
      if (!address || !presaleAddress || presaleAddress === '0x0000000000000000000000000000000000000000') return;
      try {
        // For now, use mock data until we implement the actual contract calls
        setPromoter('0x1234567890123456789012345678901234567890');
        setReferrals(5);
        setRewards('150');
      } catch {
        setPromoter('');
        setReferrals(0);
        setRewards('0');
      }
    }
    fetchStats();
  }, [address, presaleAddress]);

  return (
    <Card>
      <h3>Referral Stats 🕵️‍♂️</h3>
      {promoter && promoter !== '0x0000000000000000000000000000000000000000' ? (
        <div>
          <div>Your promoter: <b>{promoter}</b></div>
          <div>Referrals: <b>{referrals}</b></div>
          <div>Total Rewards: <b>{rewards}</b> USDT/USDC/DAI</div>
        </div>
      ) : (
        <div>No promoter found. Maybe you’re the chosen one? 🦸‍♂️</div>
      )}
    </Card>
  );
} 