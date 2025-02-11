// src/app/hooks/useNFTs.ts
"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import NFT_ABI from "../../abis/ESGI_diplomes.json";
import { Diplome } from "@/interfaces/diplomes";

export function useNFTs(): Diplome[] {
    const [nfts, setNFTs] = useState<Diplome[]>([]);

    useEffect(() => {
        async function loadNFTs() {
            try {
                const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL;
                if (!rpcUrl) {
                    console.error("NEXT_PUBLIC_RPC_URL n'est pas définie");
                    return;
                }
                // Utiliser un provider en lecture seule (sans MetaMask)
                const provider = new ethers.JsonRpcProvider(rpcUrl);
                const network = await provider.getNetwork();
                console.log("Connecté à la réseau :", network);
                const chainId = Number(network.chainId);
                if (chainId !== 9999) {
                    console.error("La réseau connectée (chainId:", chainId, ") n'est pas celle attendue (9999).");
                    return;
                }
                const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
                if (!contractAddress) {
                    console.error("NEXT_PUBLIC_CONTRACT_ADDRESS n'est pas définie");
                    return;
                }
                // Instancier le contrat en lecture seule
                const contract = new ethers.Contract(contractAddress, NFT_ABI.abi, provider);

                const countBN = await contract.getCount();
                const count = Number(countBN);
                console.log("Nombre total de NFT :", count);
                const items: Diplome[] = [];

                for (let i = 0; i < count; i++) {
                    try {
                        // Récupérer l'URL du tokenURI
                        const tokenUri: string = await contract.tokenURI(i);
                        console.log(`Token ${i} URI: ${tokenUri}`);
                        const res = await fetch(tokenUri);
                        console.log(`Status for token ${i}: ${res.status} ${res.statusText}`);
                        if (!res.ok) {
                            console.error(
                                `Erreur lors du fetch des métadonnées pour le token ${i}: ${res.status} ${res.statusText}`
                            );
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
                            programStatus:
                                metadata.programStatus || { status: "", certificateIssuedDate: "", comments: "" },
                            studentName: metadata.studentName || "",
                            courses: metadata.courses || [],
                            yearStartDate: metadata.yearStartDate || "",
                            yearEndDate: metadata.yearEndDate || "",
                            academicStatus: metadata.academicStatus || { status: "", comments: "" },
                            ipfsCID: metadata.ipfsCID || "",
                            issuer: metadata.issuer || "",
                            signer: metadata.signer || ""
                        });
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    } catch (err: any) {
                        // Si l'erreur indique que le token n'existe pas, on le passe
                        if (err.message && err.message.includes("Token does not exist")) {
                            console.warn(`Token ${i} n'existe plus, ignoré.`);
                            continue;
                        }
                        console.error("Erreur lors du chargement du token", i, err);
                    }
                }
                setNFTs(items);
            } catch (err) {
                console.error("Erreur lors du chargement des NFT :", err);
            }
        }
        loadNFTs();
    }, []);

    return nfts;
}
