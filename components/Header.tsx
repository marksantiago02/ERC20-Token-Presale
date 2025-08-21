import React from 'react';
import styled from 'styled-components';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Twitter, MessageCircle, MessageSquare, Send, Users, Globe } from 'lucide-react';

const HeaderContainer = styled.header`
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%),
              url('https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  
  /* Ensure wallet modal appears above header */
  .connect-button-wrapper {
    position: relative;
    z-index: 1001;
  }
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    
    .logo-text h1 {
      font-size: 1.5rem;
    }
    
    .logo-text p {
      font-size: 0.8rem;
    }
  }
  
  @media (max-width: 480px) {
    .network-info {
      font-size: 0.8rem;
      padding: 0.4rem 0.8rem;
    }
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  .logo-icon {
    font-size: 2rem;
    color: white;
  }
  
  .logo-text {
    h1 {
      margin: 0;
      font-size: 1.8rem;
      font-weight: bold;
      color: white;
      background: linear-gradient(45deg, #fff, #f0f0f0);
      -webkit-background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    p {
      margin: 0;
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.8);
      font-weight: 500;
    }
  }
`;

const WalletSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
  z-index: 1001;
  
  .network-info {
    background: rgba(255, 255, 255, 0.1);
    padding: 0.5rem 1rem;
    border-radius: 20px;
    color: white;
    font-size: 0.9rem;
    font-weight: 500;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
`;

const SocialSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  .social-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    text-decoration: none;
    font-size: 1.2rem;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }
  }
  
  @media (max-width: 768px) {
    gap: 0.3rem;
    
    .social-button {
      width: 35px;
      height: 35px;
      font-size: 1rem;
    }
  }
`;

const Header: React.FC = () => {
  return (
    <HeaderContainer className="header-container">
      <HeaderContent>
        <Logo>
          <div className="logo-icon">
            <Globe size={32} />
          </div>
          <div className="logo-text">
            <h1>HMESH</h1>
            <p>Decentralized Network Presale</p>
          </div>
        </Logo>
        

        
        <WalletSection>
          <div className="connect-button-wrapper">
            <ConnectButton />
          </div>
        </WalletSection>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;
