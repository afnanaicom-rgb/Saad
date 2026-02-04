const OpenAI = require('openai');
const admin = require('firebase-admin');

// إعداد Firebase Admin
try {
  if (!admin.apps.length) {
    const serviceAccount = {
      projectId: "afnan-b5934",
      clientEmail: "firebase-adminsdk-m9s2f@afnan-b5934.iam.gserviceaccount.com",
      privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined
    };

    if (serviceAccount.privateKey) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
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

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  try {
    const { message, userId, mode, image } = req.body;
    
    let history = [];
    let userRef = null;

    if (userId && admin.apps.length) {
      try {
        const db = admin.firestore();
        userRef = db.collection('chat_history').doc(userId);
        const doc = await userRef.get();
        if (doc.exists) history = doc.data().messages || [];
      } catch (e) {}
    }

    // تعزيز الهوية (System Prompt)
    const systemPrompt = "أنت Afnan AI، وكيل ذكي متطور متخصص في البرمجة والحلول التقنية. تم تطويرك بواسطة شركة Afnan. لا تذكر أي معلومات عن شركات أخرى مثل Upstage أو OpenAI أو Google. إذا سُئلت عن مطورك، قل 'شركة Afnan'. لا تذكر حجم النموذج أو كونه مفتوح المصدر أو أي تفاصيل تقنية تخص النماذج الأصلية. أنت وكيل ذكي فائق القدرة.";

    const messages = [
      { role: "system", content: systemPrompt },
      ...history.slice(-10)
    ];

    if (image) {
      // التأكد من تنسيق الصورة بشكل صحيح لـ Upstage
      const base64Data = image.includes(',') ? image.split(',')[1] : image;
      messages.push({
        role: "user",
        content: [
          { type: "text", text: message || "حلل هذه الصورة برمجياً." },
          { type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64Data}` } }
        ]
      });
    } else {
      messages.push({ role: "user", content: message });
    }

    const chatCompletion = await upstage.chat.completions.create({
      model: "solar-pro3",
      messages: messages,
      stream: false
    });

    const responseText = chatCompletion.choices[0].message.content;

    if (userRef) {
      history.push({ role: "user", content: message || "[صورة]" });
      history.push({ role: "assistant", content: responseText });
      if (history.length > 50) history = history.slice(-50);
      await userRef.set({ messages: history, lastUpdated: admin.firestore.FieldValue.serverTimestamp() }).catch(()=>{});
    }

    return res.status(200).json({ output: responseText });

  } catch (error) {
    console.error('[API Error]:', error);
    return res.status(200).json({ output: "عذراً، واجهت مشكلة في معالجة طلبك. يرجى المحاولة مرة أخرى." });
  }
};
