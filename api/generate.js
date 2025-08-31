export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const prompt = req.body.prompt;
  
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const response = await fetch(
      "https://router.huggingface.co/nebius/v1/images/generations",
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          response_format: "b64_json",
          prompt: prompt,
          model: "stability-ai/sdxl",
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Hugging Face API returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.b64_json) {
      throw new Error('No image data received from API');
    }

    res.status(200).json({ image: `data:image/png;base64,${data.b64_json}` });
  } catch (error) {
    console.error('API error:', error.message);
    res.status(500).json({ 
      error: 'Image generation failed',
      details: error.message 
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};
