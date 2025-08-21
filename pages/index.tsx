import React from 'react';
import styled from 'styled-components';
import Header from '../components/Header';
import AdminPanel from '../components/AdminPanel';
import PresaleWidget from '../components/PresaleWidget';
import Footer from '../components/Footer';
import { Network, Zap, Shield, Globe, Link } from 'lucide-react';
import { useAdmin } from '../hooks/useAdmin';

const MainContainer = styled.main`
  min-height: 100vh;
  background: linear-gradient(135deg, rgba(245, 247, 250, 0.7) 0%, rgba(195, 207, 226, 0.7) 100%),
              url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
`;

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const HeroSection = styled.section`
  text-align: center;
  margin: 4rem 0;
  padding: 3rem 0;
  
  h1 {
    font-size: 3.5rem;
    margin: 0 0 1rem 0;
    background: linear-gradient(45deg, #667eea, #764ba2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-weight: bold;
  }
  
  p {
    font-size: 1.3rem;
    color: #666;
    margin: 0 0 2rem 0;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
    line-height: 1.6;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin: 4rem 0;
`;

const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }
  
  .feature-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }
  
  h3 {
    font-size: 1.5rem;
    margin: 0 0 1rem 0;
    color: #333;
  }
  
  p {
    color: #666;
    line-height: 1.6;
  }
`;

export default function Home() {
  const { isAdmin, isLoading } = useAdmin();

  return (
    <>
      <Header />
      <MainContainer>
        <ContentContainer>
          <HeroSection>
            <h1>
              <Network size={48} style={{ marginRight: '16px', verticalAlign: 'middle' }} />
              HMESH Network
            </h1>
            <p>
              Join the revolution in decentralized networking. HMESH combines cutting-edge 
              blockchain technology with innovative mesh networking to create a truly 
              decentralized internet infrastructure.
            </p>
          </HeroSection>
          
          <FeaturesGrid>
            <FeatureCard>
              <div className="feature-icon">
                <Link size={48} color="#667eea" />
              </div>
              <h3>Decentralized</h3>
              <p>No single point of failure. Built on blockchain technology for maximum security and reliability.</p>
            </FeatureCard>
            
            <FeatureCard>
              <div className="feature-icon">
                <Zap size={48} color="#667eea" />
              </div>
              <h3>High Performance</h3>
              <p>Optimized mesh networking algorithms ensure fast and efficient data transmission.</p>
            </FeatureCard>
            
            <FeatureCard>
              <div className="feature-icon">
                <Shield size={48} color="#667eea" />
              </div>
              <h3>Secure</h3>
              <p>Advanced encryption and consensus mechanisms protect your data and network integrity.</p>
            </FeatureCard>
            
            <FeatureCard>
              <div className="feature-icon">
                <Globe size={48} color="#667eea" />
              </div>
              <h3>Global Scale</h3>
              <p>Designed to scale globally, connecting users worldwide in a seamless network.</p>
            </FeatureCard>
          </FeaturesGrid>
          
          {/* Conditionally render Admin Panel or Presale Widget */}
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
              Loading...
            </div>
          ) : isAdmin ? (
            <AdminPanel />
          ) : (
            <PresaleWidget />
          )}
        </ContentContainer>
      </MainContainer>
      <Footer />
    </>
  );
} 