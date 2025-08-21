import React from 'react';
import styled from 'styled-components';
import { Network, Link, BarChart3, Mail, Twitter, Send, Users, Github } from 'lucide-react';

const FooterContainer = styled.footer`
  background: linear-gradient(135deg, rgba(44, 62, 80, 0.95) 0%, rgba(52, 73, 94, 0.95) 100%),
              url('https://images.unsplash.com/photo-1557804506-669a67932ba3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80');
  background-size: cover;
  background-position: center;
  color: white;
  padding: 3rem 0 2rem 0;
  margin-top: 4rem;
  backdrop-filter: blur(10px);
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const FooterSection = styled.div`
  h3 {
    font-size: 1.3rem;
    margin: 0 0 1rem 0;
    color: #ecf0f1;
  }
  
  p, a {
    color: #bdc3c7;
    line-height: 1.6;
    margin: 0.5rem 0;
    text-decoration: none;
    transition: color 0.3s ease;
    
    &:hover {
      color: #3498db;
    }
  }
  
  .social-links {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
    
    a {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      color: white;
      transition: all 0.3s ease;
      
      &:hover {
        background: #3498db;
        transform: translateY(-2px);
      }
    }
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 2rem;
  text-align: center;
  color: #95a5a6;
  
  p {
    margin: 0;
    font-size: 0.9rem;
  }
`;

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterGrid>
          <FooterSection>
            <h3>
              <Network size={24} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              HMESH Network
            </h3>
            <p>
              Revolutionizing decentralized networking through blockchain technology. 
              Join us in building the future of the internet.
            </p>
            <div className="social-links">
                      <a href="https://x.com/marksantiago02" target="_blank" rel="noopener noreferrer" title="Twitter">
          <Twitter size={20} />
        </a>
                      <a href="https://t.me/marksantiago02" target="_blank" rel="noopener noreferrer" title="Telegram">
          <Send size={20} />
        </a>
        <a href="https://discord.gg/KDSMNkxz" target="_blank" rel="noopener noreferrer" title="Discord">
          <Users size={20} />
        </a>
                      <a href="https://github.com/marksantiago02" target="_blank" rel="noopener noreferrer" title="GitHub">
          <Github size={20} />
        </a>
            </div>
          </FooterSection>
          
          <FooterSection>
            <h3>
              <Link size={24} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Quick Links
            </h3>
            <p><a href="#presale">Presale</a></p>
            <p><a href="#whitepaper">Whitepaper</a></p>
            <p><a href="#roadmap">Roadmap</a></p>
            <p><a href="#team">Team</a></p>
            <p><a href="#faq">FAQ</a></p>
          </FooterSection>
          
          <FooterSection>
            <h3>
              <BarChart3 size={24} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Resources
            </h3>
            <p><a href="#audit">Security Audit</a></p>
            <p><a href="#github">GitHub</a></p>
            <p><a href="#docs">Documentation</a></p>
            <p><a href="#support">Support</a></p>
            <p><a href="#community">Community</a></p>
          </FooterSection>
          
          <FooterSection>
            <h3>
              <Mail size={24} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Contact
            </h3>
            <p>Email: info@hmesh.network</p>
                    <p>Telegram: <a href="https://t.me/marksantiago02" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>@marksantiago02</a></p>
        <p>Discord: <a href="https://discord.gg/KDSMNkxz" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>Join our community</a></p>
            <p>Support: marksantiago0929@gmail.com</p>
          </FooterSection>
        </FooterGrid>
        
        <FooterBottom>
          <p>
            © 2024 HMESH Network. All rights reserved. | 
            <a href="#privacy" style={{ marginLeft: '0.5rem' }}>Privacy Policy</a> | 
            <a href="#terms" style={{ marginLeft: '0.5rem' }}>Terms of Service</a>
          </p>
        </FooterBottom>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;

