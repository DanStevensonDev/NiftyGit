import React, { Component } from 'react'

import {githubProvider} from "../config/authMethod"
import socialMediaAuth from '../service/auth';

import { getBids } from '../utils/backendApi'

const { REACT_APP_GITHUB_OAUTH_TOKEN } = process.env
console.log(REACT_APP_GITHUB_OAUTH_TOKEN)


class MintYourCommits extends Component {
    state = {
        isGithubAuthenticated: false,
        userData: {},
        bidsData: {},
    }

    handleOnClick = (provider) => {
        const res = socialMediaAuth(provider)
        console.log(res)
    }

    render() {
        if (!this.state.isGithubAuthenticated) {
            return (
                <div>
                    <button onClick={() => this.handleOnClick(githubProvider)}>Login to Github</button>
                </div>
                
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