export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";

export async function POST(req: NextRequest) {
  const { email, source = "landing" } = await req.json();

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const redis = getRedis();
  const lead = { email, source, createdAt: new Date().toISOString() };

  await redis.set(`lead:${email}`, JSON.stringify(lead));
  await redis.sadd("leads", email);

  // Notify hola@smartproia.com
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "SmartProIA <hola@smartproia.com>",
        to: ["hola@smartproia.com"],
        subject: `🎯 Nuevo lead: ${email}`,
        html: `<p>Nuevo lead capturado desde la landing.</p><p><strong>Email:</strong> ${email}</p><p><strong>Fuente:</strong> ${source}</p><p><strong>Fecha:</strong> ${new Date().toLocaleString("es-CL")}</p>`,
      }),
    });
  } catch (e) {
    console.error("Lead notify failed:", e);
  }

  return NextResponse.json({ ok: true });
}
