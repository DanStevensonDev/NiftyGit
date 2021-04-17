import axios from "axios"

const { REACT_APP_BACKEND_API_BASE_URL } = process.env

const backendApi = axios.create({
    baseURL: REACT_APP_BACKEND_API_BASE_URL
})

export const getBidsByCommitter = (committerUsername) => {
    return backendApi.get(`/api/bids?committer=${committerUsername}`).then((data) => {
        return data
    })
}