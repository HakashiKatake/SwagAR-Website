// pages/api/tryon.ts
import type { NextApiRequest, NextApiResponse } from "next";

import multer from "multer";
import { Client } from "@gradio/client";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

export const config = {
  api: {
    bodyParser: false,
  },
};

const upload = multer({ storage: multer.memoryStorage() });

interface NextApiRequestWithFiles extends NextApiRequest {
  files: {
    [fieldname: string]: Express.Multer.File[];
  };
}

// Use the default export from nextConnect via the namespace import.
const apiRoute = nextConnect.default<NextApiRequest, NextApiResponse>();

apiRoute.use(upload.fields([{ name: "person" }, { name: "garment" }]));

apiRoute.post(async (req: NextApiRequestWithFiles, res: NextApiResponse) => {
  try {
    const personFile = req.files["person"]?.[0];
    const garmentFile = req.files["garment"]?.[0];

    if (!personFile || !garmentFile) {
      return res.status(400).json({ success: false, error: "Missing files." });
    }

    const personBlob = new Blob([personFile.buffer], { type: personFile.mimetype });
    const garmentBlob = new Blob([garmentFile.buffer], { type: garmentFile.mimetype });

    const token = process.env.HF_TOKEN;
    const client = await Client.connect("levihsu/OOTDiffusion", { token });
    const result = await client.predict("/process_hd", {
      vton_img: personBlob,
      garm_img: garmentBlob,
      n_samples: 1,
      n_steps: 20,
      image_scale: 1,
      seed: -1,
    });

    // Expected structure: [ [ { image: { url: "..." } } ] ]
    const finalImageUrl = result.data[0][0].image.url;
    console.log("Model returned URL:", finalImageUrl);

    const imageResponse = await fetch(finalImageUrl);
    const arrayBuffer = await imageResponse.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString("base64");
    const base64String = `data:image/webp;base64,${base64Data}`;

    res.status(200).json({ success: true, data: base64String });
  } catch (error: any) {
    console.error("Error in /api/tryon:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default apiRoute;
