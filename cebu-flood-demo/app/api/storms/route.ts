import { NextResponse } from "next/server";

const ZOOM_BASE = "https://zoom.earth/data/storms/";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const date = searchParams.get("date");
  const to = searchParams.get("to") || "12";

  const targetUrl = id
    ? `${ZOOM_BASE}?id=${encodeURIComponent(id)}`
    : `${ZOOM_BASE}?date=${encodeURIComponent(
        (date || new Date().toISOString().split("T")[0]) + "T00:00Z"
      )}&to=${encodeURIComponent(to)}`;

  try {
    const upstream = await fetch(targetUrl, {
      headers: {
        "User-Agent": "sagip-cebu-flood-demo",
        Accept: "application/json, */*",
      },
      next: { revalidate: 600 },
    });

    if (!upstream.ok) {
      return NextResponse.json(
        { error: "Upstream error", status: upstream.status },
        { status: upstream.status }
      );
    }

    const data = await upstream.json();
    return NextResponse.json(data, {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: "Failed to fetch storms", detail: String(error) },
      { status: 500 }
    );
  }
}

export function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    }
  );
}
