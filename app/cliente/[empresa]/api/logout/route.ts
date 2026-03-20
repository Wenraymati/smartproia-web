export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ empresa: string }> }
) {
  const { empresa } = await params;

  const response = NextResponse.redirect(
    new URL(`/cliente/${empresa}`, request.url)
  );
  response.cookies.set(`client_session_${empresa}`, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: `/cliente/${empresa}`,
  });
  return response;
}
