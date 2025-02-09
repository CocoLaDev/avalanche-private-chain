"use client"
import dynamic from "next/dynamic";
import { useNFTs } from "../hooks/useNFTs";

// Si tienes problemas de hydration, puedes cargar el componente que muestra los NFTs de forma dinámica sin SSR:
const NftsList = dynamic(() => import("@/components/nftsList"), { ssr: false });

const Diplomes = () => {
    const nfts = useNFTs();

    return (
        <div className="px-24 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-5">Tous les Diplômes</h1>
            <NftsList list={nfts} />
        </div>
    );
};

export default Diplomes;
