import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { interests } = await req.json();
    if (!Array.isArray(interests) || !interests.length) {
      return NextResponse.json({ error: 'No interests provided' }, { status: 400 });
    }

    // Send notification via Resend to admin email
    const key = process.env.RESEND_API_KEY;
    if (key) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'SmartProIA Feedback <hola@smartproia.com>',
          to: ['hola@smartproia.com'],
          subject: `📊 Nuevo feedback: ${interests.slice(0, 2).join(', ')}`,
          html: `
            <h2 style="color:#22d3ee">Feedback SmartProIA</h2>
            <p>Un visitante indicó lo que le interesa:</p>
            <ul>
              ${interests.map((i: string) => `<li>${i}</li>`).join('')}
            </ul>
            <p style="color:#64748b;font-size:12px">smartproia.com</p>
          `,
        }),
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
