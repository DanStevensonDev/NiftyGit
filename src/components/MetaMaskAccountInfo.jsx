import React, { Component } from 'react';
import MakeOffer from './MakeOffer'

import Web3 from 'web3'


class MetaMaskAccountInfo extends Component {
    state = {
        web3Enabled: false,
        userBlockchainDataLoaded: false,
        supporterAccountAddress: "",
        chainId: -1,
    }

    async componentDidMount() {
        await this.loadWeb3()
    
        // loads existing data on blockchain 
        await this.loadBlockchainData()
    }

    async loadWeb3() {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum)

            await window.ethereum.enable()
            this.setState({web3Enabled: true})
        }
    
        else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider)
            this.setState({web3Enabled: true})
        }
    }
    
    async loadBlockchainData() {
        if (this.state.web3Enabled) {
            const web3 = window.web3
            // Load account of current browser user
            const accounts = await web3.eth.getAccounts()
    
            const chainId = await web3.eth.getChainId()
            
            this.setState(() => {
                return {
                    userBlockchainDataLoaded: true,
                    supporterAccountAddress: accounts[0],
                    chainId: chainId
                }
            })
        }
    }
    
    render() {
        const { userBlockchainDataLoaded, supporterAccountAddress, chainId } = this.state
        const concatAccount = supporterAccountAddress.substr(-6) + "..." + supporterAccountAddress.substr(supporterAccountAddress.length - 4)
        
        if (userBlockchainDataLoaded && chainId === 1) {
            return (
                <div>
                    <p>{concatAccount}</p>
                    <p>Connected on the Etherem Mainnet</p>
                    <MakeOffer chainId={chainId}/>
                </div>
            );
        } else if (userBlockchainDataLoaded) {
            return (
                <div>
                    <p>{concatAccount}</p>
                    <p>Connected on Chain ID {chainId}. Connect on the Ethereum Mainnet to use NiftyGit.</p>
                    <MakeOffer chainId={chainId}/>
                </div>
            )
        } else {
            return (
                <div>
                    <p>MetaMask (or other crypto wallet) account not found. Connect to your wallet browser extension or <a href="https://metamask.io/" target="_blank" rel="noreferrer">sign up to MetaMask</a>.</p>
                    <MakeOffer chainId={chainId}/>
                </div>
            )
        }
    }
}

export default MetaMaskAccountInfo;