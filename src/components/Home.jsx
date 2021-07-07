import React, { Component } from 'react';

import HeaderIntro from './HeaderIntro'
import MetaMaskAccountInfo from './MetaMaskAccountInfo'
import HowItWorksInfo from './HowItWorksInfo'

class Home extends Component {
    render() {
        return (
            <div className="homepage-container">
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