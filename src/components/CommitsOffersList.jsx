import React, { Component } from 'react'

import { getOffersByCommitter, acceptOffer } from '../utils/backendApi'

import axios from 'axios'

import { Button } from "@material-ui/core"

const { REACT_APP_ETHERSCAN_API_KEY } = process.env

class CommitsOffersList extends Component {
    state = {
        offersData: [],
        ethUsdPrice: null,
    }

    async componentDidMount() {
        const { committerUsername } = this.props

        // fetch open offers
        try {            
            const committersOffers = await getOffersByCommitter(committerUsername)
            
            this.setState({ offersData: committersOffers })
        }
    
        // catch error fetching open offers
        catch (err){
            console.warn(err)
        }
        
        const ethPriceData = await axios.get(`https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${REACT_APP_ETHERSCAN_API_KEY}`)

        this.setState({ ethUsdPrice: ethPriceData.data.result.ethusd })      
    }

    async componentDidUpdate() {
        const { committerUsername } = this.props

        // fetch open offers
        try {            
            const committersOffers = await getOffersByCommitter(committerUsername)
            
            this.setState({ offersData: committersOffers })
        }
    
        // catch error fetching open offers
        catch (err){
            console.warn(err)
        }
    } 

    handleAcceptOffer =  async (offerId) => {
        try {
            await acceptOffer(offerId)
        }

        catch (err) {
            console.warn(err)
        }
    }

    render() {
        const { committerUsername, chainId } = this.props
        const { offersData, ethUsdPrice } = this.state

        if (!offersData) {
            return (
                <p>Loading offers data... Please wait... </p>
            )
        } else {
            return (
                <div>
                    <p>Logged in through GitHub account {committerUsername}</p>
                    <table id="commit-offers">
                        <thead>
                            <tr>
                                <th>Repo</th>
                                <th>Commit</th>
                                <th>Offer amount</th>
                                <th>Offer status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {offersData.reverse().map((offer) => {
                                const { offerId, offerAmountInEth, commitData, offerStatus } = offer
                                const offerAmountInUsd = offerAmountInEth * ethUsdPrice
                                const repo = commitData.html_url.split("https://github.com/")[1].split("/commit")[0]
                                
                                if ((offerStatus === 1 || offerStatus === 2) && chainId === 4) {
                                    return (
                                        <tr key={offerId}>
                                            <td>{repo}</td>
                                            <td><a href={commitData.html_url} target="_blank" rel="noreferrer">{commitData.commit.message}</a></td>
                                            <td>{offerAmountInEth}ETH<br />(approx. ${offerAmountInUsd.toFixed(2)})</td>
                                            <td><p style={{color : "green"}}>Open offer</p><Button variant="contained" onClick={() => this.handleAcceptOffer(offerId)}>Accept offer and mint</Button></td>
                                        </tr>
                                    )
                                } else if ((offerStatus === 1 || offerStatus === 2) && chainId !== 4) {
                                    return (
                                        <tr key={offerId}>
                                            <td>{repo}</td>
                                            <td><a href={commitData.html_url} target="_blank" rel="noreferrer">{commitData.commit.message}</a></td>
                                            <td>{offerAmountInEth}ETH<br/>(approx. ${offerAmountInUsd.toFixed(2)})</td>
                                            <td><p style={{color : "green"}}>Open offer</p><Button variant="contained" disabled="true" onClick={() => this.handleAcceptOffer()}>You need to connect to a crypto wallet to mint your commits</Button></td>
                                        </tr>
                                    )
                                } else {
                                    let committersOfferStatus
    
                                    switch (offerStatus) {
                                        case 2:
                                            committersOfferStatus = "Offer exceeded"
                                            break;
                                        case 3:
                                            committersOfferStatus = "Offer exceeded"
                                            break;
                                        case 4:
                                            committersOfferStatus = "Offer expired"
                                            break;
                                        case 5:
                                            committersOfferStatus = "Offer expired"
                                            break;
                                        case 6:
                                            committersOfferStatus = "You rejected the offer"
                                            break;
                                        case 7:
                                            committersOfferStatus = "You rejected the offer"
                                            break;
                                        case 8:
                                            committersOfferStatus = "Offer accepted - awaiting commit minting and transfer of offer funds."
                                            break;
                                        case 9:
                                            committersOfferStatus = "Commit minted - offer amount transferred to your account and NFT transferred to supporter"
                                            break;
                                        default:
                                            committersOfferStatus = "Offer expired"
                                    }
    
                                    return (
                                        <tr key={offerId}>
                                            <td>{repo}</td>
                                            <td><a href={commitData.html_url} target="_blank" rel="noreferrer">{commitData.commit.message}</a></td>
                                            <td>{offerAmountInEth}ETH<br/>(approx. ${offerAmountInUsd.toFixed(2)})</td>
                                            <td>{ committersOfferStatus }</td>
                                        </tr>
                                    )
                                }
                        })}
                        </tbody>
                    </table>
                </div>
            );
        }
    }
}

export default CommitsOffersList;