import { NextResponse } from "next/server";

type ZipData = {
  places?: {
    latitude?: string;
    longitude?: string;
  }[];
};

async function getZipCoordinates(zip: string) {
  const response = await fetch(`https://api.zippopotam.us/us/${zip}`, {
    cache: "force-cache",
  });

  if (!response.ok) return null;

  const data = (await response.json()) as ZipData;
  const place = data.places?.[0];

  if (!place?.latitude || !place?.longitude) return null;

  return {
    lat: Number(place.latitude),
    lng: Number(place.longitude),
  };
}

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function calculateDistanceMiles(
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number }
) {
  const earthRadiusMiles = 3958.8;

  const latDifference = toRadians(destination.lat - origin.lat);
  const lngDifference = toRadians(destination.lng - origin.lng);

  const a =
    Math.sin(latDifference / 2) * Math.sin(latDifference / 2) +
    Math.cos(toRadians(origin.lat)) *
      Math.cos(toRadians(destination.lat)) *
      Math.sin(lngDifference / 2) *
      Math.sin(lngDifference / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const straightLineMiles = earthRadiusMiles * c;

  return Math.round(straightLineMiles * 1.2);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const originZip = searchParams.get("originZip");
  const destinationZip = searchParams.get("destinationZip");
  const originCountry = searchParams.get("originCountry") || "US";
  const destinationCountry = searchParams.get("destinationCountry") || "US";

  if (!originZip || !destinationZip) {
    return NextResponse.json(
      { error: "Origin ZIP and destination ZIP are required." },
      { status: 400 }
    );
  }

  if (originCountry !== "US" || destinationCountry !== "US") {
    return NextResponse.json(
      { error: "Automatic mileage is currently available for US ZIPs only." },
      { status: 400 }
    );
  }

  const origin = await getZipCoordinates(originZip);
  const destination = await getZipCoordinates(destinationZip);

  if (!origin || !destination) {
    return NextResponse.json(
      { error: "Could not find coordinates for one or both ZIP codes." },
      { status: 404 }
    );
  }

  const miles = calculateDistanceMiles(origin, destination);

  return NextResponse.json({
    miles,
  });
}