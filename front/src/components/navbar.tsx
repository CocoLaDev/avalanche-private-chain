"use client";
import Image from "next/image";
import logo from "/public/logo.png";
import Link from "next/link";
import { useWallet } from "@/context/WalletContext";

const Navbar = () => {
    const { account, connectWallet, disconnectWallet } = useWallet();

    return (
        <header className="bg-white">
            <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="md:flex md:items-center md:gap-12">
                        <a className="block text-sky-600" href="#">
                            <span className="sr-only">Home</span>
                            <Image className="w-20" src={logo} alt="logo" />
                        </a>
                    </div>

                    <div className="hidden md:block">
                        <nav aria-label="Global">
                            <ul className="flex items-center gap-6 text-sm">
                                <li>
                                    <Link className="text-gray-500 transition hover:text-gray-500/75" href="/Diplomes">
                                        Tous les diplômes
                                    </Link>
                                </li>
                                <li>
                                    <Link className="text-gray-500 transition hover:text-gray-500/75" href="/Ajouter">
                                        Ajouter un diplôme
                                    </Link>
                                </li>
                                <li>
                                    <Link className="text-gray-500 transition hover:text-gray-500/75" href="/MesDiplomes">
                                        Mes diplômes
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="sm:flex sm:gap-4">
                            {!account ? (
                                <button
                                    onClick={connectWallet}
                                >
                                    Connect Wallet
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={disconnectWallet}
                                        className="rounded-md bg-red-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm"
                                    >
                                        Disconnect
                                    </button>
                                    <button
                                        className="rounded-md bg-gray-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm"
                                        disabled
                                    >
                                        Wallet Connected
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                {account && (
                    <div className="mt-2 text-center text-sm text-gray-700">
                        Connected: {account}
                    </div>
                )}
            </div>
        </header>
    );
};

export default Navbar;
