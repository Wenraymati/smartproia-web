export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import MercadoPagoConfig, { Preference } from "mercadopago";

function getClient(test = false) {
  return new MercadoPagoConfig({
    accessToken: test
      ? process.env.MERCADOPAGO_TEST_ACCESS_TOKEN!
      : process.env.MERCADOPAGO_ACCESS_TOKEN!,
  });
}

const PLANS = {
  basico: { title: "SmartProIA Básico", price: 14990, label: "Básico" },
  pro:    { title: "SmartProIA PRO",    price: 24990, label: "PRO"    },
} as const;

export async function GET(req: NextRequest) {
  const plan = req.nextUrl.searchParams.get("plan") as keyof typeof PLANS | null;
  const isTest = req.nextUrl.searchParams.get("test") === "true";

  if (!plan || !PLANS[plan]) {
    return NextResponse.json({ error: "Plan inválido" }, { status: 400 });
  }

  const { title, price, label } = PLANS[plan];

  const preference = new Preference(getClient(isTest));
  const result = await preference.create({
    body: {
      items: [{ id: plan, title, unit_price: price, quantity: 1, currency_id: "CLP" }],
      back_urls: {
        success: `https://smartproia.com/success?plan=${encodeURIComponent(label)}`,
        failure: `https://smartproia.com/?error=payment`,
        pending: `https://smartproia.com/success?plan=${encodeURIComponent(label)}`,
      },
      auto_return: "approved",
      notification_url: "https://smartproia.com/api/webhook",
    },
  });

  return NextResponse.redirect(result.init_point!);
}
