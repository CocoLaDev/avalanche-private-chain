"use client"
import dynamic from "next/dynamic";
import { useMyNFTs } from "../hooks/useMyNFTs";

// Cargar el componente de listado sin SSR si es necesario
const NftsList = dynamic(() => import("@/components/nftsList"), { ssr: false });

const MesDiplomes = () => {
    const myNFTs = useMyNFTs();

    return (
        <div className="px-24 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-5">Mes Diplômes</h1>
            <NftsList list={myNFTs} />
        </div>
    );
};

export default MesDiplomes;
