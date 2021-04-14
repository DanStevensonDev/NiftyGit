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