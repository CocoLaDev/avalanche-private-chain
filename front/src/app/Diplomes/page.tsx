"use client";
import dynamic from "next/dynamic";
import { useNFTs } from "../hooks/useNFTs";
import { useState, useEffect } from "react";

const NftsList = dynamic(() => import("@/components/nftsList"), { ssr: false });

const Diplomes = () => {
    const [loading, setLoading] = useState(true);
    const nfts = useNFTs();

    useEffect(() => {
        // Vous pouvez ajuster cette condition pour définir le chargement terminé
        if (nfts.length >= 0) {
            setLoading(false);
        }
    }, [nfts]);

    return (
        <div className="px-24 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-5">Tous les Diplômes</h1>
            {loading ? (
                <p>Chargement...</p>
            ) : (
                <NftsList list={nfts} />
            )}
        </div>
    );
};

export default Diplomes;
