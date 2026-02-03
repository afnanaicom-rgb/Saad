const axios = require('axios');

// Vercel Serverless Function Handler
module.exports = async (req, res) => {
  // 1. إعدادات CORS الشاملة لضمان عدم رفض الطلب من المتصفح
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // معالجة طلب OPTIONS (Pre-flight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 2. التحقق من طريقة الطلب
  if (req.method !== 'POST') {
    console.error(`[Error] Method ${req.method} not allowed`);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // 3. استخراج البيانات والتحقق منها
  const { message, mode, isPro } = req.body;
  console.log(`[Info] Received message: "${message ? message.substring(0, 50) : 'EMPTY'}" | Mode: ${mode}`);

  if (!message) {
    return res.status(400).json({ error: 'يرجى إدخال نص الرسالة.' });
  }

  // 4. إعدادات OpenRouter
  const OPENROUTER_API_KEY = "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";
  const MODEL_NAME = "sourceful/riverflow-v2-pro";

  try {
    console.log(`[Info] Calling OpenRouter with model: ${MODEL_NAME}`);
    
    const response = await axios({
      method: 'post',
      url: 'https://openrouter.ai/api/v1/chat/completions',
      timeout: 55000, // Vercel Pro timeout is 60s, Hobby is 10s. Using 55s as max limit.
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://afnanai.com',
        'X-Title': 'Afnan AI'
      },
      data: {
        model: MODEL_NAME,
        messages: [
          { 
            role: "system", 
            content: "أنت أفنان 1.2، وكيل ذكاء اصطناعي متخصص في البرمجة. إجاباتك دقيقة وبرمجية." 
          },
          { role: "user", content: message }
        ]
      }
    });

    if (response.data && response.data.choices && response.data.choices[0]) {
      const aiResponse = response.data.choices[0].message.content;
      console.log(`[Success] AI Response received (length: ${aiResponse.length})`);
      return res.status(200).json({ output: aiResponse });
    } else {
      console.error('[Error] Invalid response structure from OpenRouter:', JSON.stringify(response.data));
      throw new Error('Invalid response from AI provider');
    }

  } catch (error) {
    // 5. تحليل الخطأ بالتفصيل للظهور في Vercel Logs
    console.error('[Critical Error] Details:');
    if (error.response) {
      // الخطأ قادم من OpenRouter (مثل 401 أو 429)
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data));
      
      const status = error.response.status;
      if (status === 401) return res.status(500).json({ error: 'خطأ في مصادقة API Key. يرجى التأكد من رصيد OpenRouter.' });
      if (status === 429) return res.status(500).json({ error: 'تم تجاوز حد الطلبات المسموح به.' });
      
    } else if (error.request) {
      // لم يتم استلام رد (مشكلة شبكة أو Timeout)
      console.error('No response received from OpenRouter. Possible timeout.');
      return res.status(504).json({ error: 'استغرق الخادم وقتاً طويلاً للرد. يرجى المحاولة لاحقاً.' });
    } else {
      // خطأ في إعداد الطلب
      console.error('Request Setup Error:', error.message);
    }

    return res.status(500).json({ 
      error: 'حدث خطأ في معالجة الطلب برمجياً.',
      debug_info: error.message 
    });
  }
};
