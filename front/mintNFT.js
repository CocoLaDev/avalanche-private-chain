// mintNFT.js
require("dotenv").config({ path: "./.env" }); // O ajusta la ruta según corresponda

const { ethers } = require("ethers");
const path = require("path");
const { uploadJSON } = require("./uploadJSON"); // Asegúrate de que la ruta es correcta

// Cargar el ABI del contrato NFT (asegúrate de usar solo la propiedad "abi")
const nftAbi = require("./src/abis/ESGI_diplomes.json").abi;

async function main() {
    // Variables de entorno
    const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL;
    const privateKey = process.env.PRIVATE_KEY?.trim();
    const gatewayUrl = process.env.NEXT_PUBLIC_GATEWAY_URL;
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

    console.log("RPC URL:", rpcUrl);
    console.log("Contract Address from .env:", contractAddress);

    if (!contractAddress) {
        throw new Error("La dirección del contrato no está definida en NEXT_PUBLIC_CONTRACT_ADDRESS");
    }

    // Crear proveedor y signer
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const signer = new ethers.Wallet(privateKey, provider);

    // Instanciar el contrato
    const nftContract = new ethers.Contract(contractAddress, nftAbi, signer);

    // Definir las rutas absolutas a los archivos de metadata
    const programmePath = path.join(__dirname, "../esgi-nft-dynamics/metadata/programme.json");
    const performancePath = path.join(__dirname, "../esgi-nft-dynamics/metadata/performance.json");

    console.log("Uploading programme metadata...");
    const programmeCid = await uploadJSON(programmePath);
    if (!programmeCid) {
        throw new Error("Failed to upload programme metadata");
    }
    const programmeUrl = `https://${gatewayUrl}/ipfs/${programmeCid}`;
    console.log("Programme metadata URL:", programmeUrl);

    console.log("Uploading performance metadata...");
    const performanceCid = await uploadJSON(performancePath);
    if (!performanceCid) {
        throw new Error("Failed to upload performance metadata");
    }
    const performanceUrl = `https://${gatewayUrl}/ipfs/${performanceCid}`;
    console.log("Performance metadata URL:", performanceUrl);

    // Mint un NFT de Diplôme (Programme)
    console.log("Minting Diplôme NFT...");
    const txDiplome = await nftContract.mint(
        await signer.getAddress(), // La cuenta que recibirá el NFT
        programmeUrl,
        0,  // 0: Diplôme
        0   // diplomeId = 0 para un nuevo diplôme
    );
    console.log("Diplôme NFT mint transaction sent:", txDiplome.hash);
    await txDiplome.wait();
    console.log("Diplôme NFT minted successfully.");

    // Mint un NFT de Performance asociado al Diplôme minté (diplomeId = 0)
    console.log("Minting Performance NFT...");
    const txPerformance = await nftContract.mint(
        await signer.getAddress(),
        performanceUrl,
        1,  // 1: Performance
        0   // Asociado al Diplôme con tokenId 0
    );
    console.log("Performance NFT mint transaction sent:", txPerformance.hash);
    await txPerformance.wait();
    console.log("Performance NFT minted successfully.");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error minting NFT:", error);
        process.exit(1);
    });
