// front/src/services/nftService.ts
import { ethers } from "ethers";
import NFT_ABI from "../abis/ESGI_diplomes.json";

// Adresse du contrat (assurez-vous que NEXT_PUBLIC_CONTRACT_ADDRESS est définie dans votre fichier .env)
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;

/**
 * Mint un NFT de Diplôme en appelant la fonction mint du contrat.
 *
 * @param metadataUrl L'URL des métadonnées du NFT (généralement une URL Pinata/IPFS).
 * @returns La transaction du contrat.
 */
export async function mintDiplomeNFT(metadataUrl: string): Promise<ethers.ContractTransaction> {
    // Vérifier si MetaMask est disponible dans le navigateur
    if (typeof window.ethereum === "undefined") {
        throw new Error("MetaMask n'est pas disponible");
    }

    // Demander la connexion à MetaMask
    await window.ethereum.request({ method: "eth_requestAccounts" });

    // Créer un provider en utilisant MetaMask (BrowserProvider dans ethers v6)
    const provider = new ethers.BrowserProvider(window.ethereum);

    // Obtenir le signer (le compte connecté) depuis MetaMask
    const signer = await provider.getSigner();

    // Instancier le contrat en utilisant l'ABI et l'adresse du contrat
    const contract = new ethers.Contract(CONTRACT_ADDRESS, NFT_ABI.abi, signer);

    // Appeler la fonction mint du contrat
    // Pour un diplôme : _type = 0 et diplomeId = 0
    const tx = await contract.mint(await signer.getAddress(), metadataUrl, 0, 0);
    return tx;
}
