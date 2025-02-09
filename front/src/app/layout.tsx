import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar";
import { WalletProvider } from "@/context/WalletContext";

export const metadata: Metadata = {
    title: "ESGI Private blockchain",
    description: "Generate certificates, store them on a private blockchain.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body>
        <WalletProvider>
            <Navbar />
            {children}
        </WalletProvider>
        </body>
        </html>
    );
}
