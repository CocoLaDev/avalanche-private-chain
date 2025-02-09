// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract ESGI_diplomes is ERC721, AccessControl {
    enum Types { Diplome, Performance }

    bytes32 public constant URI_UPDATER_ROLE = keccak256("URI_UPDATER_ROLE");

    uint256 private _nextTokenId;
    mapping(uint256 => string) private _tokenURIs;
    mapping(uint256 => Types) private _tokenTypes;
    mapping(uint256 => uint256[]) private _diplomeToPerformances;

    constructor() ERC721("ESGI_diplomes", "ESDId") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(URI_UPDATER_ROLE, msg.sender);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function mint(address to, string memory initialURI, Types _type, uint256 diplomeId) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_type == Types.Diplome || diplomeId < _nextTokenId, "Diplome does not exist");
        uint256 tokenId = _nextTokenId;
        _tokenTypes[tokenId] = _type;
        if (_type == Types.Performance) {
            _diplomeToPerformances[diplomeId].push(tokenId);
        }
        _safeMint(to, tokenId);
        _tokenURIs[tokenId] = initialURI;
        _nextTokenId++;
    }

    function updateTokenURI(uint256 tokenId, string memory newURI) external onlyRole(URI_UPDATER_ROLE) {
        require(tokenId < _nextTokenId, "Token does not exist");
        _tokenURIs[tokenId] = newURI;
    }

    function revokeToken(uint256 tokenId) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(tokenId < _nextTokenId, "Token does not exist");
        _burn(tokenId);
        delete _tokenURIs[tokenId];
        delete _tokenTypes[tokenId];
    }

    // Nueva implementación de tokenURI utilizando try/catch con this.ownerOf
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        try this.ownerOf(tokenId) returns (address) {
            return _tokenURIs[tokenId];
        } catch {
            revert("Token does not exist");
        }
    }

    function getCount() public view returns (uint256) {
        return _nextTokenId;
    }

    function getPerformances(uint256 diplomeId) public view returns (uint256[] memory) {
        return _diplomeToPerformances[diplomeId];
    }
}

