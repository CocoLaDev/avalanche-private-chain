// uploadJSON.js
const axios = require("axios");
const fs = require("fs");
import "dotenv/config";

async function uploadJSON(filePath) {
    const url = "https://api.pinata.cloud/pinning/pinJSONToIPFS";
    let jsonData;
    try {
        const fileContent = fs.readFileSync(filePath, "utf8");
        jsonData = JSON.parse(fileContent);
    } catch (error) {
        console.error("Error reading JSON file:", error.message);
        return null;
    }
    try {
        const response = await axios.post(url, jsonData, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
            },
        });
        console.log(`File ${filePath} uploaded successfully! CID: ${response.data.IpfsHash}`);
        return response.data.IpfsHash;
    } catch (error) {
        console.error("Error uploading JSON to Pinata:", error.response ? error.response.data : error.message);
        return null;
    }
}

module.exports = { uploadJSON };
