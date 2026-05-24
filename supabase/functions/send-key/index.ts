import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.text()
    if (!body.trim()) {
      return new Response(JSON.stringify({ error: 'Empty body' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { email, customerName, orderId, keys } = JSON.parse(body)

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

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err: unknown) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})