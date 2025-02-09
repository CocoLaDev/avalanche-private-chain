"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { ethers } from "ethers";

interface WalletContextProps {
    account: string | null;
    connectWallet: () => Promise<void>;
    disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextProps>({
    account: null,
    connectWallet: async () => {},
    disconnectWallet: () => {},
});

export const WalletProvider = ({ children }: { children: ReactNode }) => {
    const [account, setAccount] = useState<string | null>(null);

    // Fonction pour connecter le wallet et sauvegarder l'adresse dans le localStorage
    const connectWallet = async () => {
        if (!window.ethereum) {
            alert("MetaMask n'est pas disponible");
            return;
        }
        try {
            const accounts: string[] = await window.ethereum.request({ method: "eth_requestAccounts" });
            const connectedAccount = accounts[0];
            setAccount(connectedAccount);
            localStorage.setItem("walletAddress", connectedAccount);
        } catch (error) {
            console.error("Erreur lors de la connexion au wallet:", error);
        }
    };

    // Fonction pour déconnecter le wallet : efface l'état et le localStorage
    const disconnectWallet = () => {
        setAccount(null);
        localStorage.removeItem("walletAddress");
    };

    // Au montage, vérifier si des comptes sont déjà connectés via eth_accounts
    useEffect(() => {
        async function checkWalletConnection() {
            if (window.ethereum) {
                try {
                    const accounts: string[] = await window.ethereum.request({ method: "eth_accounts" });
                    if (accounts && accounts.length > 0) {
                        setAccount(accounts[0]);
                        localStorage.setItem("walletAddress", accounts[0]);
                    }
                } catch (error) {
                    console.error("Erreur lors de la récupération des comptes:", error);
                }
            }
        }
        checkWalletConnection();
    }, []);

    return (
        <WalletContext.Provider value={{ account, connectWallet, disconnectWallet }}>
            {children}
        </WalletContext.Provider>
    );
};

export const useWallet = () => useContext(WalletContext);
