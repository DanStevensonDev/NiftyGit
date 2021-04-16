import axios from "axios"

const { REACT_APP_BACKEND_API_BASE_URL } = process.env
console.log(process.env)
console.log(REACT_APP_BACKEND_API_BASE_URL)

const backendApi = axios.create({
    baseURL: REACT_APP_BACKEND_API_BASE_URL
})

export const getBids = (committerUsername) => {
    return backendApi.get(`/api/bids?committer=${committerUsername}`).then((data) => {
        return data
    })
}