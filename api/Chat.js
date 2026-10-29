export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { message } = req.body;
  const GEMINI_KEY = process.env.GEMINI_API_KEY || process.env.GEMINI_KEY;

  if (!GEMINI_KEY || GEMINI_KEY === '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' || GEMINI_KEY.trim() === '') {
    return res.status(200).json({
      reply: "Diagnostics Alert: The environment variable 'GEMINI_API_KEY' is missing, empty, or undefined in your Vercel Project Settings. Please go to Vercel Dashboard -> Settings -> Environment Variables, add a key named exactly 'GEMINI_API_KEY' with your Google AI Studio API key, and then click 'Redeploy' on your Vercel deployment."
    });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: 'You are BioEdge AI, a friendly biology assistant for Indian students. Help with biology concepts, IIT JAM/CSIR prep, biotech careers, and AI tools for biology. Keep answers concise and student-friendly. Use simple language and emojis. Always be encouraging.' }]
          },
          contents: [{ parts: [{ text: message }] }]
        })
      }
    );

    const data = await response.json();
    
    if (data.error) {
      const keySnippet = GEMINI_KEY ? `${GEMINI_KEY.substring(0, 6)}...${GEMINI_KEY.substring(GEMINI_KEY.length - 4)}` : 'none';
      const keyLength = GEMINI_KEY ? GEMINI_KEY.length : 0;
      return res.status(200).json({ 
        reply: `Google Gemini API Error: ${data.error.message} (Code: ${data.error.code}).\n\n[System Diagnostics] Vercel is currently reading a key of length ${keyLength} that looks like: '${keySnippet}'. Please check if this matches your Google AI Studio API key exactly. If it is different or empty, it means Vercel is still deploying/caching the old variable value, or you have not completed Step 3 (Redeployment) after updating it.` 
      });
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, try again! The response from Gemini was empty.';
    res.status(200).json({ reply });
  } catch (err) {
    res.status(500).json({ error: 'API error', reply: 'Sorry, connection error to Gemini. Please try again later.' });
  }
}
