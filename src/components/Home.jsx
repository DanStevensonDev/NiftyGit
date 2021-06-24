import React, { Component } from 'react';

import HeaderIntro from './HeaderIntro'
import MetaMaskAccountInfo from './MetaMaskAccountInfo'
import HowItWorksInfo from './HowItWorksInfo'

class Home extends Component {
    render() {
        return (
            <div>
                <header>
                    <HeaderIntro />
                </header>
                <main>
                    <MetaMaskAccountInfo />
                    <HowItWorksInfo />
                </main>
            </div>
        );
    }
}

export default Home;