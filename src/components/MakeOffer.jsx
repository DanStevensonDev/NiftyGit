import React, { Component } from 'react';

import {validateFormValues} from '../utils/validateFormValues'
import { postCommitComment } from '../utils/api'
import { getCommit } from '../utils/getCommit'
import { getOffersByCommitSha, postOffer, updateExceededOffer } from '../utils/backendApi'

import { TextField, Button } from "@material-ui/core"

const {REACT_APP_ETHER_ESCROW_ADDRESS} = process.env

class MakeOffer extends Component {
    state = {
        commitUrl: "",
        offerAmountInEth: 0,
        commitData: null,
        isMetaMaskInstalled: null,
        transactionConfirmed: null,
        supporterAccountAddress: "",
        transactionHash: "",
        transactionTime: 0,
        commitCommentPosted: null,
        transactionSuccessOrErrorMessage: "",
    }

    handleMakeOffer = async (event) => {
        // prevent default form submission before validation
        event.preventDefault()
        
        const {offerAmountInEth, commitUrl, transactionSuccessOrErrorMessage, commitData} = this.state

        // 1 - validate form data
        const formValidationResponse = await validateFormValues(offerAmountInEth, commitUrl)
        this.setState(() => {
            return {
                transactionSuccessOrErrorMessage: formValidationResponse
            }
        })
        

        // 2 - if no validation error, get commit data
        if (transactionSuccessOrErrorMessage === "") {

            // set loading message
            this.setState(() => {
                return {
                    transactionSuccessOrErrorMessage: "Getting commit data..."
                }
            })

            const commitUrlDirectories = commitUrl.split("/").reverse()
    
            const owner = commitUrlDirectories[3]
            const repo = commitUrlDirectories[2]
            const ref = commitUrlDirectories[0]

            // get commit data from GitHub
            try {
                const commitData = await getCommit(owner, repo, ref)
                
                this.setState(() => {
                    return {
                        commitData: commitData,
                    }
                })

                // 3 - if no getCommit error, get offer data
                try {
                    const commitSha = this.state.commitData.sha
                    const offersData = await getOffersByCommitSha(commitSha)
                    
                    // check if open offer or previously accepted offer exists
                    let openOffer = null
                    let previousOfferAccepted = null

                    if (offersData.length > 0) {
                        for (let i = 0; i < offersData.length; i++) {
                            if (offersData[i].offerStatus === 8 || offersData[i].offerStatus === 9) {
                                previousOfferAccepted = true
                            }

                            if (offersData[i].offerStatus === 1) {
                                openOffer = offersData[i]
                            }
                        }
                    }

                    // set error message if offer already accepted or higher offer
                    if (previousOfferAccepted) {
                        this.setState(() => {
                            return {
                                transactionSuccessOrErrorMessage: "An offer has already been accepted for this commit and it is no longer available. Try making an offer on a different commit."
                            }
                        })
                    } else if (openOffer && (openOffer.offerAmountInEth >= this.state.offerAmountInEth)) {
                        this.setState(() => {
                            return {
                                transactionSuccessOrErrorMessage: `There is an open offer of ${openOffer.offerAmountInEth} ETH for this commit. Enter an amount larger than ${openOffer.offerAmountInEth} ETH to make an offer.`
                            }
                        })
                    } else {

                        // 3a - if open offer (which is now exceeded) patch the previous open offer to indicate a larger offer has been made
                        if (openOffer) {
                            try {
                                await updateExceededOffer(openOffer.offerId)
                            }
    
                            // catch patch previous offer error
                            catch (err){
                                console.log(err)
                            }
                        }

                        const offerInEth = this.state.offerAmountInEth
                        const offerInGwei = offerInEth * 1000000000
                        const offerInWei = offerInGwei * 1000000000
                        const offerInWeiHex = offerInWei.toString(16)
        
                        this.setState(() => {
                            return {
                                // set wallet instructions message
                                transactionSuccessOrErrorMessage: "Confirm the transaction in your crypto wallet. Your wallet browser extension should open automatically."
                            }
                        })
        
                        const transactionParameters = {
                            from: window.ethereum.selectedAddress,
                            to: REACT_APP_ETHER_ESCROW_ADDRESS,
                            value: offerInWeiHex,
                        }
                           
                        // 4 - create escrow transfer transaction
                        try {
                            const transactionHash = await window.ethereum.request({
                                method: 'eth_sendTransaction',
                                params: [transactionParameters],
                            })

                            this.setState(() => {
                                return {
                                    supporterAccountAddress: window.ethereum.selectedAddress,
                                    transactionHash: transactionHash,
                                    transactionTime: Date.now(),
                                    transactionSuccessOrErrorMessage: "Contacting the committer via GitHub... Please wait a few seconds..."
                                }
                            })

                            // 5 - post commit data and transaction data to DB
                            try {
                                const { commitData,
                                    offerAmountInEth,
                                    supporterAccountAddress,
                                    transactionHash,
                                    transactionTime
                                } = this.state
    
                                const committerUsername = commitData.committer.login
                                const commitSha = commitData.sha
                    
                                const transactionData = {
                                    committerUsername,
                                    commitSha,
                                    offerStatus: 1,
                                    commitData,
                                    offerAmountInEth,
                                    transactionTime,
                                    transactionHash,
                                    supporterAccountAddress,
                                }
    
                                await postOffer(transactionData)

                                // 6 - post offer comment to GitHub
                                try {
                                    await postCommitComment(owner, repo, ref, committerUsername, offerAmountInEth, transactionHash)
                                    this.setState(() => {
                                        return {
                                            transactionSuccessOrErrorMessage: "Transaction successful! The committer has been notified with a comment on GitHub."
                                        }
                                    })
                                }

                                // catch error posting comment to GitHub
                                catch (err){
                                    console.log(err)
                                    this.setState(() => {
                                        return {
                                            transactionSuccessOrErrorMessage: "Transaction successful! The committer will be notified by email."
                                        }
                                    })
                                }
                            }

                            // catch post commit data and transaction data to DB error
                            catch (err){
                                console.log(err)
                                this.setState(() => {
                                    return {
                                        transactionSuccessOrErrorMessage: "Error posting your offer to our database. Please get in touch with NiftyGit on Twitter."
                                    }
                                })
                            }
                        }

                        // catch escrow transfer transaction error
                        catch (err){
                            console.log(err)
                            this.setState(() => {
                                return {
                                    transactionSuccessOrErrorMessage: "Transaction unsuccessful. No ether has been transferred from your wallet. Please check your wallet and try again."
                                }
                            })
                        }
                    }

                }
                // handle getOffer error
                catch (err) {
                    console.log(err)
                    this.setState(() => {
                        return {
                            transactionSuccessOrErrorMessage: "Connection error. Please try again."
                        }
                    })
                }
            }
            
            // handle getCommit error
            catch (err) {
                console.log(err)
                this.setState(() => {
                    return {
                        transactionSuccessOrErrorMessage: "Error getting commit data from GitHub. Check that the commit is public and try again."
                    }
                })
            }
        }
    }

    handleChange = (event) => {
        const key = event.target.name
        const value = event.target.value
        this.setState(() => {
            return {
                [key]: value,
                transactionSuccessOrErrorMessage: "",
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