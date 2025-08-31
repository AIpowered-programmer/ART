// /api/generate.js
import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const prompt = req.body.prompt;

  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2",
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
        },
        responseType: "arraybuffer", // get raw image bytes
      }
    );

    const base64Image = Buffer.from(response.data, "binary").toString("base64");
    res.status(200).json({ image: `data:image/png;base64,${base64Image}` });
  } catch (error) {
    console.error("Error generating image:", error.response?.data || error.message);
    res.status(500).json({ error: "Image generation failed" });
  }
}
