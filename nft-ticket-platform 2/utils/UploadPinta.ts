import { pinFileWithPinata, pinJsonWithPinata } from "./pinta";


export async function makeContractMetadata({
    imageFile,
    name,
    description,
    tiers, 
    totalCapacity,
    location,
  }: {
    imageFile: File;
    name: string;
    description?: string;
    tiers?: string;
    totalCapacity?: number;
    location?: string;
  }) {
    // upload image to Pinata
    const imageFileIpfsUrl = await pinFileWithPinata(imageFile);
   
    // build contract metadata json
    const metadataJson = {
      description,
      image: imageFileIpfsUrl,
      name,
      tiers,
      external_link: "https://entrytag.com",
      "properties": {
        "category": "payament"
      },
    };
   
    // upload token metadata json to Pinata and get ipfs uri
    const contractMetadataJsonUri = await pinJsonWithPinata(metadataJson);
   
    return contractMetadataJsonUri;
  }
