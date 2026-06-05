import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ zip: string }> }
) {
  const { zip } = await params;

  if (!zip || zip.length < 5) {
    return NextResponse.json({ error: "Invalid ZIP" }, { status: 400 });
  }

  const response = await fetch(`https://api.zippopotam.us/us/${zip}`, {
    cache: "force-cache",
  });

  if (!response.ok) {
    return NextResponse.json({ error: "ZIP not found" }, { status: 404 });
  }

  const data = await response.json();
  const place = data.places?.[0];

  return NextResponse.json({
    city: place?.["place name"] || "",
    state: place?.["state abbreviation"] || "",
    zip,
  });
}