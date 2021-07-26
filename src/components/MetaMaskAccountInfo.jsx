import React, { Component } from 'react';

import Web3 from 'web3'

import MakeOffer from './MakeOffer'

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
        const concatAccount = supporterAccountAddress.substr(0, 6) + "..." + supporterAccountAddress.substr(-4)
        
        if (userBlockchainDataLoaded && chainId === 4) {
            return (
                <div>
                    <h3>You are connected to account {concatAccount} on the Rinkeby Testnet.</h3>
                    <MakeOffer chainId={chainId}/>
                </div>
            );
        } else if (userBlockchainDataLoaded && chainId === 1) {
            return (
                <div>
                    <h3 className="network-error">You are connected to account {concatAccount} on the Ethereum Mainnet.</h3>
                    <h3 className="network-error">NiftyGit is in Beta mode and you should not use "real" Ether.</h3>
                    <h3 className="network-error">Connect on the Rinkeby Testnet through your crypto wallet and refresh this page to use NiftyGit.</h3>
                    <MakeOffer chainId={chainId}/>
                </div>
            )
        } else if (userBlockchainDataLoaded) {
            return (
                <div>
                    <h3 className="network-error">You are connected to account {concatAccount} on Chain ID {chainId}.</h3>
                    <h3 className="network-error">NiftyGit is in Beta mode and you should not use "real" Ether.</h3>
                    <h3 className="network-error">Connect on the Rinkeby Testnet through your crypto wallet and refresh this page to use NiftyGit.</h3>
                    <MakeOffer chainId={chainId}/>
                </div>
            )
        } else {
            return (
                <div>
                    <h3 className="network-error">You are not connected to a crypto wallet (e.g. MetaMask).</h3>
                    <h3 className="network-error">Connect to your wallet's <strong>desktop</strong> browser extension or <a href="https://metamask.io/download.html" target="_blank" rel="noreferrer">get the MetaMask browser extension</a>.</h3>
                    <MakeOffer chainId={chainId}/>
                </div>
            )
        }
    }
}

export default MetaMaskAccountInfo;