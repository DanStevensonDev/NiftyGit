import React, { Component } from 'react';

import HeaderIntro from './HeaderIntro'
import MetaMaskAccountInfo from './MetaMaskAccountInfo'
import MakeOffer from './MakeOffer' 

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