import React, { Component } from 'react';

import { getCommit } from '../utils/getCommit'

import { TextField, Button } from "@material-ui/core"

class CheckCommitIsAvailable extends Component {
    state = {
        commitUrl: "",
    }

    checkCommitIsAvailable = (event) => {
        event.preventDefault()
        const { commitUrl } = this.state

        // TODO - error handling on the UI
        if (!commitUrl.startsWith("https://github.com/")) {
            alert("Copy and paste the URL as it appears on GitHub. For example \nhttps://github.com/octocat/Hello-World/commit/553c2077f0edc3d5dc5d17262f6aa498e69d6f8e")
        } else {
            const commitUrlEnd = commitUrl.split("https://github.com/")[1]

            const commitUrlParts = commitUrlEnd.split("/")

            const owner = commitUrlParts[0]
            const repo = commitUrlParts[1]
            const ref = commitUrlParts[3]
            
            if (owner === undefined || owner.length === 0 ||
                repo === undefined || repo.length === 0 ||
                ref === undefined || ref.length === 0){
                    alert("Copy and paste the URL as it appears on GitHub. For example \nhttps://github.com/octocat/Hello-World/commit/553c2077f0edc3d5dc5d17262f6aa498e69d6f8e")
            } else {
                // API request to get commit data (if available)
                return getCommit(owner, repo, ref)
                    .then((data) => {
                        console.log(data)
                    }).catch((err) => {
                        console.log(err)
                    })
            }
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
        return (
            <form onSubmit={this.checkCommitIsAvailable} action="">
                <label htmlFor="commitUrl">Github commit URL</label><br />
                <TextField onChange={this.handleChange} variant="filled" style={{ width: "95%" }} type="text" name="commitUrl" id="commitUrl" required /><br /><br />

                <Button variant="contained" type="submit" id="get-data">Check commit is available</Button>
            </form>
        )
    }
}

export default CheckCommitIsAvailable;