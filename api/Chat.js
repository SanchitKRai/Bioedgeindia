export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const message = typeof req.body?.message === 'string' ? req.body.message.trim() : '';
  const openRouterKey = process.env.OPENROUTER_API_KEY?.trim();
  const model = process.env.OPENROUTER_MODEL?.trim() || 'meta-llama/llama-3.1-8b-instruct';

  if (!message) {
    return res.status(400).json({ error: 'Message is required', reply: 'Please enter a biology question and try again.' });
  }

  if (!openRouterKey) {
    return res.status(503).json({
      error: 'Chat service unavailable',
      reply: 'The chat service is temporarily unavailable. Please try again later.'
    });
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openRouterKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content: 'You are BioEdge AI, a friendly biology assistant for Indian students. Help with biology concepts, IIT JAM/CSIR prep, biotech careers, and AI tools for biology. Keep answers concise and student-friendly. Use simple language and emojis. Always be encouraging.'
          },
          { role: 'user', content: message }
        ]
      })
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        return res.status(502).json({
          error: 'Chat provider authentication failed',
          reply: 'The chat service could not authenticate with its provider. Please try again later.'
        });
      }
      if (response.status === 404) {
        return res.status(502).json({
          error: 'Chat model unavailable',
          reply: 'The configured chat model is unavailable. Please try again later.'
        });
      }
      if (response.status === 429) {
        return res.status(429).json({
          error: 'Chat provider rate limit reached',
          reply: 'The chat service is busy right now. Please try again in a moment.'
        });
      }
      return res.status(502).json({
        error: 'Chat provider request failed',
        reply: 'Sorry, the chat service is temporarily unavailable. Please try again later.'
      });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content?.trim();
    if (!reply) {
      return res.status(502).json({
        error: 'Empty chat provider response',
        reply: 'Sorry, I could not generate a response. Please try again.'
      });
    }

    res.status(200).json({ reply });
  } catch {
    res.status(502).json({ error: 'API error', reply: 'Sorry, the chat service is temporarily unavailable. Please try again later.' });
  }
}
