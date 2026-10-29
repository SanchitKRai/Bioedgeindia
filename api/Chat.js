export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const message = typeof req.body?.message === 'string' ? req.body.message.trim() : '';
  const history = Array.isArray(req.body?.history) ? req.body.history : [];
  const stream = req.body?.stream === true;
  const openRouterKey = process.env.OPENROUTER_API_KEY?.trim();
  const model = process.env.OPENROUTER_MODEL?.trim() || 'meta-llama/llama-3.1-8b-instruct';

  if (!message) {
    return res.status(400).json({ error: 'Message is required', reply: 'Please enter a biology question and try again.' });
  }
  if (message.length > 4000) {
    return res.status(400).json({ error: 'Message too long', reply: 'Please keep your question under 4,000 characters.' });
  }

  if (!openRouterKey) {
    return res.status(503).json({
      error: 'Chat service unavailable',
      reply: 'The chat service is temporarily unavailable. Please try again later.'
    });
  }

  const messages = [
    {
      role: 'system',
      content: 'You are Rosier, a friendly biology assistant for Indian students. Help with biology concepts, IIT JAM/CSIR prep, biotech careers, and AI tools for biology. Keep answers concise and student-friendly. Use simple language and emojis. Always be encouraging.'
    },
    ...history
      .filter(item => item && (item.role === 'user' || item.role === 'assistant') && typeof item.content === 'string')
      .slice(-10)
      .map(item => ({ role: item.role, content: item.content.slice(0, 4000) })),
    { role: 'user', content: message }
  ];

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45000);
  if (typeof req.on === 'function') req.on('close', () => controller.abort());
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openRouterKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: 1200,
        stream
      }),
      signal: controller.signal
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

    if (stream) {
      res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache, no-transform');
      res.setHeader('Connection', 'keep-alive');
      const reader = response.body?.getReader();
      if (!reader) return res.status(502).json({ error: 'Invalid chat provider response', reply: 'Sorry, I could not generate a response. Please try again.' });
      const decoder = new TextDecoder();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          res.write(decoder.decode(value, { stream: true }));
        }
      } finally {
        reader.releaseLock();
      }
      return res.end();
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
  } catch (error) {
    if (error?.name === 'AbortError') {
      return res.status(504).json({ error: 'Chat request timed out', reply: 'The response took too long. Please try again.' });
    }
    res.status(502).json({ error: 'API error', reply: 'Sorry, the chat service is temporarily unavailable. Please try again later.' });
  } finally {
    clearTimeout(timeout);
  }
}
