"use client";
import { Diplome } from "@/interfaces/diplomes";
import { uploadFile, uploadJson } from "@/services/uploadFile";
import { mintPerfomanceNFT } from "../services/nftService";
import { ethers } from "ethers";
import { useState } from "react";

const Form = () => {
    const [message, setMessage] = useState("");

    async function submit() {
        setMessage("Envoi en cours...");

        const fileInput = document.getElementById("image") as HTMLInputElement;
        if (!fileInput || !fileInput.files || !fileInput.files[0]) {
            setMessage("Veuillez sélectionner une image.");
            return;
        }

        // Télécharger l'image et obtenir son URL
        const imageUrl = await uploadFile({ file: fileInput.files[0] });
        if (!imageUrl) {
            setMessage("Erreur lors du téléchargement de l'image");
            return;
        }

        // Récupérer les autres données du formulaire
        const title = (document.getElementById("title") as HTMLInputElement).value;
        const date = (document.getElementById("date") as HTMLInputElement).value;
        const location = (document.getElementById("location") as HTMLInputElement).value;
        const description = (document.getElementById("description") as HTMLTextAreaElement).value;
        const studentId = (document.getElementById("StudentId") as HTMLInputElement).value;
        const studentName = (document.getElementById("StudentName") as HTMLInputElement).value;
        const yearStartDate = (document.getElementById("yearStartDate") as HTMLInputElement).value;
        const yearEndDate = (document.getElementById("yearEndDate") as HTMLInputElement).value;
        const courseName = (document.getElementById("courseName") as HTMLInputElement).value;
        const courseGrade = (document.getElementById("courseGrade") as HTMLInputElement).value;
        const courseResult = (document.getElementById("courseResult") as HTMLInputElement).value;
        const courseComment = (document.getElementById("courseComment") as HTMLInputElement).value;

        // Construire l'objet métadonnées pour le NFT en respectant la structure de vos interfaces.
        // Ici, nous utilisons la structure d'un NFT de Programme.
        const data: Diplome = {
            tokenId: 0, // Ce champ sera attribué par le contrat
            title,
            description,
            location,
            date,
            image: imageUrl,
            studentId, // À renseigner si nécessaire
            Program: "Master - Ingénierie de la Blockchain",
            programStatus: { status: "", certificateIssuedDate: "", comments: "" },
            studentName,
            courses: [{
                    courseName,
                    grade: courseGrade,
                    result: courseResult,
                    comments: courseComment
                }],
            yearStartDate,
            yearEndDate,
            academicStatus: { status: "", comments: "" },
            ipfsCID: "",
            issuer: "",
            signer: ""
        };

        // Utiliser uploadJson pour obtenir le CID des métadonnées
        const metadataCid = await uploadJson(data);
        if (!metadataCid) {
            setMessage("Erreur lors de l'envoi des métadonnées");
            return;
        }

        // Vérifier si metadataCid est déjà une URL complète
        let metadataUrl: string;
        if (metadataCid.startsWith("http")) {
            metadataUrl = metadataCid;
        } else {
            metadataUrl = `https://${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${metadataCid}`;
        }
        console.log("Metadata URL:", metadataUrl);

        // Appeler la fonction de mint pour créer le NFT avec la metadata
        setMessage("Metadata uploadée. Minting NFT...");
        try {
            const tx = await mintPerfomanceNFT(metadataUrl, 1);
            // Récupérer le hash de la transaction (tx.hash ou tx.transactionHash)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const txHash = (tx as any).hash || (tx as any).transactionHash;
            setMessage("Transaction envoyée: " + txHash);

            // Créer un provider depuis window.ethereum pour attendre la confirmation
            const provider = new ethers.BrowserProvider(window.ethereum);
            await provider.waitForTransaction(txHash);

            setMessage("Diplôme ajouté avec succès!");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error("Erreur lors du mint:", error);
            setMessage("Erreur lors du mint: " + error.message);
        }
    }

    return (
        <section>
            <div className="rounded-lg bg-white p-8 shadow-lg lg:col-span-3 lg:p-12">
                <div className="space-y-4">
                    <input
                        className="w-full rounded-lg border border-gray-200 p-3 text-sm"
                        placeholder="Titre"
                        type="text"
                        id="title"
                    />
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <input
                                className="w-full rounded-lg border border-gray-200 p-3 text-sm"
                                placeholder="Date"
                                type="date"
                                id="date"
                            />
                        </div>
                        <div>
                            <input
                                className="w-full rounded-lg border border-gray-200 p-3 text-sm"
                                placeholder="Localisation"
                                type="text"
                                id="location"
                            />
                        </div>
                    </div>
                    <textarea
                        className="w-full rounded-lg border border-gray-200 p-3 text-sm"
                        placeholder="Description"
                        rows={4}
                        id="description"
                    ></textarea>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <input
                                className="w-full rounded-lg border border-gray-200 p-3 text-sm"
                                placeholder="Id étudiant"
                                type="text"
                                id="StudentId"
                            />
                        </div>
                        <div>
                            <input
                                className="w-full rounded-lg border border-gray-200 p-3 text-sm"
                                placeholder="Nom étudiant"
                                type="text"
                                id="StudentName"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="block text-sm pl-2 text-gray-700">Date de début</label>
                            <input
                                className="w-full rounded-lg border border-gray-200 p-3 text-sm"
                                placeholder="Date de début"
                                type="date"
                                id="yearStartDate"
                            />
                        </div>
                        <div>
                            <label className="block text-sm pl-2 text-gray-700">Date de fin</label>
                            <input
                                className="w-full rounded-lg border border-gray-200 p-3 text-sm"
                                placeholder="Date de fin"
                                type="date"
                                id="yearEndDate"
                            />
                        </div>
                    </div>
                    <label className="block text-sm pl-2 text-gray-700">Cours</label>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <input
                        className="w-full rounded-lg border border-gray-200 p-3 text-sm"
                        placeholder="Nom du cours"
                        type="text"
                        id="coursesName"
                    />
                    <input
                        className="w-full rounded-lg border border-gray-200 p-3 text-sm"
                        placeholder="Note"
                        type="text"
                        id="coursesGrade"
                    />
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <input
                        className="w-full rounded-lg border border-gray-200 p-3 text-sm"
                        placeholder="Resultats"
                        type="text"
                        id="coursesResult"
                    />
                    <input
                        className="w-full rounded-lg border border-gray-200 p-3 text-sm"
                        placeholder="Commentaire"
                        type="text"
                        id="coursesComment"
                    />
                    </div>
                    <input
                        className="w-full rounded-lg p-3 text-sm"
                        placeholder="Image"
                        type="file"
                        id="image"
                    />
                    <div className="mt-4 flex items-end gap-2">
                        <button
                            onClick={submit}
                            className="inline-block w-full rounded-lg bg-sky-600 px-5 py-3 font-medium text-white sm:w-auto"
                        >
                            Ajouter
                        </button>
                        <p className="text-sky-600">{message}</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Form;
