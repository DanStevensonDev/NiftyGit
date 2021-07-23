import React, { Component } from 'react';

import Analytics from 'analytics'
import googleAnalytics from '@analytics/google-analytics'

import HeaderIntro from './HeaderIntro'
import MetaMaskAccountInfo from './MetaMaskAccountInfo'
import HowItWorksInfo from './HowItWorksInfo'


const analytics = Analytics({
  app: 'NiftyGit',
  plugins: [
    googleAnalytics({
      trackingId: 'G-TJ44GFP810'
    })
  ]
})

/* Track a page view */
analytics.page()

class Home extends Component {
    render() {
        return (
            <div className="homepage-container">
                <div className="beta-version-banner">
                    <p><strong>BETA:</strong> NiftyGit is currently in beta mode on the Rinkeby Ethereum Testnet.</p>
                    <p>Any minted commits are for test purposes only and should not be purchased with "real" Ether.</p>
                    <p>To get Rinkeby test Ether and use NiftyGit, go to <a href="https://faucet.rinkeby.io/" target="_blank" rel="noreferrer">faucet.rinkeby.io</a></p>
                </div>
                <div className="homepage-header">
                    <header>
                        <HeaderIntro />
                    </header>
                    <main>
                        <MetaMaskAccountInfo />
                    </main>
                </div>
                <HowItWorksInfo />
            </div>
        );
    }
}

export default Home;