import React, { Component } from 'react'

import socialMediaAuth from '../service/auth';

import { getOffersByCommitter } from '../utils/backendApi'

import Web3 from 'web3'
import NiftyGit from '../abis/NiftyGit.json'

const { REACT_APP_ETHER_ESCROW_ADDRESS } = process.env
console.log(REACT_APP_ETHER_ESCROW_ADDRESS)


class MintMyCommits extends Component {
    state = {
        isGithubAuthenticated: false,
        committerData: {},
        offersData: [],
        committerAccount: "",
    }

    handleGithubLogin = () => {
        socialMediaAuth()
            .then((userData) => {
            this.setState(() => {
                return {
                    isGithubAuthenticated: true,
                    committerData: userData
                }
            })
            }).then(() => {
                const committerUsername = this.state.committerData.additionalUserInfo.username
                return getOffersByCommitter(committerUsername)
            }).then(({data}) => {
                this.setState(() => {
                    return {
                        offersData: data
                    }
                })
            })
    }

    async componentWillMount() {
        await this.loadWeb3()
    
        // loads existing data on blockchain 
        await this.loadBlockchainData()
    }

    async loadWeb3() {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable()
        }
        else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider)
        }
        else {
            window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
    }

    async loadBlockchainData() {
        const web3 = window.web3
        // Load account of current browser user
        const accounts = await web3.eth.getAccounts()
        this.setState({ committerAccount: accounts[0] })


        // gets network ID - with Ganache set as host in config, networkId will be 5777
        const networkId = await web3.eth.net.getId()
        console.log(networkId)
        
        // available to check chainId
        // Can be different to network ID in case of Ethereum Classic(vs Mainnet)
        // const chainId = await web3.eth.getChainId()
        // console.log(chainId)

        // checks abi to make sure it has network information
        const networkData = NiftyGit.networks[networkId]
        if(networkData) {
        const abi = NiftyGit.abi

        // setting contract address as address in abi
        const address = networkData.address
        const contract = new web3.eth.Contract(abi, address)
        this.setState({ contract })

        // checks totalSupply (number of colours minted)
        // const totalSupply = await contract.methods.totalSupply().call()
        // this.setState({ totalSupply })

        // Load NiftyGit tokens
        // for (var i = 1; i <= totalSupply; i++) {
        //     const color = await contract.methods.colors(i - 1).call()
        //     this.setState({
        //     colors: [...this.state.colors, color]
        //     })
        // }
        } else {
        window.alert('Smart contract not deployed to detected network.')
        }
    }

    handleMintCommit = (commitSHA, supporterAccountAddress, offerAmountInEth) => {
        // calculate offer in Hex needed for web3 request function
        const offerInEth = offerAmountInEth
        const offerInGwei = offerInEth * 1000000000
        const offerInWei = offerInGwei * 1000000000
        const offerInWeiHex = offerInWei.toString(16)
        
        console.log(commitSHA, "commitSHA")
        console.log(REACT_APP_ETHER_ESCROW_ADDRESS, "REACT_APP_ETHER_ESCROW_ADDRESS")
        console.log(supporterAccountAddress, "supporterAccountAddress")
        console.log(window.ethereum.selectedAddress, "committerAccountAddress")
        console.log(offerInWeiHex, "offerInWeiHex")

        const transactionParameters = {
            // ISSUE: unable to initiate transaction from escrow account to current user account
            // from: REACT_APP_ETHER_ESCROW_ADDRESS,
            // to: window.ethereum.selectedAddress,

            // POC: transaction from current user to another account works
            from: window.ethereum.selectedAddress,
            to: REACT_APP_ETHER_ESCROW_ADDRESS,

            value: offerInWeiHex,
        }
            
        return window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [transactionParameters],
        }).catch((err) => {
            console.log(err)
            return err
        
        // check that no error code returned
        // therefore transaction confirmed
        // set state to transaction data
        }).then((data) => {
            console.log(data)
        })

        // this.state.contract.methods.mint(commitSHA).send({ from: supporterAccountAddress })
        //     .once('receipt', (receipt) => {
        //         console.log(receipt)
        //     })
    }

    render() {
        if (!this.state.isGithubAuthenticated) {
            return (
                <div>
                    <button onClick={() => this.handleGithubLogin()}>Login to Github</button>
                </div>
                
            )
        } else {
            const committerUsername = this.state.committerData.additionalUserInfo.username
            const committerEmailAddress = this.state.committerData.user.email
            const { offersData } = this.state

            return (
                <div>
                    <p>Logged in</p>
                    <p>Hi {committerUsername}</p>
                    <p>Email address: {committerEmailAddress}</p>
                    <table>
                        <thead>
                          <tr>
                            <th>Commit URL</th>
                            <th>Offer amount</th>
                            <th>Mint commit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {offersData.map((offer) => {
                                console.log(offer)
                                const { offerId, supporterAccountAddress, offerAmountInEth, commitData } = offer
                                const commitSHA = commitData.sha
                                return (
                                    <tr key={offerId}>
                                        <td><a href={commitData.html_url} target="_blank" rel="noreferrer">{commitData.commit.message}</a></td>
                                        <td>{offerAmountInEth}eth</td>
                                        <td><button onClick={() => this.handleMintCommit(commitSHA, supporterAccountAddress, offerAmountInEth)}>Accept offer and mint</button></td>
                                    </tr>
                                )
                        })}
                        </tbody>
                    </table>
                </div>
            )
        }
    }
}

export default MintMyCommits;