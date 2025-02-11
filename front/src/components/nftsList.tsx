// front/src/components/nftsList.tsx
import { Diplome, PerformanceNFT } from "@/interfaces/diplomes";
import Image from "next/image";
import { revokeNFT } from "@/services/nftService";
import { ethers } from "ethers";
import { useState } from "react";

// Fonction de type guard pour vérifier si c'est un NFT de performance
function isPerformanceNFT(item: Diplome): item is PerformanceNFT {
    return (item as PerformanceNFT).studentName !== undefined;
}

const NftsList = ({ list }: { list: Diplome[] }) => {
    const [revokeMessage, setRevokeMessage] = useState<string>("");

    // Fonction pour révoquer un NFT et rafraîchir la page après confirmation
    const handleRevoke = async (tokenId: number) => {
        try {
            setRevokeMessage(`Révocation du token ${tokenId} en cours...`);
            const tx = await revokeNFT(tokenId);
            // Récupérer le hash de la transaction (tx.hash ou tx.transactionHash)
            const txHash = (tx as any).hash || (tx as any).transactionHash;
            setRevokeMessage(`Transaction de révocation envoyée: ${txHash}`);

            // Créer un provider depuis window.ethereum pour attendre la confirmation
            const provider = new ethers.BrowserProvider(window.ethereum);
            await provider.waitForTransaction(txHash);

            setRevokeMessage(`Token ${tokenId} révoqué avec succès!`);

            // Rafraîchir la page pour mettre à jour l'affichage
            window.location.reload();
        } catch (error: any) {
            console.error("Erreur lors de la révocation du token", tokenId, error);
            // Si l'erreur indique que l'utilisateur n'est pas autorisé, afficher un message explicite
            if (error.message && error.message.toLowerCase().includes("missing revert data")) {
                setRevokeMessage(
                    `Vous n'êtes pas administrateur et vous n'avez pas la permission de révoquer ce diplôme.`
                );
            } else {
                setRevokeMessage(`Erreur lors de la révocation du token ${tokenId}: ${error.message}`);
            }
        }
    };

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((item, index) => (
                <div
                    key={index}
                    className="relative block overflow-hidden rounded-lg border border-gray-100 p-4 sm:p-6 lg:p-8"
                >
                    <span className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-sky-300 via-sky-600 to-sky-400"></span>
                    <div className="sm:flex sm:justify-between sm:gap-4">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 sm:text-xl">
                                {item.title}
                            </h3>
                            {isPerformanceNFT(item) ? (
                                <p className="text-sm text-gray-600">
                                    Étudiant: {item.studentName} - {item.studentId}
                                </p>
                            ) : (
                                <p className="text-sm text-gray-600">
                                    Étudiant: {item.studentId}
                                </p>
                            )}
                        </div>
                        <div className="hidden sm:block sm:shrink-0">
                            {item.image ? (
                                <Image
                                    alt="Diplôme"
                                    src={item.image}
                                    className="size-16 rounded-lg object-cover shadow-xs"
                                    width={200}
                                    height={200}
                                />
                            ) : (
                                <div className="w-48 h-48 bg-gray-200 flex items-center justify-center">
                                    No Image
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="mt-4">
                        <p className="text-sm text-pretty text-gray-500">
                            {item.description}
                        </p>
                    </div>
                    <dl className="mt-6 flex gap-4 sm:gap-6">
                        <div className="flex flex-col-reverse">
                            <dt className="text-sm font-medium text-gray-600">{item.date}</dt>
                            <dd className="text-xs text-gray-500">Date</dd>
                        </div>
                        <div className="flex flex-col-reverse">
                            <dt className="text-sm font-medium text-gray-600">{item.location}</dt>
                            <dd className="text-xs text-gray-500">Localisation</dd>
                        </div>
                    </dl>
                    {/* Si c'est un NFT de performance, afficher les cours */}
                    {isPerformanceNFT(item) && item.courses && (
                        <div className="mt-4">
                            <h4 className="text-md font-bold text-gray-900">Cours</h4>
                            <ul>
                                {item.courses.map((course, idx) => (
                                    <li key={idx} className="text-sm text-gray-600">
                                        {course.courseName}: {course.grade} ({course.result}) - {course.comments}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <div className="mt-4">
                        <button
                            onClick={() => handleRevoke(item.tokenId)}
                            className="rounded-md bg-red-600 px-4 py-2 text-white text-sm"
                        >
                            Révoquer
                        </button>
                    </div>
                </div>
            ))}
            {revokeMessage && (
                <div className="col-span-full text-center text-red-500 mt-4">
                    {revokeMessage}
                </div>
            )}
        </div>
    );
};

export default NftsList;