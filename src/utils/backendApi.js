import axios from "axios"

const { REACT_APP_BACKEND_API_BASE_URL } = process.env

const backendApi = axios.create({
    baseURL: REACT_APP_BACKEND_API_BASE_URL
})

export const getOffersByCommitter = (committerUsername) => {
    return backendApi.get(`/api/bids?committer=${committerUsername}`)
        .then((data) => {
            return data
    })
}

export const postOfferTransaction = (bidData) => {
    return backendApi.post(`api/bids`)
        .then((data) => {
            return data
        })
}