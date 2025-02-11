// src/app/hooks/useMyNFTs.ts
"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import NFT_ABI from "../../abis/ESGI_diplomes.json";
import { Diplome } from "@/interfaces/diplomes";

declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ethereum?: any;
    }
}

export function useMyNFTs(): Diplome[] {
    const [myNFTs, setMyNFTs] = useState<Diplome[]>([]);

    useEffect(() => {
        async function loadMyNFTs() {
            try {
                if (typeof window === "undefined" || typeof window.ethereum === "undefined") {
                    console.error("MetaMask n'est pas disponible ou nous sommes sur le serveur");
                    return;
                }

                const provider = new ethers.BrowserProvider(window.ethereum);
                const network = await provider.getNetwork();
                console.log("Connecté à la réseau :", network);
                const chainId = Number(network.chainId);
                if (chainId !== 9999) {
                    console.error("La réseau connectée (chainId:", chainId, ") n'est pas celle attendue (9999).");
                    return;
                }

                const signer = await provider.getSigner();
                const userAddress = (await signer.getAddress()).toLowerCase();

                const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
                console.log("Contract Address :", contractAddress);
                if (!contractAddress) {
                    console.error("La direction du contrat n'est pas définie dans NEXT_PUBLIC_CONTRACT_ADDRESS");
                    return;
                }

                const contract = new ethers.Contract(contractAddress, NFT_ABI.abi, signer);

                let countBN;
                try {
                    countBN = await contract.getCount();
                } catch (error) {
                    console.error("Erreur lors de l'appel à getCount :", error);
                    return;
                }
                const count = Number(countBN);
                console.log("Nombre total de NFT :", count);
                const items: Diplome[] = [];

                for (let i = 0; i < count; i++) {
                    try {
                        // Tenter de récupérer le propriétaire du token
                        let owner;
                        try {
                            owner = await contract.ownerOf(i);
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        } catch (err: any) {
                            if (
                                err.message.includes("ERC721NonexistentToken") ||
                                err.message.toLowerCase().includes("missing revert data")
                            ) {
                                console.warn(`Le token ${i} n'existe pas (ownerOf) – ignoré.`);
                                continue;
                            } else {
                                throw err;
                            }
                        }
                        if (owner.toLowerCase() !== userAddress) {
                            continue;
                        }

                        // Tenter de récupérer le tokenURI
                        let tokenUri: string;
                        try {
                            tokenUri = await contract.tokenURI(i);
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        } catch (err: any) {
                            if (
                                err.message.includes("ERC721NonexistentToken") ||
                                err.message.toLowerCase().includes("missing revert data")
                            ) {
                                console.warn(`Le token ${i} n'existe pas (tokenURI) – ignoré.`);
                                continue;
                            } else {
                                throw err;
                            }
                        }
                        console.log(`Token ${i} URI: ${tokenUri}`);

                        // Récupérer les métadonnées via fetch
                        const res = await fetch(tokenUri);
                        console.log(`Status for token ${i}: ${res.status} ${res.statusText}`);
                        if (!res.ok) {
                            console.error(`Erreur lors du fetch des métadonnées pour le token ${i}: ${res.status} ${res.statusText}`);
                            continue;
                        }
                        const metadata = await res.json();
                        console.log(`Token ${i} metadata:`, metadata);

                        items.push({
                            tokenId: i,
                            title: metadata.title || "",
                            description: metadata.description || "",
                            location: metadata.location || "",
                            date: metadata.date || "",
                            image: metadata.image || "",
                            studentId: metadata.studentId || "",
                            Program: metadata.Program || "",
                            programStatus: metadata.programStatus || { status: "", certificateIssuedDate: "", comments: "" },
                            studentName: metadata.studentName || "",
                            courses: metadata.courses || [],
                            yearStartDate: metadata.yearStartDate || "",
                            yearEndDate: metadata.yearEndDate || "",
                            academicStatus: metadata.academicStatus || { status: "", comments: "" },
                            ipfsCID: metadata.ipfsCID || "",
                            issuer: metadata.issuer || "",
                            signer: metadata.signer || ""
                        });
                    } catch (err) {
                        console.error("Erreur lors du chargement du token", i, err);
                    }
                }
                setMyNFTs(items);
            } catch (err) {
                console.error("Erreur lors du chargement de mes NFT :", err);
            }
        }
        loadMyNFTs();
    }, []);

    return myNFTs;
}
