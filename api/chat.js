const axios = require('axios');

export default async function handler(req, res) {
  // CORS Headers for Vercel Serverless Functions
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { message, mode, isPro } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Restriction for Max model
    if (mode === 'max' && !isPro) {
        return res.status(403).json({ error: 'نموذج Max متاح فقط لمشتركي خطة Pro.' });
    }

    // Configuration from server.js
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "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";
    const MODEL_NAME = "sourceful/riverflow-v2-pro";

    const systemMsg = `أنت أفنان 1.2، وكيل ذكاء اصطناعي متخصص حصرياً في البرمجة. 
    قدراتك تشمل:
    1. التعامل مع GitHub: يمكنك تحليل الملفات، إنشاء ملفات جديدة، وتعديل الكود.
    2. لغات البرمجة: خبير في كافة اللغات والأطر البرمجية.
    3. نظام الرصيد: أنت تعرف أن Flash يستهلك رصيداً عادياً بينما Max يستهلك الضعف.
    يجب أن تكون إجاباتك دقيقة وبرمجية بحتة.`;

    const response = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
        model: MODEL_NAME,
        messages: [
            { role: "system", content: systemMsg },
            { role: "user", content: message }
        ]
    }, {
        headers: {
            "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://afnan-ai.vercel.app", // Optional for OpenRouter
            "X-Title": "Afnan AI" // Optional for OpenRouter
        },
        timeout: 30000 // 30 seconds timeout
    });

    if (response.data && response.data.choices && response.data.choices[0]) {
        res.status(200).json({ output: response.data.choices[0].message.content });
    } else {
        throw new Error('Invalid response from OpenRouter');
    }

  } catch (error) {
    console.error('API Error:', error.response ? error.response.data : error.message);
    res.status(500).json({ 
        error: 'حدث خطأ في الخادم أثناء معالجة طلبك.',
        details: error.message 
    });
  }
}
