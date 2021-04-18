import React, { Component } from 'react';

import { getBidByRef } from '../utils/backendApi'
import { getCommit } from '../utils/api'

import CommitBidStatus from './CommitBidStatus'



class CommitFetcher extends Component {
    state = {
        commitUrl: "",
        commitDataRequested: false,
        commitDataReturned: {},
        commitBidExists: false,
        commitBidsData: [],
    }

    handleGetData = (event) => {
        event.preventDefault()
        const { commitUrl } = this.state

        const commitUrlDirectories = commitUrl.split("/").reverse()

        const owner = commitUrlDirectories[3]
        const repo = commitUrlDirectories[2]
        const ref = commitUrlDirectories[0]

        return getCommit(owner, repo, ref)
            .then((commitData) => {
            this.setState(() => {
                return {
                    commitDataRequested: true,
                    commitDataReturned: commitData
                }
            })
            }).catch((err) => {
                return err
            })
            .then(() => {
                if (this.state.commitDataReturned.sha) {
                    return getBidByRef(ref).then((bidData) => {
                        if (bidData.length === 0) {
                            this.setState(() => {
                                return {
                                    commitBidExists: false,
                                    commitBidsData: []
                                }
                            })
                        } else {
                            this.setState(() => {
                                return {
                                    commitBidExists: true,
                                    commitBidsData: bidData
                                }
                            })
                        }
                    })
                }
            })
        

    }

    handleChange = (event) => {
        const commitUrl = event.target.value
        this.setState({ commitUrl })
    }

    render() {
        const { commitDataRequested } = this.state

        if (!commitDataRequested) {
            return (
                <div>
                    <form onSubmit={this.handleGetData} action="">
                        <label htmlFor="github-commit-url">Github commit URL</label>
                        <input onChange={this.handleChange} type="text" name="github-commit-url" id="github-commit-url"/>
                        <button type="submit" id="get-data">Get commit data</button>
                    </form><br/>
                </div>
            )

        } else {
            return (
                <div>
                    <form onSubmit={this.handleGetData} action="">
                        <label htmlFor="github-commit-url">Github commit URL</label>
                        <input onChange={this.handleChange} type="text" name="github-commit-url" id="github-commit-url"/>
                        <button type="submit" id="get-data">Get commit data</button>
                    </form><br/>
                    
                    <CommitBidStatus commitData={this.state.commitDataReturned} bidsData={this.state.commitBidsData}/>
                </div>
            )
        }
    }
}

export default CommitFetcher;