import axios from "axios"

const { REACT_APP_BACKEND_API_BASE_URL } = process.env

const backendApi = axios.create({
    baseURL: REACT_APP_BACKEND_API_BASE_URL
})

export const getBidByRef = (ref) => {
    return backendApi.get(`api/bids?ref=${ref}`)
        .then(({data}) => {
            return data
        })
}

export const getBidsByCommitter = (committerUsername) => {
    return backendApi.get(`/api/bids?committer=${committerUsername}`)
        .then((data) => {
            return data
    })
}