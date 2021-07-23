import React, { Component } from 'react';

import { postCommitComment } from '../utils/api'
import { getCommit } from '../utils/getCommit'
import { postOffer } from '../utils/backendApi'

import { TextField, Button } from "@material-ui/core"

const {REACT_APP_ETHER_ESCROW_ADDRESS} = process.env

class MakeOffer extends Component {
    state = {
        commitUrl: "",
        offerAmountInEth: 0,
        commitData: null,
        isMetaMaskInstalled: null,
        transactionConfirmed: false,
        supporterEmailAddress: "",
        supporterAccountAddress: "",
        transactionHash: "",
        transactionTime: 0,
        commitCommentPosted: null,
        transactionSuccessOrErrorMessage: "",
    }

    componentDidUpdate() {
        if (this.state.commitCommentPosted === true) {
            this.setState(() => {
                return {
                    // reset commitCommentPosted to avoid re-calling setState
                    commitCommentPosted: null,
                    transactionSuccessOrErrorMessage: "Transaction successful! The committer has been notified with a comment on GitHub."
                }
            })
        }
    }

    handleMakeOffer = (event) => {
        // initial form validation
        // check connected to Ethereum Mainnet
        if (this.props.chainId !== 4) {
            alert("You need to connect to the Rinkeby Testnet to make an offer on a commit")

        // check URL
        } else if (!this.state.commitUrl.startsWith("https://github.com/")) {
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
            
        this.setState(() => {
            return {
                // set wallet popup message
                transactionSuccessOrErrorMessage: "Confirm the transaction in your crypto wallet. Your wallet browser extension should open automatically."
            }
        })

        const { commitUrl } = this.state

        const commitUrlDirectories = commitUrl.split("/").reverse()

        const owner = commitUrlDirectories[3]
        const repo = commitUrlDirectories[2]
        const ref = commitUrlDirectories[0]


        // get commit data from GitHub
        return getCommit(owner, repo, ref)
            .then((commitData) => {
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
                if (window.ethereum) {
                    // create request to escrow account
                    return window.ethereum.request({ method: 'eth_requestAccounts' })
                        .then(() => {
                        const transactionParameters = {
                            from: window.ethereum.selectedAddress,
                            to: REACT_APP_ETHER_ESCROW_ADDRESS,
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
                    this.setState(() => {
                        return {
                            // set transaction unsuccessful message
                            transactionSuccessOrErrorMessage: "Transaction unsuccessful. No ether has been transferred from your wallet. Please check your wallet and try again."
                        }
                    })
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

                const commitDataUrl = `https://api.github.com/repos/${owner}/${repo}/commits/${ref}`
                
                const transactionData = {
                    offerStatus: "Awaiting response from committer",
                    commitDataUrl,
                    committerUsername,
                    offerAmountInEth,
                    supporterAccountAddress,
                    supporterEmailAddress,
                    transactionHash,
                    transactionTime
                }

                return postOffer(transactionData).then((data) => {
                    console.log(data)
                }).catch((err) => {
                    return err
                }).then(() => {
                    // if transaction confirmed, post comment to GitHub @committerUsername
                    if (this.state.transactionConfirmed) {
                        return postCommitComment(owner, repo, ref, committerUsername, offerAmountInEth, transactionHash)
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

        if (this.props.chainId === 4) {
            return (
                <form onSubmit={this.handleMakeOffer} action="">
                    <label htmlFor="commitUrl">Github commit URL</label><br />
                    <TextField onChange={this.handleChange} variant="filled" style={{ width: "95%" }} type="text" name="commitUrl" id="commitUrl" required /><br /><br />
                    
                    <label htmlFor="offerAmountInEth">Your offer in Ether (minimum offer = 0.005 eth)</label><br />
                    <TextField onChange={this.handleChange} variant="filled" type="text" name="offerAmountInEth" id="offerAmountInEth" required /><br /><br />
                    
                    <Button variant="contained" type="submit" id="get-data">Open crypto wallet to make offer</Button>

                    {/* Display transaction success/error message */}
                    <p>{ this.state.transactionSuccessOrErrorMessage }</p>
                </form>
            )
        } else if (this.props.chainId === -1) {
            return (
                <form onSubmit="" action="">
                    <label htmlFor="commitUrl">Github commit URL</label><br />
                    <TextField onChange={this.handleChange} variant="filled" style={{ width: "95%" }} type="text" name="commitUrl" id="commitUrl" disabled /><br /><br />
                    
                    <label htmlFor="offerAmountInEth">Your offer in Ether (minimum offer = 0.005 eth)</label><br />
                    <TextField onChange={this.handleChange} variant="filled" type="text" name="offerAmountInEth" id="offerAmountInEth" disabled /><br /><br />
                    
                    <Button variant="contained" type="submit" id="get-data" disabled>Download MetaMask wallet to use NiftyGit</Button>
                </form>
            )
        } else {
            return (
                <form onSubmit="" action="">
                    <label htmlFor="commitUrl">Github commit URL</label><br/>
                    <TextField onChange={this.handleChange} variant="filled" style={{ width: "95%"}} type="text" name="commitUrl" id="commitUrl" disabled /><br/><br/>
                    
                    <label htmlFor="offerAmountInEth">Your offer in Ether (minimum offer = 0.005 eth)</label><br/>
                    <TextField onChange={this.handleChange} variant="filled" type="text" name="offerAmountInEth" id="offerAmountInEth" disabled/><br/><br/>
                    
                    <Button variant="contained" type="submit" id="get-data" color="secondary" disabled>Connect your wallet to the Rinkeby Testnet</Button>
                </form>
            )
        }
    }
}

export default MakeOffer;