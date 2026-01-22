import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Query parameter "q" is required' },
        { status: 400 },
      );
    }

    // Query Nominatim API
    const nominatimUrl = new URL("https://nominatim.openstreetmap.org/search");
    nominatimUrl.searchParams.set("q", query);
    nominatimUrl.searchParams.set("format", "geojson");
    nominatimUrl.searchParams.set("limit", "5");
    nominatimUrl.searchParams.set("countrycodes", "ph"); // Philippines
    nominatimUrl.searchParams.set("bounded", "1");
    nominatimUrl.searchParams.set("viewbox", "123.5,10.0,124.5,10.8"); // Cebu area bounding box
    nominatimUrl.searchParams.set("addressdetails", "1");

    const response = await fetch(nominatimUrl.toString(), {
      headers: {
        "User-Agent": "sagip-frontend/1.0", // Required by Nominatim
      },
    });

    if (!response.ok) {
      throw new Error(`Nominatim API error: ${response.statusText}`);
    }

    const data = await response.json();

    return NextResponse.json(data, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error: unknown) {
    console.error("Error geocoding:", error);
    return NextResponse.json(
      {
        error: "Failed to geocode location",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
