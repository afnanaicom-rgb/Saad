const OpenAI = require('openai');
const admin = require('firebase-admin');

// إعداد Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: "afnan-b5934",
      clientEmail: "firebase-adminsdk-m9s2f@afnan-b5934.iam.gserviceaccount.com",
      privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined
    })
  });
}

const db = admin.firestore();

// إعداد Upstage OpenAI Client
const upstageApiKey = "up_m4k2esocUAcDvDM9vptkIiTJNRK4E";
const upstage = new OpenAI({
  apiKey: upstageApiKey,
  baseURL: "https://api.upstage.ai/v1"
});

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

  const { message, userId, mode, image } = req.body;
  
  if (!message && !image) {
    return res.status(400).json({ error: 'يرجى إدخال نص الرسالة أو صورة.' });
  }

  try {
    const userRef = userId ? db.collection('chat_history').doc(userId) : null;
    let history = [];

    // 1. استرجاع الذاكرة طويلة المدى من Firebase
    if (userRef) {
      const doc = await userRef.get();
      if (doc.exists) {
        history = doc.data().messages || [];
      }
    }

    // 2. إعداد الرسائل مع السياق
    const messages = [
      { role: "system", content: "أنت Afnan AI، وكيل برمجة متطور متخصص في مساعدة المبرمجين وتخزين السياق. استخدم لغة عربية احترافية." },
      ...history.slice(-10) // آخر 10 رسائل للسياق
    ];

    if (image) {
      messages.push({
        role: "user",
        content: [
          { type: "text", text: message || "ماذا يوجد في هذه الصورة؟" },
          { type: "image_url", image_url: { url: image } }
        ]
      });
    } else {
      messages.push({ role: "user", content: message });
    }

    // 3. استدعاء Upstage API مع تعطيل الـ Streaming لضمان الاستقرار
    const chatCompletion = await upstage.chat.completions.create({
      model: "solar-pro3",
      messages: messages,
      stream: false // تم التعطيل بناءً على التحليل لتجنب أخطاء الـ Parsing
    });

    const responseText = chatCompletion.choices[0].message.content;

    // 4. تحديث الذاكرة طويلة المدى في Firebase
    if (userRef) {
      history.push({ role: "user", content: message || "[صورة]" });
      history.push({ role: "assistant", content: responseText });
      
      if (history.length > 50) history = history.slice(-50);
      
      await userRef.set({ 
        messages: history, 
        lastUpdated: admin.firestore.FieldValue.serverTimestamp() 
      });
    }

    // إرجاع JSON نظيف للمتصفح
    return res.status(200).json({ output: responseText });

  } catch (error) {
    console.error('[API Error]:', error);
    return res.status(500).json({ 
      error: 'حدث خطأ أثناء معالجة طلبك.',
      details: error.message 
    });
  }
};
