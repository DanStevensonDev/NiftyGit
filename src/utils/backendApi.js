import axios from "axios"

const { REACT_APP_BACKEND_API_BASE_URL } = process.env

const backendApi = axios.create({
    baseURL: REACT_APP_BACKEND_API_BASE_URL
})

export const getOffersByCommitter = (committerUsername) => {
    return backendApi.get(`/api/offers?committer=${committerUsername}`)
        .then(({ data }) => {
            console.log(data)
            return data
    })
}

export const postOffer = (offerData) => {
    // console.log(offerData)
    return backendApi.post(`api/offers`, offerData)
        .then((data) => {
            return data
        })
}

export const acceptOffer = (offerId) => {
    return backendApi.patch(`/api/offers?offerId=${offerId}`, {offerStatus: 'Offer accepted - awaiting commit minting and transfer of offer funds.'})
        .then((data) => {
            return data
    })
}