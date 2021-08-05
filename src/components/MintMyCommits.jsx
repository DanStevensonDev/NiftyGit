import React, { Component } from 'react'

import socialMediaAuth from '../service/auth';

import { getOffersByCommitter, acceptOffer } from '../utils/backendApi'

import { Button } from "@material-ui/core"
class MintMyCommits extends Component {
    state = {
        isGithubAuthenticated: false,
        committerData: {},
        offersData: null,
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

    handleAcceptOffer = (offerId) => {
        acceptOffer(offerId)
            .then(() => {
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
                            <th>Offer amount</th>
                            <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {offersData.map((offer) => {
                                const { offerId, supporterAccountAddress, offerAmountInEth, commitData, offerStatus } = offer
                                const repo = commitData.html_url.split("https://github.com/")[1].split("/commit")[0]
                                const commitSHA = commitData.sha
                                if (offerStatus === "Awaiting response from committer") {
                                    return (
                                        <tr key={offerId}>
                                            <td>{repo}</td>
                                            <td><a href={commitData.html_url} target="_blank" rel="noreferrer">{commitData.commit.message}</a></td>
                                            <td>{offerAmountInEth} eth</td>
                                            <td><Button variant="contained" onClick={() => this.handleAcceptOffer(offerId)}>Accept offer and mint</Button></td>
                                        </tr>
                                    )
                                } else {
                                    return (
                                        <tr key={offerId}>
                                            <td>{repo}</td>
                                            <td><a href={commitData.html_url} target="_blank" rel="noreferrer">{commitData.commit.message}</a></td>
                                            <td>{offerAmountInEth} eth</td>
                                            <td>{ offerStatus }</td>
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