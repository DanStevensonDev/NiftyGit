import axios from 'axios'

const { REACT_APP_GITHUB_POST_COMMENT_ACCESS_TOKEN } = process.env

const commitApi = axios.create({
    baseURL: "https://api.github.com"
})

export const postCommitComment = (owner, repo, ref, committerUsername, offerAmountInEth, transactionHash) => {
    const apiPath = `/repos/${owner}/${repo}/commits/${ref}/comments?access_token=${REACT_APP_GITHUB_POST_COMMENT_ACCESS_TOKEN}`

    const commentBodyText = `Hi @${committerUsername},\n\n@NiftyGit allows people to support open source software contributors by buying their commits as NFTs. \n\nWe are currently in BETA mode and this is a test offer. You can see the test transaction on Etherscan [here](https://rinkeby.etherscan.io/tx/${transactionHash}). \n\nFor more information go to https://niftygit.io/\n\nFeel free to get in touch with us by replying to this comment.\n\nThe @NiftyGit team`
    
    // Draft future commentBodyText
    // const commentBodyText = `Hi @${committerUsername},\n\n@NiftyGit allows people to support open source software contributors by buying their commits as NFTs. \n\nSomeone has offered to support this commit for ${offerAmountInEth} Ether! You can see the offer on the blockchain here: https://etherscan.io/tx/${transactionId}\n\nTo accept this offer and mint your commit as an NFT, or for more information go to https://niftygit.io/mint-my-commit and sign in with your GitHub account.\n\nFeel free to get in touch with us by replying to this comment or through the website.\n\nThe @NiftyGit team`

    const commentBody = {
        body: commentBodyText
    }

    return commitApi.post(apiPath, commentBody).then(({data}) => {
        console.log(data)
    }).catch((err) => {
        return err
    })
}