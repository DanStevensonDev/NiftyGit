import React, { Component } from 'react'

import CommitterEthAddressInfo from './CommitterEthAddressInfo'

import socialMediaAuth from '../service/auth';

import { Button } from "@material-ui/core"
class MintMyCommits extends Component {
    state = {
        isGithubAuthenticated: false,
        committerData: {},
    }

    handleGithubLogin = async () => {
        this.setState({ isGithubAuthenticated: null })
        
        try {
            const userData = await socialMediaAuth()
            if (userData) {
                this.setState(() => {
                    return {
                        isGithubAuthenticated: true,
                        committerData: userData
                    }
                })
            }
        }

        // catch GitHub login error
        catch (err) {
            console.warn(err)
            this.setState({ isGithubAuthenticated: false })
        }            
    }

    render() {
        const { isGithubAuthenticated } = this.state

        if (isGithubAuthenticated === false) {
            return (
                <div>
                    <Button variant="contained" onClick={() => this.handleGithubLogin()}>Login to Github</Button>
                </div>
                
            )
        } else if (isGithubAuthenticated === null) {
            return (
                <p>Continue to sign in via GitHub popup window... </p>
            )
        } else if (isGithubAuthenticated === true) {
            const committerUsername = this.state.committerData.additionalUserInfo.username
            const committerEmailAddress = this.state.committerData.user.email

            return (
                <CommitterEthAddressInfo committerUsername={committerUsername} committerEmailAddress={committerEmailAddress}/>
            )
        }
    }
}

export default MintMyCommits;