import React, { Component } from 'react';

import { getCommit, postCommitComment } from '../utils/api'

const {REACT_APP_ETHER_ESCROW_ADDRESS} = process.env

class CommitFetcher extends Component {
    state = {
        commitUrl: "",
        offerAmount: 0,
        commitDataReturned: null,
        commitBidsData: [],
        isMetaMaskInstalled: null,
        transactionConfirmed: false,
        supporterEmailAddress: "",
        supporterTransactionAddress: "",
        transactionHash: "",
        transactionTime: 0,
        commitCommentPosted: false,
    }

    handleMakeOffer = (event) => {
        event.preventDefault()
        const { commitUrl } = this.state

        const commitUrlDirectories = commitUrl.split("/").reverse()

        const owner = commitUrlDirectories[3]
        const repo = commitUrlDirectories[2]
        const ref = commitUrlDirectories[0]

        // get commit data from GitHub
        return getCommit(owner, repo, ref)
            .then((commitData) => {
                this.setState(() => {
                    return {
                        commitDataReturned: commitData,
                    }
                })
            }).catch((err) => {
                return err 
            }).then(() => {
                // calculate offer in Hex needed for web3 request function
                const offerInEth = this.state.offerAmount
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
                                        supporterTransactionAddress: window.ethereum.selectedAddress,
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
                // if transaction confirmed, post comment to GitHub @committerUsername
                if (this.state.transactionConfirmed) {
                    const committerUsername = this.state.commitDataReturned.committer.login
                    return postCommitComment(owner, repo, ref, committerUsername)
                        .then(() => {
                        this.setState(() => {
                            return {
                                commitCommentPosted: true,
                            }
                        })
                    })
                }
            })
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
                        <input onChange={this.handleChange} type="text" name="commitUrl" id="commitUrl" required/><br/><br/>
                        
                        <label htmlFor="offerAmount">Your offer in Ether (minimum offer = 0.005 eth)</label><br/>
                        <input onChange={this.handleChange} type="text" name="offerAmount" id="offerAmount" required/><br/><br/>
                        
                        <label htmlFor="supporterEmailAddress">Your email address (this is where we will notify you if your offer is accepted)</label><br/>
                        <input onChange={this.handleChange} type="text" name="supporterEmailAddress" id="supporterEmailAddress" required/><br/><br/>
                        
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