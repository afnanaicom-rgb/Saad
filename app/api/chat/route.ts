import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: 'يرجى إدخال نص الرسالة.' },
        { status: 400 }
      );
    }

    // المفتاح محمي - لا يتم تعريضه للعميل
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
    const MODEL_NAME = 'sourceful/riverflow-v2-pro';

    if (!OPENROUTER_API_KEY) {
      console.error('[Chat API] OpenRouter API key not configured');
      return NextResponse.json(
        { error: 'خطأ في إعدادات الخادم' },
        { status: 500 }
      );
    }

    console.log(`[Chat API] Calling OpenRouter for model: ${MODEL_NAME}`);

    const response = await axios({
      method: 'post',
      url: 'https://openrouter.ai/api/v1/chat/completions',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      data: {
        model: MODEL_NAME,
        messages: [{ role: 'user', content: message }],
      },
      timeout: 30000,
    });

    if (response.data && response.data.choices) {
      return NextResponse.json({
        output: response.data.choices[0].message.content,
      });
    } else {
      throw new Error('Unexpected response format from OpenRouter');
    }
  } catch (error: any) {
    console.error('[Chat API Error]', error.message);

    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data));

      if (error.response.status === 401) {
        return NextResponse.json(
          {
            error: 'خطأ في مصادقة API Key الخاص بـ OpenRouter.',
            details: 'تأكد من أن المفتاح صحيح ولم يتم حذفه.',
          },
          { status: 401 }
        );
      }

      if (error.response.data?.error?.message) {
        return NextResponse.json(
          {
            error: `خطأ من OpenRouter: ${error.response.data.error.message}`,
            code: error.response.data.error.code,
          },
          { status: error.response.status }
        );
      }
    }

    return NextResponse.json(
      {
        error: 'حدث خطأ في الاتصال بـ OpenRouter.',
        debug: error.message,
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
      'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
    },
  });
}
