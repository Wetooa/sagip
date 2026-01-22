import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

export async function GET() {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    const geojsonPath = path.join(dataDir, 'digital_census_cebu.geojson');

    // Check if GeoJSON file exists
    if (!fs.existsSync(geojsonPath)) {
      return NextResponse.json(
        { error: 'Census GeoJSON file not found' },
        { status: 404 }
      );
    }

    // Read the GeoJSON file
    const geojsonContent = fs.readFileSync(geojsonPath, 'utf-8');
    const geojsonData = JSON.parse(geojsonContent);

    return NextResponse.json(geojsonData, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error: any) {
    console.error('Error reading census GeoJSON:', error);
    return NextResponse.json(
      { error: 'Failed to load census data', details: error.message },
      { status: 500 }
    );
  }
}
