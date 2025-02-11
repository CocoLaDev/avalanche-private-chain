// front/src/context/WalletContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { ethers } from "ethers";

interface WalletContextProps {
    account: string | null;
    connectWallet: () => Promise<void>;
    disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextProps | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
    const [account, setAccount] = useState<string | null>(
        typeof window !== "undefined" ? localStorage.getItem("walletAddress") : null
    );

    const connectWallet = async () => {
        if (typeof window.ethereum === "undefined") {
            alert("MetaMask n'est pas disponible");
            return;
        }
        try {
            // Demande de connexion à MetaMask
            const accounts: string[] = await window.ethereum.request({ method: "eth_requestAccounts" });
            const selectedAccount = accounts[0];
            setAccount(selectedAccount);
            localStorage.setItem("walletAddress", selectedAccount);
            console.log("Wallet connected:", selectedAccount);
            // Optionnel : rafraîchir la page pour mettre à jour l'affichage
            // window.location.reload();
        } catch (error) {
            console.error("Erreur lors de la connexion du wallet:", error);
        }
    };

    const disconnectWallet = () => {
        // Efface l'adresse dans l'état et dans le localStorage
        setAccount(null);
        localStorage.removeItem("walletAddress");
        console.log("Wallet déconnecté");
        // Optionnel : rafraîchir la page pour mettre à jour l'affichage
        // window.location.reload();
    };

    return (
        <WalletContext.Provider value={{ account, connectWallet, disconnectWallet }}>
            {children}
        </WalletContext.Provider>
    );
};

export const useWallet = (): WalletContextProps => {
    const context = useContext(WalletContext);
    if (context === undefined) {
        throw new Error("useWallet must be used within a WalletProvider");
    }
    return context;
};
