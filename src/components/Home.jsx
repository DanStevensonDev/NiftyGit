import React, { Component } from 'react';

import HeaderIntro from './HeaderIntro'
import MetaMaskAccountInfo from './MetaMaskAccountInfo'

class Home extends Component {
    render() {
        return (
            <div>
                <HeaderIntro />
                <MetaMaskAccountInfo />
            </div>
        );
    }
}

export default Home;