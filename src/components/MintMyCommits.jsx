import React, { Component } from 'react'

import socialMediaAuth from '../service/auth';

import { getOffersByCommitter, getOffersByCommitterAndStatus, acceptOffer } from '../utils/backendApi'

import { Button } from "@material-ui/core"
class MintMyCommits extends Component {
    state = {
        isGithubAuthenticated: false,
        committerData: {},
        offersData: null,
        committerAccount: "",
    }

    handleGithubLogin = async () => {
        try {
            const userData = await socialMediaAuth()
            this.setState(() => {
                return {
                    isGithubAuthenticated: true,
                    committerData: userData
                }
            })
            
            // fetch open offers
            try {
                const committerUsername = this.state.committerData.additionalUserInfo.username
                
                const openOffers = await getOffersByCommitter(committerUsername)
                
                this.setState(() => {
                    return {
                        offersData: openOffers
                    }
                })
            }
        
            // catch error fetching open offers
            catch (err){
                console.log(err)
            }
        }

        // catch GitHub login error
        catch (err) {
            console.log(err)
        }            
    }

    handleAcceptOffer = (offerId) => {
        acceptOffer(offerId)
            .then(() => {
                const committerUsername = this.state.committerData.additionalUserInfo.username
                return getOffersByCommitter(committerUsername)
            }).then((data) => {
                this.setState(() => {
                    return {
                        offersData: data
                    }
                })
            })
    }

    render() {
        const { isGithubAuthenticated, offersData } = this.state

        if (!isGithubAuthenticated) {
            return (
                <div>
                    <Button variant="contained" onClick={() => this.handleGithubLogin()}>Login to Github</Button>
                </div>
                
            )
        } else if (!offersData) {
            return (
                <p>Loading offers data... Please wait... </p>
            )
        } else {
            const committerUsername = this.state.committerData.additionalUserInfo.username
            const committerEmailAddress = this.state.committerData.user.email

            return (
                <div>
                    <p>Logged in</p>
                    <p>Hi {committerUsername}</p>
                    <p>Email address: {committerEmailAddress}</p>
                    <table id="commit-offers">
                        <thead>
                          <tr>
                            <th>Repo</th>
                            <th>Commit</th>
                            <th>Offer</th>
                            <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {offersData.map((offer) => {
                                const { offerId, supporterAccountAddress, offerAmountInEth, commitData, offerStatus } = offer
                                const repo = commitData.html_url.split("https://github.com/")[1].split("/commit")[0]
                                const commitSHA = commitData.sha
                                if (offerStatus === 1) {
                                    return (
                                        <tr key={offerId}>
                                            <td>{repo}</td>
                                            <td><a href={commitData.html_url} target="_blank" rel="noreferrer">{commitData.commit.message}</a></td>
                                            <td>{offerAmountInEth}ETH</td>
                                            <td><Button variant="contained" onClick={() => this.handleAcceptOffer(offerId)}>Accept offer and mint</Button></td>
                                        </tr>
                                    )
                                } else {
                                    let committersOfferStatus

                                    switch (offerStatus) {
                                        case 2:
                                            committersOfferStatus = "Offer exceeded"
                                            break;
                                        case 3:
                                            committersOfferStatus = "Offer exceeded"
                                            break;
                                        case 4:
                                            committersOfferStatus = "Offer expired"
                                            break;
                                        case 5:
                                            committersOfferStatus = "Offer expired"
                                            break;
                                        case 6:
                                            committersOfferStatus = "You rejected the offer"
                                            break;
                                        case 7:
                                            committersOfferStatus = "You rejected the offer"
                                            break;
                                        case 8:
                                            committersOfferStatus = "Offer accepted - awaiting commit minting and transfer of offer funds."
                                            break;
                                        case 9:
                                            committersOfferStatus = "Commit minted - offer amount transferred to your account and NFT transferred to supporter"
                                            break;
                                        default:
                                            committersOfferStatus = "Offer expired"
                                    }

                                    return (
                                        <tr key={offerId}>
                                            <td>{repo}</td>
                                            <td><a href={commitData.html_url} target="_blank" rel="noreferrer">{commitData.commit.message}</a></td>
                                            <td>{offerAmountInEth}ETH</td>
                                            <td>{ committersOfferStatus }</td>
                                        </tr>
                                    )
                                }
                        })}
                        </tbody>
                    </table>
                </div>
            )
        }
    }
}

export default MintMyCommits;