import axios from 'axios'

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
    // API ACCESS KEY NEEDED HERE
    const accessKey = ''
    const apiPath = `/repos/${owner}/${repo}/commits/${ref}/comments?access_token=${accessKey}`

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