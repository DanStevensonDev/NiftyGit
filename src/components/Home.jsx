import React, { Component } from 'react';

import HeaderIntro from './HeaderIntro'
import MetaMaskAccountInfo from './MetaMaskAccountInfo'
import HowItWorksInfo from './HowItWorksInfo'

class Home extends Component {
    render() {
        return (
            <div className="homepage-container">
                <div className="beta-version-banner">
                    <p><strong>BETA:</strong> NiftyGit is currently in beta mode on the Rinkeby Ethereum testnet.</p>
                    <p>Any minted commits are for test purposes only and should not be purchased with "real" Ether.</p>
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