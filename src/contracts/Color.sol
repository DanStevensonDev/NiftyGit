pragma solidity ^0.5.0;

import "./ERC721Full.sol";

contract Color is ERC721Full {

    // access colors from contracts to check they are unique
    string[] public colors;

    mapping(string => bool) _colorExists;
    
    constructor() ERC721Full("Color", "COLOR") public {
    }

    // creates mint function
    function mint(string memory _color) public {
        // require unique color - if false (i.e. already exists in array), transaction doesn't complete
        require(!_colorExists[_color]);

        // create id as unint
        uint _id = colors.push(_color);

        // mints the token and sends it to the function caller (msg.sender)
        // for NiftyGit this will need changing to the supporter's address
        _mint(msg.sender, _id);

        // checks the above mapping to make sure color is unique - carries on if it is
        _colorExists[_color] = true;

    }
}