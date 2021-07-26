import axios from 'axios'

const { REACT_APP_GITHUB_CLIENT_ID, REACT_APP_GITHUB_CLIENT_SECRET } = process.env

export const getUserAccessToken = (tempCode) => {
    return axios.post("https://github.com/login/oauth/access_token", {
        params: {
            client_id: REACT_APP_GITHUB_CLIENT_ID,
            client_secret: REACT_APP_GITHUB_CLIENT_SECRET,
            code: tempCode
        },
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
    }
    }).then((data) => {
        // console.log(data)
    })
}