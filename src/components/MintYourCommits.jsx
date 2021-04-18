import React, { Component } from 'react'

import socialMediaAuth from '../service/auth';

import { getOffersByCommitter } from '../utils/backendApi'


class MintYourCommits extends Component {
    state = {
        isGithubAuthenticated: false,
        committerData: {},
        bidsData: [],
    }

    handleOnClick = () => {
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
                        bidsData: data
                    }
                })
            })
    }

    render() {
        if (!this.state.isGithubAuthenticated) {
            return (
                <div>
                    <button onClick={() => this.handleOnClick()}>Login to Github</button>
                </div>
                
            )
        } else {
            const committerUsername = this.state.committerData.additionalUserInfo.username
            const committerEmailAddress = this.state.committerData.user.email
            const { bidsData } = this.state
            return (
                <div>
                    <p>Logged in</p>
                    <p>Hi {committerUsername}</p>
                    <p>Email address: {committerEmailAddress}</p>
                    <table>
                          <tr>
                            <th>Commit URL</th>
                            <th>Bid amount</th>
                            <th>Mint commit</th>
                        </tr>
                        {bidsData.map((bid) => {
                            return (
                                <tr key={bid.bid_id}>
                                    <td><a href={bid.commit_url} target="_blank" rel="noreferrer">{bid.commit_message}</a></td>
                                    <td>{bid.support_amount_in_ether}eth</td>
                                    <td><button>Accept bid and mint</button></td>
                                </tr>
                            )
                        })}
                    </table>
                </div>
            )
        }
    }
}

export default MintYourCommits;