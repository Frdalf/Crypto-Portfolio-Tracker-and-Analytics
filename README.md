<div align="center">

# 🚀 Crypto Portfolio Tracker & Analytics

### A powerful, beautiful Web3 portfolio tracker built with React

[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Recharts](https://img.shields.io/badge/Recharts-2.x-FF6B6B?style=for-the-badge&logo=chart.js&logoColor=white)](https://recharts.org/)

<p align="center">
  <strong>Track your crypto assets across multiple chains with stunning visualizations</strong>
</p>

[Live Demo](#-quick-start) • [Features](#-features) • [Tech Stack](#%EF%B8%8F-tech-stack) • [Installation](#-installation)

---

</div>

## ✨ Features

<table>
<tr>
<td width="50%">

### 🎯 Core Features
- 🔗 **MetaMask Integration** - Seamless wallet connection
- 🌐 **Multi-Chain Support** - Ethereum, Polygon, BSC, Arbitrum, Optimism
- 💰 **Real-Time Prices** - Live prices from CoinGecko API
- 📊 **Portfolio Analytics** - Beautiful charts & visualizations
- 📜 **Transaction History** - View all your on-chain transactions
- 🎨 **Glassmorphism UI** - Modern, stunning visual design

</td>
<td width="50%">

### 🚀 User Experience
- ⚡ **Instant Demo Mode** - Preview features without connecting
- 🔄 **Auto-Refresh** - Keep your data up to date
- 📱 **Fully Responsive** - Works on all devices
- ✨ **Smooth Animations** - Delightful micro-interactions
- 🌙 **Dark Theme** - Easy on the eyes
- 🛡️ **Error Boundaries** - Graceful error handling

</td>
</tr>
</table>

## 📊 Analytics Dashboard

<table>
<tr>
<td align="center" width="25%">
<h3>🥧</h3>
<strong>Portfolio Distribution</strong><br/>
<sub>Pie chart showing asset allocation</sub>
</td>
<td align="center" width="25%">
<h3>📊</h3>
<strong>Performance Metrics</strong><br/>
<sub>Bar chart with 24h changes</sub>
</td>
<td align="center" width="25%">
<h3>📈</h3>
<strong>Price History</strong><br/>
<sub>7-day price trend analysis</sub>
</td>
<td align="center" width="25%">
<h3>💹</h3>
<strong>Value Projection</strong><br/>
<sub>Portfolio value over time</sub>
</td>
</tr>
</table>

## 🛠️ Tech Stack

<table>
<tr>
<td align="center" width="20%">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="48" height="48" alt="React" />
<br/><strong>React 18</strong>
<br/><sub>UI Library</sub>
</td>
<td align="center" width="20%">
<img src="https://vitejs.dev/logo.svg" width="48" height="48" alt="Vite" />
<br/><strong>Vite</strong>
<br/><sub>Build Tool</sub>
</td>
<td align="center" width="20%">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" width="48" height="48" alt="Tailwind" />
<br/><strong>Tailwind CSS</strong>
<br/><sub>Styling</sub>
</td>
<td align="center" width="20%">
<img src="https://recharts.org/favicon.ico" width="48" height="48" alt="Recharts" />
<br/><strong>Recharts</strong>
<br/><sub>Charts</sub>
</td>
<td align="center" width="20%">
<img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" width="48" height="48" alt="MetaMask" />
<br/><strong>MetaMask</strong>
<br/><sub>Web3 Wallet</sub>
</td>
</tr>
</table>

### 🔌 APIs & Services

| Service | Purpose | Documentation |
|---------|---------|---------------|
| **Etherscan V2** | Blockchain data, balances, transactions | [View Docs](https://docs.etherscan.io/) |
| **CoinGecko** | Real-time prices, market data, history | [View Docs](https://www.coingecko.com/api/documentation) |
| **MetaMask** | Wallet connection, account management | [View Docs](https://docs.metamask.io/) |

## 🚀 Quick Start

### Prerequisites

```
Node.js 18+  •  npm or yarn  •  MetaMask browser extension
```

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/crypto-portfolio-tracker.git

# Navigate to project directory
cd crypto-portfolio-tracker

# Install dependencies
npm install

# Start development server
npm run dev
```

Then open **http://localhost:3000** in your browser 🎉

## 📁 Project Architecture

```
src/
├── 📂 components/
│   ├── 📂 charts/               # Data visualization components
│   │   ├── PortfolioPieChart.jsx
│   │   ├── PerformanceBarChart.jsx
│   │   ├── PriceHistoryChart.jsx
│   │   └── PortfolioValueChart.jsx
│   ├── CryptoPortfolioTracker.jsx  # Main app component
│   ├── Header.jsx                  # Navigation & wallet status
│   ├── TotalValueCard.jsx          # Portfolio value display
│   ├── ChainSelector.jsx           # Multi-chain selector
│   ├── PortfolioGrid.jsx           # Token grid layout
│   ├── TokenCard.jsx               # Individual token display
│   ├── TransactionHistory.jsx      # Transaction list
│   ├── QuickStats.jsx              # Portfolio statistics
│   ├── ErrorBoundary.jsx           # Error handling
│   └── WelcomeScreen.jsx           # Onboarding screen
│
├── 📂 hooks/
│   ├── useWallet.js           # MetaMask wallet integration
│   └── usePortfolio.js        # Portfolio data management
│
├── 📂 services/
│   └── portfolioService.js    # API calls & data fetching
│
├── 📂 utils/
│   └── formatters.js          # Currency & number formatting
│
├── 📂 constants/
│   └── chains.js              # Supported blockchain networks
│
├── 📂 config/
│   └── api.js                 # API configuration
│
├── App.jsx                    # Root component
├── main.jsx                   # Entry point
└── index.css                  # Global styles & animations
```

## 🌐 Supported Networks

<table>
<tr>
<td align="center">
<img src="https://cryptologos.cc/logos/ethereum-eth-logo.svg" width="40" height="40" alt="Ethereum" />
<br/><strong>Ethereum</strong>
</td>
<td align="center">
<img src="https://cryptologos.cc/logos/polygon-matic-logo.svg" width="40" height="40" alt="Polygon" />
<br/><strong>Polygon</strong>
</td>
<td align="center">
<img src="https://cryptologos.cc/logos/bnb-bnb-logo.svg" width="40" height="40" alt="BSC" />
<br/><strong>BSC</strong>
</td>
<td align="center">
<img src="https://cryptologos.cc/logos/arbitrum-arb-logo.svg" width="40" height="40" alt="Arbitrum" />
<br/><strong>Arbitrum</strong>
</td>
<td align="center">
<img src="https://cryptologos.cc/logos/optimism-ethereum-op-logo.svg" width="40" height="40" alt="Optimism" />
<br/><strong>Optimism</strong>
</td>
</tr>
</table>

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Etherscan API Key (required for live blockchain data)
VITE_ETHERSCAN_API_KEY=your_etherscan_api_key

# CoinGecko API Key (optional, for higher rate limits)
VITE_COINGECKO_API_KEY=your_coingecko_api_key
```

### API Keys

| API | Free Tier | Get Key |
|-----|-----------|---------|
| Etherscan | 5 calls/sec | [Get Free Key](https://etherscan.io/apis) |
| CoinGecko | 10-50 calls/min | [Get Free Key](https://www.coingecko.com/en/api) |

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality |

## 🎨 Design Features

- **Glassmorphism** - Modern frosted glass effect throughout
- **Gradient Animations** - Flowing color gradients
- **Micro-interactions** - Subtle hover & click animations
- **Particle Effects** - Floating background elements
- **Custom Animations** - Fade-in, float, pulse, shimmer effects

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

### Built with 💜 using React & Web3

**[⬆ Back to Top](#-crypto-portfolio-tracker--analytics)**

</div>

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see the [LICENSE](LICENSE) file for details.
