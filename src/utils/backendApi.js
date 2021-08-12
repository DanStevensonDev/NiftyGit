import axios from "axios"

const { REACT_APP_BACKEND_API_BASE_URL } = process.env

const backendApi = axios.create({
    baseURL: REACT_APP_BACKEND_API_BASE_URL
})

export const getOffersByCommitter = (committerUsername) => {
    return backendApi.get(`/api/offers?committer=${committerUsername}`)
        .then(({ data }) => {
            return data
    })
}

export const getOffersByCommitSha = (commitSha) => {
    return backendApi.get(`/api/offers?commitSha=${commitSha}`)
        .then(({ data }) => {
            return data
    })
}

export const getOffersByCommitterAndStatus = (committerUsername, offerStatus) => {
    return backendApi.get(`/api/offers?committer=${committerUsername}&offerStatus=${offerStatus}`)
        .then(({ data }) => {
            return data
    })
}

export const postOffer = (offerData) => {
    // console.log(offerData)
    return backendApi.post(`api/offers`, offerData)
        .then(({data}) => {
            return data[0]
        })
}

export const acceptOffer = (offerId) => {
    return backendApi.patch(`/api/offers?offerId=${offerId}`, {offerStatus: 8})
        .then((data) => {
            return data
    })
}

export const updateOfferStatus = (offerId, offerStatus) => {
    return backendApi.patch(`/api/offers?offerId=${offerId}`, { offerStatus: offerStatus })
        .then(({ data }) => {
            return data
        })
}