import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

// CORS-заголовки, если будешь звать из браузера
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST',
  'Access-Control-Allow-Headers': 'Content-Type',
};

serve(async (req) => {
  // 1. ОБЯЗАТЕЛЬНО handle OPTIONS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders, status: 200 });
  }

  try {
    const rawBody = await req.text();
    console.log('Raw body:', rawBody); // ← здесь будет видно, что приходит

    if (!rawBody || rawBody.trim() === '') {
      return new Response(
        JSON.stringify({ error: 'Empty body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let data: {
      email: string;
      customerName: string;
      orderId: string;
      keys: string[];
    };

    try {
      data = JSON.parse(rawBody);
    } catch (err) {
      console.error('JSON parse error:', err);
      return new Response(
        JSON.stringify({ error: 'Invalid JSON' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { email, customerName, orderId, keys } = data;

    // Send to Resend
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Ваши ключи активации',
        html: `
          <h2>Спасибо, ${customerName}!</h2>
          <p>Заказ #${orderId.slice(0, 8).toUpperCase()}</p>
          <p>Ваши ключи:</p>
          ${keys.map((k: string) => `
            <div style="background:#0f172a;padding:12px;border-radius:8px;margin:8px 0;">
              <code style="color:#67e8f9;font-size:16px;letter-spacing:2px;">${k}</code>
            </div>
          `).join('')}
          <p style="color:#94a3b8;font-size:12px;">Сохраните письмо.</p>
        `,
      }),
    });

    const resendData = await res.json();
    console.log('Resend response:', JSON.stringify(resendData));

    return new Response(
      JSON.stringify({ success: true, resend: resendData }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error('Error:', err);
    return new Response(
      JSON.stringify({ error: err.message ?? 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});