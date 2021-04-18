import React, { Component } from 'react';

import HeaderIntro from './HeaderIntro'
import CommitFetcher from './CommitFetcher' 

class Home extends Component {
    render() {
        return (
            <div>
                <HeaderIntro />
                <CommitFetcher />
            </div>
        );
    }
}

export default Home;