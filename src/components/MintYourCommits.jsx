import React, { Component } from 'react'

import SocialButton from './SocialButton'

import {fetchBids} from '../../models/fetchBids'

const {REACT_APP_GITHUB_OAUTH_TOKEN} = process.env


class MintYourCommits extends Component {
    state = {
        isGithubAuthenticated: false,
        userData: {},
    }

    componentDidMount() {
        fetchBids().then((bids) => {
            console.log(bids)
        })
    }

    handleSocialLogin = (user) => {
        console.log(user)
        this.setState(() => {
            return {
                isGithubAuthenticated: true,
                userData: user
            }
        })


    }

    handleSocialLoginFailure = (err) => {
        console.error(err)
    }

    render() {
        if (!this.state.isGithubAuthenticated) {
            return (
                <SocialButton
                    provider='github'
                    appId={REACT_APP_GITHUB_OAUTH_TOKEN}
                    onLoginSuccess={this.handleSocialLogin}
                    onLoginFailure={this.handleSocialLoginFailure}
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