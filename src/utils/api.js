import axios from 'axios'

const { REACT_APP_GITHUB_API_TOKEN } = process.env

const commitApi = axios.create({
    baseURL: "https://api.github.com"
})

export const getCommit = (owner, repo, ref) => {
    const apiPath = `/repos/${owner}/${repo}/commits?sha=${ref}`

    return commitApi.get(apiPath).then(({data}) => {
        return data
    })
}

export const postCommitComment = (owner, repo, ref) => {
    const apiPath = `/repos/${owner}/${repo}/commits/${ref}/comments?access_token=${REACT_APP_GITHUB_API_TOKEN}`

    const commentBodyText = `Hello, @${owner}`

    const commentBody = {
        body: commentBodyText
    }

    console.log(apiPath)
    return commitApi.post(apiPath, commentBody).then(({data}) => {
        console.log(data)
    }).catch((err) => {
        console.log(err)
    })
}