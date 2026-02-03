const { GoogleGenerativeAI } = require("@google/generative-ai");

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyB32g3QF5BVcQj6iU7O1e-t3rndAOqw1w0";
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ output: text });

  } catch (error) {
    console.error('Gemini API Error:', error.message);
    res.status(500).json({ error: 'حدث خطأ في الخادم أثناء معالجة طلبك عبر Gemini' });
  }
}
