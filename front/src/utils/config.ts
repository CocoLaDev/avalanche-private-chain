import axios from "axios";

export const pinata = {
  upload: {
    file: async (file: File) => {
      const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";
      const formData = new FormData();
      formData.append("file", file);
      const response = await axios.post(url, formData, {
        maxContentLength: Infinity,
        headers: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          "Content-Type": `multipart/form-data; boundary=${(formData as any)._boundary}`,
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`
        }
      });
      return response.data;
    }
  },
  gateways: {
    convert: async (ipfsHash: string) => {
      // Ici, on suppose que le gateway est configuré via la variable d'environnement NEXT_PUBLIC_GATEWAY_URL
      return `https://${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${ipfsHash}`;
    }
  }
};
