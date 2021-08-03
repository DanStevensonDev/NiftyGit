import React, { Component } from 'react'

import socialMediaAuth from '../service/auth';

import { getOffersByCommitter } from '../utils/backendApi'

import { Button } from "@material-ui/core"
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

    render() {
        if (!this.state.isGithubAuthenticated) {
            return (
                <div>
                    <Button variant="contained" onClick={() => this.handleGithubLogin()}>Login to Github</Button>
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
                    <table id="commit-offers">
                        <thead>
                          <tr>
                            <th>Repo</th>
                            <th>Commit</th>
                            <th>Offer amount</th>
                            <th>Mint commit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {offersData.map((offer) => {
                                console.log(offer)
                                const { offerId, supporterAccountAddress, offerAmountInEth, commitData } = offer
                                const repo = commitData.html_url.split("https://github.com/")[1].split("/commit")[0]
                                const commitSHA = commitData.sha
                                return (
                                    <tr key={offerId}>
                                        <td>{repo}</td>
                                        <td><a href={commitData.html_url} target="_blank" rel="noreferrer">{commitData.commit.message}</a></td>
                                        <td>{offerAmountInEth} eth</td>
                                        <td><Button variant="contained" onClick={() => this.handleMintCommit(commitSHA, supporterAccountAddress, offerAmountInEth)}>Accept offer and mint</Button></td>
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