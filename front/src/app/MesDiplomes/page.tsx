"use client";
import dynamic from "next/dynamic";
import { useMyNFTs } from "../hooks/useMyNFTs";

// Chargement du composant de liste sans SSR si nécessaire
const NftsList = dynamic(() => import("@/components/nftsList"), { ssr: false });

const MesDiplomes = () => {
    const myNFTs = useMyNFTs();

    return (
        <div className="px-24 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-5">Mes Diplômes</h1>
            {myNFTs.length === 0 ? (
                <p className="text-center text-gray-600">
                    Aucun diplôme n'a encore été minté pour ce compte.
                </p>
            ) : (
                <NftsList list={myNFTs} />
            )}
        </div>
    );
};

export default MesDiplomes;
