import axios from "axios"

const { REACT_APP_BACKEND_API_BASE_URL } = process.env

const backendApi = axios.create({
    baseURL: REACT_APP_BACKEND_API_BASE_URL
})

export const getOffersByCommitter = (committerUsername) => {
    return backendApi.get(`/api/offers?committer=${committerUsername}`)
        .then((data) => {
            return data
    })
}

export const postOfferTransactionData = (offerData) => {
    console.log(offerData)
    return backendApi.post(`api/offers`)
        .then((data) => {
            return data
        })
}