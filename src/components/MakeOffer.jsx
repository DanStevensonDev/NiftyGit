import React, { Component } from 'react';

import { getCommit, postCommitComment } from '../utils/api'
import { postOffer } from '../utils/backendApi'

const {REACT_APP_ETHER_ESCROW_ADDRESS} = process.env

class CommitFetcher extends Component {
    state = {
        isFormDisabled: false,
        commitUrl: "",
        offerAmountInEth: 0,
        commitData: null,
        isMetaMaskInstalled: null,
        transactionConfirmed: false,
        supporterEmailAddress: "",
        supporterAccountAddress: "",
        transactionHash: "",
        transactionTime: 0,
        commitCommentPosted: false,
    }

    componentDidMount() {
        // const { chainId } = this.props

        // if (chainId !== 1) {
        //     // handle not connected to Mainnet
        // }
    }

    handleMakeOffer = (event) => {
        
        // initial form validation
        // check URL
        if (!this.state.commitUrl.startsWith("https://github.com/")) {
            alert("Enter the full commit URL, starting with \"https://github.com\"")
        
        // check offer is a number
        } else if (!Number(this.state.offerAmountInEth)) {
            alert("Your offer must be a number")

        // check offer is larger than minimum
        } else if (this.state.offerAmountInEth < 0.005) {
            alert("Your offer must be higher than 0.005 Eth")

        // check if an email address is entered, it meets basic requirements
        } else if (this.state.supporterEmailAddress && 
            (!this.state.supporterEmailAddress.includes("@") ||
            !this.state.supporterEmailAddress.includes("."))) {
                alert("Enter a valid email address or leave blank")
        } else {
        
        event.preventDefault()
        const { commitUrl } = this.state

        const commitUrlDirectories = commitUrl.split("/").reverse()

        const owner = commitUrlDirectories[3]
        const repo = commitUrlDirectories[2]
        const ref = commitUrlDirectories[0]


        // get commit data from GitHub
        return getCommit(owner, repo, ref)
            .then((commitData) => {
                console.log(commitData)
                this.setState({ commitData })
            }).catch((err) => {
                return err 
            }).then(() => {
                // calculate offer in Hex needed for web3 request function
                const offerInEth = this.state.offerAmountInEth
                const offerInGwei = offerInEth * 1000000000
                const offerInWei = offerInGwei * 1000000000
                const offerInWeiHex = offerInWei.toString(16)

                // check MetaMask is installed
                if (typeof window.ethereum !== 'undefined') {
                    // create request to escrow account
                    return window.ethereum.request({ method: 'eth_requestAccounts' })
                        .then(() => {
                        const transactionParameters = {
                            to: REACT_APP_ETHER_ESCROW_ADDRESS,
                            from: window.ethereum.selectedAddress,
                            value: offerInWeiHex,
                        }
                            
                        return window.ethereum.request({
                            method: 'eth_sendTransaction',
                            params: [transactionParameters],
                        }).catch((err) => {
                            return err
                        
                        // check that no error code returned
                        // therefore transaction confirmed
                        // set state to transaction data
                        }).then((data) => {
                            if (!data.code) {
                                this.setState(() => {
                                    const transactionTimeUnix = Date.now()
                                    return {
                                        isMetaMaskInstalled: true,
                                        transactionConfirmed: true,
                                        supporterAccountAddress: window.ethereum.selectedAddress,
                                        transactionHash: data,
                                        transactionTime: transactionTimeUnix
                                    }
                                })
                            }
                        }).catch((err) => {
                            return err
                        })
                        })
                } else {
                    // set state if MetaMask not installed
                    return this.setState(() => {
                        return {
                            isMetaMaskInstalled: false,
                        }
                    })
                }
            }).then(() => {
                if (!this.state.transactionConfirmed) {
                    console.log("transaction abandoned")
                } else {
                    // postOffer
                const { commitData,
                    offerAmountInEth,
                    supporterAccountAddress,
                    supporterEmailAddress,
                    transactionHash,
                    transactionTime
                } = this.state

                const committerUsername = commitData.committer.login
                
                const transactionData = {
                    committerUsername,
                    commitData,
                    offerAmountInEth,
                    supporterAccountAddress,
                    supporterEmailAddress,
                    transactionHash,
                    transactionTime
                }
                
                console.log(transactionData)

                return postOffer(transactionData).then((data) => {
                    console.log(data)
                }).catch((err) => {
                    return err
                }).then(() => {
                    // if transaction confirmed, post comment to GitHub @committerUsername
                    if (this.state.transactionConfirmed) {
                        return postCommitComment(owner, repo, ref, committerUsername)
                            .then(() => {
                            this.setState(() => {
                                return {
                                    commitCommentPosted: true,
                                }
                            })
                        })
                    }
                }).catch((err) => {
                    return err
                })
            }
        })
        }   
    }

    handleChange = (event) => {
        const key = event.target.name
        const value = event.target.value
        this.setState(() => {
            return {
                [key]: value
            }
        })
    }

    render() {
        const {transactionConfirmed} = this.state
        if (!transactionConfirmed) {
            return (
                <div>
                    <form onSubmit={this.handleMakeOffer} action="">
                        <label htmlFor="commitUrl">Github commit URL</label><br/>
                        <input onChange={this.handleChange} type="text" name="commitUrl" id="commitUrl" required /><br/><br/>
                        
                        <label htmlFor="offerAmountInEth">Your offer in Ether (minimum offer = 0.005 eth)</label><br/>
                        <input onChange={this.handleChange} type="text" name="offerAmountInEth" id="offerAmountInEth" required/><br/><br/>
                        
                        <label htmlFor="supporterEmailAddress">Your email address (Optional) This is where we will notify you if your offer is accepted; otherwise your wallet will automatically receive the NFT or returned offer.</label><br/>
                        <input onChange={this.handleChange} type="text" name="supporterEmailAddress" id="supporterEmailAddress"/><br/><br/>
                        
                        <button type="submit" id="get-data">Make offer</button>
                    </form><br />
                </div>
            )
        } else {
            return (
                <div>
                    <p>Transaction successful</p>
                    <p>The committer has been notified about your offer</p>
                    <p>We will be in touch if they accept</p>
                </div>
            )
        }
    }
}

export default CommitFetcher;