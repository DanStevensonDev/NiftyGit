pragma solidity ^0.5.16;

import "./ERC721Full.sol";

contract NiftyGit is ERC721Full {

    // access colors from contracts to check they are unique
    string[] public commits;

    mapping(string => bool) _commitExists;
    
    constructor() ERC721Full("NiftyGit", "NIFTYGIT") public {
    }

    // creates mint function
    function mint(string memory _commit) public {
        // require unique commit - if false (i.e. already exists in array), transaction doesn't complete
        require(!_commitExists[_commit]);

        // create id as unint
        uint _id = commits.push(_commit);

        // mints the token and sends it to the function caller (msg.sender)
        // for NiftyGit this will need changing to the supporter's address
        _mint(msg.sender, _id);

        // checks the above mapping to make sure color is unique - carries on if it is
        _commitExists[_commit] = true;

    }
}