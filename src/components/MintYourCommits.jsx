import React, { Component } from 'react'

import SocialButton from './SocialButton'

import {getBids} from '../utils/backendApi'

const {REACT_APP_GITHUB_OAUTH_TOKEN} = process.env


class MintYourCommits extends Component {
    state = {
        isGithubAuthenticated: false,
        userData: {},
        bidsData: {},
    }

    handleGithubLogin = (user) => {
        const committerUsername = user.profile.name

        getBids(committerUsername).then((bids) => {
            console.log(bids)
        })

        this.setState(() => {
            return {
                isGithubAuthenticated: true,
                userData: user
            }
        })


    }

    handleGithubLoginFailure = (err) => {
        console.error(err)
    }

    render() {
        if (!this.state.isGithubAuthenticated) {
            return (
                <SocialButton
                    provider='github'
                    appId={REACT_APP_GITHUB_OAUTH_TOKEN}
                    onLoginSuccess={this.handleGithubLogin}
                    onLoginFailure={this.handleGithubLoginFailure}
                >
                    Login with Github
                </SocialButton>
                
            )
        } else {
            const {name} = this.state.userData.profile
            return (
                <p>Hello {name}</p>
            )
        }
    }
}

export default MintYourCommits;