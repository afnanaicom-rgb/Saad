const axios = require('axios');

module.exports = async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'يرجى إدخال نص الرسالة.' });
  }

  // استخدام المفتاح والنموذج اللذين زودتني بهما
  const OPENROUTER_API_KEY = "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";
  const MODEL_NAME = "sourceful/riverflow-v2-pro";

  try {
    console.log(`[Attempt] Calling OpenRouter for model: ${MODEL_NAME}`);
    
    const response = await axios({
      method: 'post',
      url: 'https://openrouter.ai/api/v1/chat/completions',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      data: {
        model: MODEL_NAME,
        messages: [{ role: "user", content: message }]
      },
      timeout: 30000
    });

    if (response.data && response.data.choices) {
      return res.status(200).json({ output: response.data.choices[0].message.content });
    } else {
      throw new Error('Unexpected response format');
    }

  } catch (error) {
    console.error('[OpenRouter Error]');
    
    if (error.response) {
      // طباعة تفاصيل الخطأ القادم من OpenRouter في الـ Logs
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data));
      
      const errorData = error.response.data;
      
      // إذا كان الخطأ هو 401، فهذا يعني أن المفتاح مرفوض
      if (error.response.status === 401) {
        return res.status(401).json({ 
          error: 'خطأ في مصادقة API Key الخاص بـ OpenRouter.',
          details: 'تأكد من أن المفتاح صحيح ولم يتم حذفه من لوحة تحكم OpenRouter.'
        });
      }
      
      // إذا كان هناك رسالة خطأ محددة من OpenRouter
      if (errorData.error && errorData.error.message) {
        return res.status(error.response.status).json({ 
          error: `خطأ من OpenRouter: ${errorData.error.message}`,
          code: errorData.error.code
        });
      }
    }

    return res.status(500).json({ 
      error: 'حدث خطأ في الاتصال بـ OpenRouter.',
      debug: error.message 
    });
  }
};
