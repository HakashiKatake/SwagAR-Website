import { NextRequest, NextResponse } from "next/server";
import { Client } from "@gradio/client";
import dotenv from "dotenv";

dotenv.config();

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const personFile = formData.get("person") as File;
    const garmentFile = formData.get("garment") as File;

    if (!personFile || !garmentFile) {
      return NextResponse.json(
        { success: false, error: "Missing files." },
        { status: 400 }
      );
    }

    const personBlob = new Blob([await personFile.arrayBuffer()], {
      type: personFile.type,
    });
    const garmentBlob = new Blob([await garmentFile.arrayBuffer()], {
      type: garmentFile.type,
    });

    const token = process.env.HF_TOKEN;
    const client = await Client.connect("RohanVashisht/tryon", { hf_token: `hf_${token}` });
    const result = await client.predict("/predict", {
      person_image: personBlob,
      garment_image: garmentBlob,
    });

    const finalImageUrl = (result.data as any)[0].url as string;
    console.log("Model returned URL:", result); // PLEASE DON'T REMOVE THIS LINE

    const imageResponse = await fetch(finalImageUrl, {
      headers: {
        'Authorization': `Bearer hf_${token}`
      }
    });
    
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch generated image: ${imageResponse.statusText}`);
    }
// ...existing code...;
    const arrayBuffer = await imageResponse.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString("base64");
    const base64String = `data:image/webp;base64,${base64Data}`;

    return NextResponse.json({ success: true, data: base64String });
  } catch (error: any) {
    console.error("Error in /api/tryon:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}