import React, { Component } from 'react';

import { getCommit, postCommitComment } from '../utils/api'


class CommitFetcher extends Component {

    state = {
        commitUrl: "",
        commitDataRequested: false,
        commitReturnObject: [],
        commitCommentPosted: false,
    }

    handleGetData = (event) => {
        console.log(event)
        event.preventDefault()
        const { commitUrl } = this.state

        const commitUrlDirectories = commitUrl.split("/").reverse()

        const owner = commitUrlDirectories[3]
        const repo = commitUrlDirectories[2]
        const ref = commitUrlDirectories[0]

        return getCommit(owner, repo, ref).then((commitData) => {
            this.setState(() => {
                return {
                    commitDataRequested: true,
                    commitReturnObject: commitData
                }
            })
            // console.log(this.state)
        })
    }

    handlePostComment = (event) => {
        console.log(event)
        event.preventDefault()
        const { commitUrl } = this.state

        const commitUrlDirectories = commitUrl.split("/").reverse()

        const owner = commitUrlDirectories[3]
        const repo = commitUrlDirectories[2]
        const ref = commitUrlDirectories[0]

        return postCommitComment(owner, repo, ref)
            .then(() => {
            this.setState(() => {
                return {
                    commitCommentPosted: true,
                }
            })
            console.log(this.state)
        })
    }

    handleChange = (event) => {
        const commitUrl = event.target.value
        this.setState({ commitUrl })
    }

    render() {
        const { commitDataRequested, commitReturnObject } = this.state

        if (!commitDataRequested) {
            return (
                <div>
                    <form onSubmit={this.handleGetData} action="">
                        <label htmlFor="github-commit-url">Github commit URL</label>
                        <input onChange={this.handleChange} type="text" name="github-commit-url" id="github-commit-url"/>
                        <button type="submit" id="get-data">Get commit data</button>
                    </form><br/>
                    <form onSubmit={this.handlePostComment} action="">
                        <label htmlFor="github-commit-url">Github commit URL</label>
                        <input onChange={this.handleChange} type="text" name="github-commit-url" id="github-commit-url"/>
                        <button type="submit" id="post-comment">Notify committer</button>
                    </form>
                </div>
            )
        } else {
            return (
                <div>
                    <form onSubmit={this.handleSubmit} action="">
                        <label htmlFor="github-commit-url">Github commit URL</label>
                        <input onChange={this.handleChange} type="text" name="github-commit-url" id="github-commit-url"/>
                        <button type="submit">Get commit data</button>
                    </form>
                    <p>Committer email address: {commitReturnObject[0].commit.author.email}</p>
                </div>
            )
        }

    }
}

export default CommitFetcher;