import React from 'react';

const HowItWorksInfo = () => {
    return (
        <section className="how-it-works-block">
            <h3>How it works</h3>
            <p>NiftyGit allows you to support Open Source Software contributors by buying their commits as NFTs.</p>
            <ol>
                <li>Enter the GitHub commit URL above and the amount you would like to offer for the commit. Your offer will be transferred to escrow while the committer responds.</li>
                <li>The committer will then get an alert through their GitHub account.</li>
                <li>If they want to accept your offer, they can log in to NiftyGit with the GitHub account and click to accept.</li>
                <li>If they accept the offer, the commit will be minted as an ERC721 NFT and transferred to the account you made the offer from. The committer will receive your offer minus gas into the Ethereum account they specify.</li>
                <li>If the committer rejects the offer or doesn't respond, you will be refunded your offer minus gas.</li>
            </ol>
            
            <h3>"What's 'gas'?" / "Oh yeah, what about gas?"</h3>
            <p>'Gas' is the term for the fee for making Ethereum (and other cryptocurrency) transactions.</p>
            <p>When you place an offer, your crypto wallet (e.g. MetaMask) will suggest a gas fee for you to pay on top of the offer to make sure the transaction goes through successfully.</p>
            <p>Similarly, when NiftyGit pays out to committers, the amount sent will be the offer minus minting and transaction gas.</p>
            <p>Gas fees fluctuate depending on transaction demand, and are currently quite high. But with improvements such as Ethereum 2.0 gas fees should reduce significantly.</p>
        </section>
    );
};

export default HowItWorksInfo;