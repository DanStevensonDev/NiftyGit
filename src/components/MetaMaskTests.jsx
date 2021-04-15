import React, { Component } from 'react';
import detectEthereumProvider from '@metamask/detect-provider';

class MetaMaskTests extends Component {

    handleClick = (event) => {
        
        if (typeof window.ethereum !== 'undefined') {
            console.log('MetaMask is installed!');
            return window.ethereum.request({ method: 'eth_requestAccounts' })
                .then(() => {
                const transactionParameters = {
                    to: '0x3d042aA656bCeeD1561bFF83c5B68AdC4C32cf61', // Required except during contract publications.
                    from: window.ethereum.selectedAddress, // must match user's active address.
                    value: 'EEBE0B40E8000', // Only required to send ether to the recipient from the initiating external account.
                    };
    
                    // txHash is a hex string
                    // As with any RPC call, it may throw an error
                    return window.ethereum.request({
                        method: 'eth_sendTransaction',
                        params: [transactionParameters],
                    }).then((data) => {
                        console.log(data)
                    }).catch((err) => {
                        console.log(err)
                    })
            })


            
            
        } else {
            console.log("MetaMask not installed!")
        }

    }
    
    render() {

        return (
            <div>
                <br/>
                MetaMask test stuff here...
                 <br/>
                <button onClick={this.handleClick}>Connect to MetaMask</button>
            </div>
        );
    }
}

export default MetaMaskTests;