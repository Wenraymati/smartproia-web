import { NextResponse } from "next/server";

export const revalidate = 60; // cache 60 seconds

export async function GET() {
  try {
    const [cgRes, fngRes] = await Promise.all([
      fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true",
        { next: { revalidate: 60 } }
      ),
      fetch("https://api.alternative.me/fng/?limit=1", {
        next: { revalidate: 3600 },
      }),
    ]);

    if (!cgRes.ok) throw new Error("CoinGecko error");
    const cg = await cgRes.json();

    let fearGreed = { value: "—", classification: "" };
    if (fngRes.ok) {
      const fng = await fngRes.json();
      fearGreed = fng.data?.[0] ?? fearGreed;
    }

    return NextResponse.json({
      BTC: {
        price: cg.bitcoin?.usd ?? null,
        change24h: cg.bitcoin?.usd_24h_change ?? null,
      },
      ETH: {
        price: cg.ethereum?.usd ?? null,
        change24h: cg.ethereum?.usd_24h_change ?? null,
      },
      SOL: {
        price: cg.solana?.usd ?? null,
        change24h: cg.solana?.usd_24h_change ?? null,
      },
      fearGreed: {
        value: fearGreed.value,
        label: (fearGreed as Record<string, string>).value_classification ?? "",
      },
    });
  } catch (e) {
    console.error("prices API error:", e);
    return NextResponse.json({ error: "fetch_failed" }, { status: 502 });
  }
}
