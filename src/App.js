import './App.css';

import { Router } from '@reach/router'

import HeaderIntro from './components/HeaderIntro'
import MetaMaskAccountInfo from './components/MetaMaskAccountInfo'
import MintMyCommits from './components/MintMyCommits'
import HowItWorksInfo from './components/HowItWorksInfo'
import Footer from './components/Footer'

function App() {
  // add event listeners at top level of App
  // to check whenever crypto account or chainId is changed
  // and reload the page
  
  if (window.ethereum) {
    window.ethereum.on('accountsChanged', () => {
      window.location.reload();
    })
  
    window.ethereum.on('chainChanged', () => {
      window.location.reload();
    });
  }

  return (
    <div className="App">
        <div className="beta-version-banner">
            <p><strong>BETA:</strong> NiftyGit is currently in beta mode on the Rinkeby Ethereum Testnet.</p>
            <p>Any minted commits are for test purposes only and should not be purchased with "real" Ether.</p>
            <p>To get Rinkeby test Ether and use NiftyGit, go to <a href="https://faucet.rinkeby.io/" target="_blank" rel="noreferrer">faucet.rinkeby.io</a></p>
        </div>
        <header>
            <HeaderIntro />
        </header>
        <main>
          <Router>
            <MetaMaskAccountInfo path="/"/>
            <MintMyCommits path="/mint-my-commits" />
          </Router>
        </main>
        <HowItWorksInfo />
        <Footer />
    </div>
  );
}

export default App;
