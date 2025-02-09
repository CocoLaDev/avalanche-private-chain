// front/src/services/uploadFile.ts
import { Diplome } from "@/interfaces/diplomes";

/**
 * Télécharge un fichier et renvoie l'URL IPFS (CID) via l'API de votre backend.
 */
export const uploadFile = async ({ file }: { file: File }): Promise<string | null> => {
    try {
        if (!file) {
            alert("Aucun fichier sélectionné");
            return null;
        }

        const data = new FormData();
        data.set("file", file);
        const uploadRequest = await fetch("/api/files", {
            method: "POST",
            body: data,
        });
        const ipfsUrl = await uploadRequest.json();
        return ipfsUrl;
    } catch (e) {
        console.log(e);
        alert("Problème lors du téléchargement du fichier");
        return null;
    }
};

/**
 * Télécharge un JSON (les métadonnées) et renvoie le CID via l'API de votre backend.
 */
export const uploadJson = async (diplome: Diplome): Promise<string | null> => {
    try {
        if (!diplome.date || !diplome.description || !diplome.image || !diplome.location || !diplome.title) {
            alert("Données manquantes pour le téléchargement");
            return null;
        }

        const data = new FormData();
        data.set("file", new Blob([JSON.stringify(diplome)], { type: "application/json" }));
        const uploadRequest = await fetch("/api/files", {
            method: "POST",
            body: data,
        });
        const ipfsUrl = await uploadRequest.json();
        return ipfsUrl;
    } catch (e) {
        console.log(e);
        alert("Problème lors du téléchargement du fichier JSON");
        return null;
    }
};
