const OpenAI = require('openai');
const admin = require('firebase-admin');

// إعداد Firebase Admin مع معالجة الخطأ إذا لم تتوفر المفاتيح
try {
  if (!admin.apps.length) {
    const serviceAccount = {
      projectId: "afnan-b5934",
      clientEmail: "firebase-adminsdk-m9s2f@afnan-b5934.iam.gserviceaccount.com",
      // استخدام متغير البيئة للمفتاح الخاص، مع التأكد من معالجة الـ Newlines
      privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined
    };

    // لا نقوم بتهيئة Firebase إذا لم يتوفر المفتاح الخاص لتجنب كسر الدالة بالكامل في Vercel
    if (serviceAccount.privateKey) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    } else {
      console.warn("FIREBASE_PRIVATE_KEY is missing. Long-term memory will be disabled.");
    }
  }
} catch (e) {
  console.error("Firebase Init Error:", e);
}

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

  try {
    const { message, userId, mode, image } = req.body;
    
    if (!message && !image) {
      return res.status(400).json({ error: 'يرجى إدخال نص الرسالة أو صورة.' });
    }

    let history = [];
    let userRef = null;

    // محاولة استرجاع الذاكرة فقط إذا كان Firebase مهيأ
    if (userId && admin.apps.length) {
      try {
        const db = admin.firestore();
        userRef = db.collection('chat_history').doc(userId);
        const doc = await userRef.get();
        if (doc.exists) {
          history = doc.data().messages || [];
        }
      } catch (dbError) {
        console.error("Firestore Error:", dbError);
        // نكمل بدون ذاكرة إذا فشل Firestore
      }
    }

    const messages = [
      { role: "system", content: "أنت Afnan AI، وكيل برمجة متطور متخصص في مساعدة المبرمجين وتخزين السياق. استخدم لغة عربية احترافية." },
      ...history.slice(-10)
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

    // استدعاء Upstage
    const chatCompletion = await upstage.chat.completions.create({
      model: "solar-pro3",
      messages: messages,
      stream: false
    });

    const responseText = chatCompletion.choices[0].message.content;

    // تحديث الذاكرة في الخلفية (اختياري)
    if (userRef) {
      try {
        history.push({ role: "user", content: message || "[صورة]" });
        history.push({ role: "assistant", content: responseText });
        if (history.length > 50) history = history.slice(-50);
        await userRef.set({ 
          messages: history, 
          lastUpdated: admin.firestore.FieldValue.serverTimestamp() 
        });
      } catch (saveError) {
        console.error("Save History Error:", saveError);
      }
    }

    return res.status(200).json({ output: responseText });

  } catch (error) {
    console.error('[API Error]:', error);
    // نضمن دائماً إرجاع JSON حتى في حالة الخطأ
    return res.status(500).json({ 
      error: 'حدث خطأ في الخادم أثناء معالجة طلبك.',
      details: error.message 
    });
  }
};
