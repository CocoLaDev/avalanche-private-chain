// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "../src/ESGI_diplomes.sol";

contract ESGIDiplomesTest is Test {
    ESGI_diplomes nft;
    address admin = address(1);
    address user = address(2);
    string constant initialURI = "ipfs://initialURI";
    string constant updatedURI = "ipfs://updatedURI";

    // Configuration avant chaque test : le deploiement du contrat
    function setUp() public {
        // Simule que l'adresse admin est le msg.sender lors du deploiement du contrat
        vm.prank(admin);
        nft = new ESGI_diplomes();
    }

    // Teste que le compteur initial est a zero
    function testInitialCountIsZero() public {
        uint256 count = nft.getCount();
        assertEq(count, 0, "Le compteur initial doit etre 0");
    }

    // Teste le mint d'un NFT de type Diplome
    function testMintDiplome() public {
        vm.prank(admin);
        nft.mint(user, initialURI, ESGI_diplomes.Types.Diplome, 0);

        uint256 count = nft.getCount();
        assertEq(count, 1, "Un NFT doit etre minte");

        // Verifie que le tokenURI du NFT minte est correct
        string memory uri = nft.tokenURI(0);
        assertEq(uri, initialURI, "Le tokenURI doit etre initial");

        // Verifie qu'un diplome n'a pas de performances associees
        uint256[] memory performances = nft.getPerformances(0);
        assertEq(performances.length, 0, "Un Diplome ne doit pas avoir de performances associees");
    }

    // Teste le mint d'un NFT de type Performance associe a un Diplome
    function testMintPerformance() public {
        // Mint d'un Diplome pour reference
        vm.prank(admin);
        nft.mint(user, initialURI, ESGI_diplomes.Types.Diplome, 0);

        // Mint d'une Performance associee au Diplome
        vm.prank(admin);
        nft.mint(user, initialURI, ESGI_diplomes.Types.Performance, 0);

        uint256 count = nft.getCount();
        assertEq(count, 2, "Deux NFT doivent etre mintes");

        // Verifie que la performance est associee au Diplome
        uint256[] memory performances = nft.getPerformances(0);
        assertEq(performances.length, 1, "Il doit y avoir une performance associee");
        assertEq(performances[0], 1, "La performance doit avoir l'ID 1");
    }

    // Teste la mise a jour du tokenURI
    function testUpdateTokenURI() public {
        vm.prank(admin);
        nft.mint(user, initialURI, ESGI_diplomes.Types.Diplome, 0);

        // Mise a jour du tokenURI
        vm.prank(admin);
        nft.updateTokenURI(0, updatedURI);

        string memory uri = nft.tokenURI(0);
        assertEq(uri, updatedURI, "Le tokenURI doit etre mis a jour");
    }

    // Teste la revocation (burn) d'un token
    function testRevokeToken() public {
        vm.prank(admin);
        nft.mint(user, initialURI, ESGI_diplomes.Types.Diplome, 0);

        uint256 countBefore = nft.getCount();
        assertEq(countBefore, 1, "Il doit y avoir un NFT avant la revocation");

        // Revocation du token
        vm.prank(admin);
        nft.revokeToken(0);

        // Verifie que le token n'existe plus
        vm.expectRevert("Token does not exist");
        nft.tokenURI(0);
    }

    // Teste que le mint d'une performance sans diplome echoue
    function testMintPerformanceWithoutDiplomeFails() public {
        vm.prank(admin);
        vm.expectRevert("Diplome does not exist");
        nft.mint(user, initialURI, ESGI_diplomes.Types.Performance, 0);
    }

    // Teste que seuls les admins peuvent effectuer des operations critiques
    function testNonAdminCannotMint() public {
        // Un utilisateur non admin essaie de mint un NFT (doit echouer)
        vm.prank(user);
        vm.expectRevert();
        nft.mint(user, initialURI, ESGI_diplomes.Types.Diplome, 0);
    }

    function testNonAdminCannotUpdateTokenURI() public {
        vm.prank(admin);
        nft.mint(user, initialURI, ESGI_diplomes.Types.Diplome, 0);

        // Un utilisateur non autorise essaie de mettre a jour le tokenURI (doit echouer)
        vm.prank(user);
        vm.expectRevert();
        nft.updateTokenURI(0, updatedURI);
    }


    // Teste que la fonction tokenURI retourne correctement le URI d'un NFT
    function testTokenURI() public {
        vm.prank(admin);
        nft.mint(user, initialURI, ESGI_diplomes.Types.Diplome, 0);

        string memory uri = nft.tokenURI(0);
        assertEq(uri, initialURI, "Le tokenURI doit correspondre a la valeur initiale");
    }

    function testSupportsInterface() public view {
        bool result = nft.supportsInterface(0x01ffc9a7);
        assertTrue(result, "Le contrat doit supporter l'interface ERC721");
    }

    function testNonAdminCannotUpdateTokenURITokenNotExist() public {
        vm.prank(admin);
        vm.expectRevert("Token does not exist");
        nft.updateTokenURI(0, updatedURI);
    }

    function testRevokeTokenNotExist() public {
        vm.prank(admin);
        vm.expectRevert("Token does not exist");
        nft.revokeToken(0);
    }

    // Teste que plusieurs performances peuvent etre associees a un diplome
    function testGetMultiplePerformances() public {
        vm.prank(admin);
        nft.mint(user, initialURI, ESGI_diplomes.Types.Diplome, 0);

        vm.prank(admin);
        nft.mint(user, initialURI, ESGI_diplomes.Types.Performance, 0);
        vm.prank(admin);
        nft.mint(user, initialURI, ESGI_diplomes.Types.Performance, 0);

        uint256[] memory performances = nft.getPerformances(0);
        assertEq(performances.length, 2, "Il doit y avoir deux performances associees");
        assertEq(performances[0], 1, "La premiere performance doit avoir l'ID 1");
        assertEq(performances[1], 2, "La deuxieme performance doit avoir l'ID 2");
    }

    function testMintFailsWithInvalidType() public {
        vm.prank(admin);
        // Intenta mintear con un tipo no definido en el enum Types
        vm.expectRevert();
        nft.mint(user, initialURI, ESGI_diplomes.Types(uint256(2)), 0);
    }

    function testMintFailsWithInvalidDiplomeId() public {
        vm.prank(admin);
        vm.expectRevert("Diplome does not exist");
        nft.mint(user, initialURI, ESGI_diplomes.Types.Performance, 999); // ID invalide
    }

}
