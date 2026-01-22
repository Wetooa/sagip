import { NextRequest, NextResponse } from "next/server";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api";

interface RescueNeeds {
  water?: boolean;
  food?: boolean;
  medical?: boolean;
  shelter?: boolean;
  evacuation?: boolean;
  other?: string | null;
}

interface RescueRequestResponse {
  id: string;
  citizen_id?: string | null;
  name?: string | null;
  contact?: string | null;
  household_size?: number | null;
  status: string;
  urgency: "normal" | "high" | "critical";
  latitude: number;
  longitude: number;
  needs: RescueNeeds;
  note?: string | null;
  photo_url?: string | null;
  created_at: string;
  updated_at?: string | null;
}

interface RescuePin {
  id: string;
  citizenId?: string | null;
  name?: string | null;
  contact?: string | null;
  householdSize?: number | null;
  status: string;
  urgency: "normal" | "high" | "critical";
  latitude: number;
  longitude: number;
  needs: RescueNeeds;
  note?: string | null;
  photoUrl?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}

const normalizeNeeds = (needs: RescueNeeds): RescueNeeds => ({
  water: Boolean(needs.water),
  food: Boolean(needs.food),
  medical: Boolean(needs.medical),
  shelter: Boolean(needs.shelter),
  evacuation: Boolean(needs.evacuation),
  other: needs.other ?? null,
});

const toRescuePin = (payload: RescueRequestResponse): RescuePin => ({
  id: payload.id,
  citizenId: payload.citizen_id ?? null,
  name: payload.name ?? null,
  contact: payload.contact ?? null,
  householdSize: payload.household_size ?? null,
  status: payload.status || "open",
  urgency: payload.urgency || "normal",
  latitude: payload.latitude,
  longitude: payload.longitude,
  needs: normalizeNeeds(payload.needs ?? {}),
  note: payload.note ?? null,
  photoUrl: payload.photo_url ?? null,
  createdAt: payload.created_at,
  updatedAt: payload.updated_at,
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: rescueId } = await params;

  if (!rescueId) {
    return NextResponse.json({ error: "Missing rescue ID" }, { status: 400 });
  }

  try {
    const body = await request.json();

    const response = await fetch(
      `${API_BASE}/shared/rescue/requests/${rescueId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );

    if (!response.ok) {
      const text = await response.text();
      console.error("Backend error:", text);
      return NextResponse.json(
        { error: text || "Failed to update rescue request" },
        { status: response.status },
      );
    }

    const data = (await response.json()) as RescueRequestResponse;
    const pin = toRescuePin(data);
    return NextResponse.json(pin);
  } catch (error: unknown) {
    console.error("Error updating rescue pin", error);
    return NextResponse.json(
      { error: "Failed to update rescue request" },
      { status: 500 },
    );
  }
}
