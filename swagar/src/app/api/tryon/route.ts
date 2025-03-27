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
    const client = await Client.connect("vdvdvdubey/OOTDiffusion4", { hf_token: `hf_${token}` });
    const result = await client.predict("/process_hd", {
      vton_img: personBlob,
      garm_img: garmentBlob,
      n_samples: 1,
      n_steps: 20,
      image_scale: 1,
      seed: -1,
    });

    // Expected structure: [ [ { image: { url: "..." } } ] ]
    // ...existing code...
    const finalImageUrl = result.data[0][0].image.url;
    console.log("Model returned URL:", finalImageUrl);

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