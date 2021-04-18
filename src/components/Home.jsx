import React, { Component } from 'react';

import HeaderIntro from './HeaderIntro'
import MakeOffer from './MakeOffer' 

class Home extends Component {
    render() {
        return (
            <div>
                <HeaderIntro />
                <MakeOffer />
            </div>
        );
    }
}

export default Home;