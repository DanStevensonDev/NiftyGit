import axios from "axios"

const { REACT_APP_BACKEND_API_BASE_URL } = process.env

const backendApi = axios.create({
    baseURL: REACT_APP_BACKEND_API_BASE_URL
})

export const getOffersByRef = (ref) => {
    return backendApi.get(`api/bids?ref=${ref}`)
        .then(({data}) => {
            return data
        })
}

export const getOffersByCommitter = (committerUsername) => {
    return backendApi.get(`/api/bids?committer=${committerUsername}`)
        .then((data) => {
            return data
    })
}

export const postOffer = (bidData) => {
    return backendApi.post(`api/bids`)
        .then((data) => {
            return data
        })
}