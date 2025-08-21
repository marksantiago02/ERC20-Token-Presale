# HMESH Presale Frontend 🎉

A modern, feature-rich decentralized application (dApp) for the HMESH token presale, built with Next.js and Web3 technologies. This frontend provides an intuitive interface for users to participate in the presale, manage their token vesting, and engage with the promotion system.

## 🚀 Features

### Core Presale Functionality
- **Multi-Round Support**: Participate in different presale rounds with varying parameters
- **Multiple Payment Methods**: Buy tokens with ETH, USDT, USDC, or DAI
- **Real-time Price Calculations**: Automatic token amount estimations and cost calculations
- **Slippage Protection**: Configurable slippage tolerance for ETH purchases
- **Live Countdowns**: Real-time presale start/end and cliff period timers

### 🎯 **Critical Revenue Sharing Model Implementation**
This presale implements the **revenue sharing model** - a powerful marketing strategy that transforms your community into an active marketing force. As described in the comprehensive article [Revenue Sharing Model: A Powerful Marketing Strategy for Token Presales](https://dev.to/marksantiago02/revenue-sharing-model-a-powerful-marketing-strategy-for-token-presales-3k48), this approach:

- **Incentivizes Word-of-Mouth**: Promoters become stakeholders with direct financial incentives
- **Creates Network Effects**: Organic growth through promoter networks and communities
- **Builds Community Engagement**: Fosters ownership and long-term loyalty
- **Provides Cost-Effective Marketing**: Pay only for successful referrals and results
- **Ensures Transparency**: Smart contract-based reward distribution for fairness

**How It Works:**
1. **Promoter Registration**: Community members register and receive unique referral codes
2. **Referral Tracking**: Smart contracts track which investors use which promoter codes
3. **Reward Distribution**: Promoters earn a percentage of referred investments after presale ends
4. **User Bonuses**: Referred users receive bonus tokens for using promo codes
5. **Transparent Claims**: All rewards distributed automatically through smart contracts

### Advanced Token Management
- **Vesting Schedule Tracking**: Monitor your token release schedule with visual timelines
- **Claim Management**: Claim available tokens based on vesting schedules
- **Portfolio Overview**: Comprehensive view of your token holdings across all rounds
- **Investment History**: Track your contributions and payment methods used

### Promotion & Reward System
- **Promo Code Integration**: Use promo codes for bonus tokens during purchase
- **Referral Tracking**: Monitor your referral performance and earnings
- **Reward Claims**: Claim earned rewards from successful referrals
- **Promoter Dashboard**: Comprehensive analytics for promoters
- **Revenue Sharing Implementation**: Built-in revenue sharing model as described in the [comprehensive guide](https://dev.to/marksantiago02/revenue-sharing-model-a-powerful-marketing-strategy-for-token-presales-3k48)

### User Experience
- **Wallet Integration**: Seamless connection with RainbowKit supporting multiple wallets
- **Responsive Design**: Mobile-first approach with modern UI/UX
- **Real-time Updates**: Live blockchain data synchronization
- **Transaction Status**: Clear feedback on all blockchain operations

## 🛠 Tech Stack

- **Frontend Framework**: Next.js 14 with TypeScript
- **Web3 Integration**: 
  - RainbowKit for wallet connections
  - Wagmi for React hooks
  - Ethers.js for blockchain interactions
- **Styling**: Styled Components with modern design system
- **State Management**: React hooks with Wagmi state management
- **Blockchain Support**: Ethereum Mainnet, Arbitrum One, and Testnets

## 📱 Screenshots & Features

### Main Dashboard
- Presale round overview with live statistics
- Current round status and participation options
- Quick access to all major functions

### Purchase Interface
- Multi-currency purchase forms
- Real-time price calculations
- Promo code input with validation
- Slippage settings for ETH purchases

### Portfolio Management
- Token vesting schedules with visual timelines
- Claimable amounts and next claim dates
- Investment history across all rounds
- Payment method breakdown

### Promotion Center
- Promoter registration and management
- Referral tracking and analytics
- Reward claiming interface
- Performance metrics dashboard

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- MetaMask or other Web3 wallet
- Access to supported blockchain networks

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd presale-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your configuration:
   ```env
   NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
   NEXT_PUBLIC_CHAIN_ID=42161
   NEXT_PUBLIC_RPC_URL=https://arb1.arbitrum.io/rpc
   ```

4. **Update contract addresses:**
   - Edit `/abi/HMESHPresale.json` with your presale contract ABI
   - Edit `/abi/HMESH.json` with your token contract ABI
   - Set contract addresses in `/utils/constants.ts`

5. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Contract Setup
```typescript
// /utils/constants.ts
export const CONTRACTS = {
  PRESALE: "0x...", // HMESH Presale contract address
  TOKEN: "0x...",   // HMESH Token contract address
  USDT: "0x...",    // USDT contract address
  USDC: "0x...",    // USDC contract address
  DAI: "0x..."      // DAI contract address
};
```

### Network Configuration
```typescript
// Supported networks
export const SUPPORTED_CHAINS = [
  {
    id: 1,
    name: 'Ethereum',
    network: 'ethereum',
    rpcUrls: { default: 'https://eth-mainnet.g.alchemy.com/v2/...' }
  },
  {
    id: 42161,
    name: 'Arbitrum One',
    network: 'arbitrum',
    rpcUrls: { default: 'https://arb1.arbitrum.io/rpc' }
  }
];
```

## 📖 Usage Examples

### Buying Tokens with USDT
```typescript
import { useContractWrite, usePrepareContractWrite } from 'wagmi';

const { config } = usePrepareContractWrite({
  address: presaleContract,
  abi: presaleABI,
  functionName: 'buyWithUSDT',
  args: [tokenAmount, roundId, promoCode],
});

const { write: buyTokens } = useContractWrite(config);

// Execute purchase
buyTokens?.();
```

### Checking Claimable Amount
```typescript
import { useContractRead } from 'wagmi';

const { data: claimableData } = useContractRead({
  address: presaleContract,
  abi: presaleABI,
  functionName: 'getClaimableAmount',
  args: [userAddress, roundId],
});

const [claimableAmount, periods, bonusAmount] = claimableData || [];
```

### Claiming Tokens
```typescript
const { write: claimTokens } = useContractWrite({
  address: presaleContract,
  abi: presaleABI,
  functionName: 'claimTokens',
  args: [roundId],
});

// Claim available tokens
claimTokens?.();
```

## 🎯 Key Components

### Presale Interface
- **RoundSelector**: Choose active presale rounds
- **PurchaseForm**: Multi-currency purchase interface
- **PriceCalculator**: Real-time token calculations
- **CountdownTimer**: Live presale timing information

### Portfolio Management
- **VestingTimeline**: Visual representation of token release schedule
- **ClaimButton**: Token claiming with status indicators
- **InvestmentHistory**: Complete transaction history
- **TokenBalance**: Current holdings across all rounds

### Promotion System
- **PromoCodeInput**: Promo code validation and application
- **ReferralTracker**: Monitor referral performance
- **RewardClaim**: Claim earned promotion rewards
- **PromoterDashboard**: Comprehensive analytics interface

## 🔒 Security Features

- **Wallet Connection Validation**: Secure wallet authentication
- **Transaction Confirmation**: Clear transaction details before execution
- **Error Handling**: Comprehensive error messages and recovery
- **Network Validation**: Automatic network switching and validation

## 🧪 Testing

### Development Testing
```bash
# Run linting
npm run lint

# Run type checking
npm run type-check

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
npm run deploy
# or
vercel --prod
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.


## Want to contribute a meme or a joke? PRs welcome! 😎

---

*"The only thing more volatile than crypto is our sense of humor."* 