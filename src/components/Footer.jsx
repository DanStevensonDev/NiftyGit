import React from 'react';

const Footer = () => {
    return (
        <footer>
            <p>NiftyGit &copy; {new Date().getFullYear()}</p>
            <p><a href="https://etherscan.io/address/0x69207E05086375c9472396fBf82CEa3Ba2341546" target="_blank" rel="noreferrer">Donate</a> to help improve NiftyGit</p>
            <p><a href="https://twitter.com/NiftyGit" target="_blank" rel="noreferrer">Contact us on Twitter</a></p>
        </footer>
    );
};
 
export default Footer;