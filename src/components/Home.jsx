import React, { Component } from 'react';

import HeaderIntro from './HeaderIntro'
import CommitFetcher from './CommitFetcher' 
import MetaMaskTests from './MetaMaskTests'

class Home extends Component {
    render() {
        return (
            <div>
                <HeaderIntro />
                <CommitFetcher />
                <MetaMaskTests />
            </div>
        );
    }
}

export default Home;