import { useState } from 'react'
import CryptoPortfolioTracker from './components/CryptoPortfolioTracker'
import ErrorBoundary from './components/ErrorBoundary'
import SplashScreen from './components/SplashScreen'

function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <ErrorBoundary>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <div className={showSplash ? 'opacity-0' : 'opacity-100 transition-opacity duration-500'}>
        <CryptoPortfolioTracker />
      </div>
    </ErrorBoundary>
  )
}

export default App
