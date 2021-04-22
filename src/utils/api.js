import axios from 'axios'

const { REACT_APP_GITHUB_POST_COMMENT_ACCESS_TOKEN } = process.env

const commitApi = axios.create({
    baseURL: "https://api.github.com"
})

export const getCommit = (owner, repo, ref) => {
    const apiPath = `/repos/${owner}/${repo}/commits/${ref}`

    return commitApi.get(apiPath).then(({data}) => {
        // API returns data about 30 commits
        // return data[0] to return data
        // only for relevant commit
        return data
    })
}

export const postCommitComment = (owner, repo, ref, committerUsername) => {
    const apiPath = `/repos/${owner}/${repo}/commits/${ref}/comments?access_token=${REACT_APP_GITHUB_POST_COMMENT_ACCESS_TOKEN}`

    const commentBodyText = `Hi @${committerUsername}, \nTest comment.`

    const commentBody = {
        body: commentBodyText
    }

    return commitApi.post(apiPath, commentBody).then(({data}) => {
        console.log(data)
    }).catch((err) => {
        return err
    })
}