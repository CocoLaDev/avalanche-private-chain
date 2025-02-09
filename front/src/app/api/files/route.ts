import { NextResponse, type NextRequest } from "next/server";
import { pinata } from "@/utils/config";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    // Récupérer le fichier envoyé
    const file: File | null = data.get("file") as unknown as File;
    // Upload du fichier via Pinata
    const uploadData = await pinata.upload.file(file);
    // Convertir le CID en URL via le gateway
    const url = await pinata.gateways.convert(uploadData.IpfsHash);
    return NextResponse.json(url, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
    );
  }
}
