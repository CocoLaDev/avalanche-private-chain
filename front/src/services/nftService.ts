// front/src/services/nftService.ts
"use client";
import { ethers } from "ethers";
import NFT_ABI from "../abis/ESGI_diplomes.json";

// Adresse du contrat (assurez-vous que NEXT_PUBLIC_CONTRACT_ADDRESS est définie dans votre .env)
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;

/**
 * Mint un NFT de Diplôme
 */
export async function mintDiplomeNFT(metadataUrl: string): Promise<ethers.ContractTransaction> {
    if (typeof window.ethereum === "undefined") {
        throw new Error("MetaMask n'est pas disponible");
    }
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, NFT_ABI.abi, signer);
    const tx = await contract.mint(await signer.getAddress(), metadataUrl, 0, 0);
    return tx;
}

/**
 * Mint un NFT de Diplôme
 */
export async function mintPerfomanceNFT(metadataUrl: string, diplomeId: number): Promise<ethers.ContractTransaction> {
    if (typeof window.ethereum === "undefined") {
        throw new Error("MetaMask n'est pas disponible");
    }
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, NFT_ABI.abi, signer);
    const tx = await contract.mint(await signer.getAddress(), metadataUrl, 0, 0);
    return tx;
}

/**
 * Révoque un NFT en appelant la fonction revokeToken du contrat
 * @param tokenId L'identifiant du NFT à révoquer
 * @returns La transaction envoyée
 */
export async function revokeNFT(tokenId: number): Promise<ethers.ContractTransaction> {
    if (typeof window.ethereum === "undefined") {
        throw new Error("MetaMask n'est pas disponible");
    }
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, NFT_ABI.abi, signer);
    const tx = await contract.revokeToken(tokenId);
    return tx;
}
