import { Octokit } from "octokit";
import axios from 'axios'

const { REACT_APP_GITHUB_POST_COMMENT_ACCESS_TOKEN, REACT_APP_ETHERSCAN_API_KEY } = process.env

const octokit = new Octokit({ auth: REACT_APP_GITHUB_POST_COMMENT_ACCESS_TOKEN });

export const postCommitComment = async (owner, repo, ref, committerUsername, offerAmountInEth, transactionHash) => {

    const ethPriceData = await axios.get(`https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${REACT_APP_ETHERSCAN_API_KEY}`)
    const ethUsdPrice = parseFloat(ethPriceData.data.result.ethusd)
    const offerAmountInUsdApprox = (offerAmountInEth * ethUsdPrice).toFixed(2)

    const commentBodyText = `Hi @${committerUsername},\n\n@NiftyGit allows people to support open source software contributors by buying their commits as NFTs. \n\nWe are currently in BETA mode and this is a test offer. You can see the test transaction for ${offerAmountInEth} ETH (approx. $${offerAmountInUsdApprox}) on Etherscan [here](https://rinkeby.etherscan.io/tx/${transactionHash}). \n\nFor more information go to https://niftygit.io/\n\nFeel free to get in touch with us by replying to this comment.\n\nThe @NiftyGit team`
    
    // Draft future commentBodyText
    // const commentBodyText = `Hi @${committerUsername},\n\n@NiftyGit allows people to support open source software contributors by buying their commits as NFTs. \n\nSomeone has offered to support this commit for ${offerAmountInEth} Ether! You can see the offer on the blockchain here: https://etherscan.io/tx/${transactionId}\n\nTo accept this offer and mint your commit as an NFT, or for more information go to https://niftygit.io/mint-my-commit and sign in with your GitHub account.\n\nFeel free to get in touch with us by replying to this comment or through the website.\n\nThe @NiftyGit team`

    await octokit.request(`POST /repos/${owner}/${repo}/commits/${ref}/comments`, {
        owner: owner,
        repo: repo,
        commit_sha: ref,
        body: commentBodyText,
    })
}