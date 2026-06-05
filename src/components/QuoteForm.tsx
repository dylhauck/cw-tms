"use client";

import { useMemo, useState } from "react";

type CustomerUser = {
  id: string;
  firstName: string;
  lastName: string;
};

type CustomerLocation = {
  id: string;
  nickname: string | null;
  companyName: string | null;
  address: string;
  address2: string | null;
  city: string;
  state: string;
  zip: string;
  country: string;
};

type Commodity = {
  id: string;
  name: string;
  description: string | null;
  freightClass: string | null;
  nmfc: string | null;
  pieceType: string | null;
  weightLbs: string | null;
  lengthIn: string | null;
  widthIn: string | null;
  heightIn: string | null;
};

type Customer = {
  id: string;
  name: string;
  users: CustomerUser[];
  locations: CustomerLocation[];
  commodities: Commodity[];
};

type StaffUser = {
  id: string;
  firstName: string;
  lastName: string;
};

const serviceTypes = [
  { value: "PARCEL", label: "Parcel" },
  { value: "LTL", label: "LTL" },
  { value: "FULL_TRUCKLOAD", label: "FTL" },
  { value: "INTERMODAL", label: "Intermodal" },
  { value: "CARTAGE", label: "Cartage" },
  { value: "AIR", label: "Air" },
  { value: "OCEAN", label: "Ocean" },
  { value: "EXPEDITED", label: "Expedited" },
  { value: "WAREHOUSING", label: "Warehousing" },
];

const pieceTypes = [
  "BAGS",
  "BASKETS",
  "BINS",
  "BOXES",
  "BUNDLES",
  "CANS",
  "CARTS",
  "CARTONS",
  "CASES",
  "CONTAINERS",
  "CRATES",
  "DRUMS",
  "GAYLORDS",
  "JERRYCANS",
  "LOOSE",
  "PACKAGES",
  "PAILS",
  "PALLETS",
  "PIECES",
  "ROLLS",
  "TOTES",
  "UNITS",
  "VEHICLES",
];

const freightClasses = [
  "500",
  "400",
  "300",
  "250",
  "175",
  "150",
  "125",
  "110",
  "100",
  "92.5",
  "85",
  "77.5",
  "70",
  "65",
  "60",
  "55",
  "50",
];

const countries = [
  { value: "US", label: "United States" },
  { value: "CA", label: "Canada" },
  { value: "MX", label: "Mexico" },
  { value: "GB", label: "United Kingdom" },
  { value: "IE", label: "Ireland" },
  { value: "DE", label: "Germany" },
  { value: "FR", label: "France" },
  { value: "ES", label: "Spain" },
  { value: "IT", label: "Italy" },
  { value: "NL", label: "Netherlands" },
  { value: "BE", label: "Belgium" },
  { value: "CH", label: "Switzerland" },
  { value: "AT", label: "Austria" },
  { value: "PL", label: "Poland" },
  { value: "SE", label: "Sweden" },
  { value: "NO", label: "Norway" },
  { value: "DK", label: "Denmark" },
  { value: "FI", label: "Finland" },
  { value: "AU", label: "Australia" },
  { value: "NZ", label: "New Zealand" },
  { value: "CN", label: "China" },
  { value: "JP", label: "Japan" },
  { value: "KR", label: "South Korea" },
  { value: "TW", label: "Taiwan" },
  { value: "HK", label: "Hong Kong" },
  { value: "SG", label: "Singapore" },
  { value: "IN", label: "India" },
  { value: "VN", label: "Vietnam" },
  { value: "TH", label: "Thailand" },
  { value: "MY", label: "Malaysia" },
  { value: "BR", label: "Brazil" },
  { value: "AR", label: "Argentina" },
  { value: "CL", label: "Chile" },
  { value: "CO", label: "Colombia" },
  { value: "AE", label: "United Arab Emirates" },
  { value: "SA", label: "Saudi Arabia" },
  { value: "ZA", label: "South Africa" },
];

function formatEnumLabel(value: string) {
  return value
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replaceAll("_", " ");
}

type FreightState = {
  commodity: string;
  freightClass: string;
  nmfc: string;
  pieceType: string;
  pallets: string;
  weightLbs: string;
  lengthIn: string;
  widthIn: string;
  heightIn: string;
  cubicFeet: string;
  pcf: string;
};

function getDensityClass(pcf: number) {
  if (pcf < 1) return "500";
  if (pcf < 2) return "300";
  if (pcf < 4) return "250";
  if (pcf < 6) return "175";
  if (pcf < 8) return "125";
  if (pcf < 10) return "100";
  if (pcf < 12) return "92.5";
  if (pcf < 15) return "85";
  if (pcf < 22.5) return "70";
  if (pcf < 30) return "65";
  if (pcf < 35) return "60";
  if (pcf < 50) return "55";
  return "50";
}

function calculateDensity(nextFreight: FreightState) {
  const pallets = Number(nextFreight.pallets || 0);
  const weight = Number(nextFreight.weightLbs || 0);
  const length = Number(nextFreight.lengthIn || 0);
  const width = Number(nextFreight.widthIn || 0);
  const height = Number(nextFreight.heightIn || 0);

  if (!pallets || !weight || !length || !width || !height) {
    return {
      ...nextFreight,
      cubicFeet: "",
      pcf: "",
    };
  }

  const cubicFeet = (length * width * height * pallets) / 1728;
  const pcf = weight / cubicFeet;

  return {
    ...nextFreight,
    cubicFeet: cubicFeet.toFixed(2),
    pcf: pcf.toFixed(2),
    freightClass: getDensityClass(pcf),
  };
}

type QuoteFormQuote = {
  id: string;
  customerId: string;
  requestedById: string | null;
  assignedToId: string | null;
  serviceType: string;

  originName: string | null;
  originAddress: string | null;
  originAddress2: string | null;
  originCity: string | null;
  originState: string | null;
  originZip: string | null;
  originCountry: string | null;

  destinationName: string | null;
  destinationAddress: string | null;
  destinationAddress2: string | null;
  destinationCity: string | null;
  destinationState: string | null;
  destinationZip: string | null;
  destinationCountry: string | null;

  pieces: number | null;
  pallets: number | null;
  pieceType: string | null;

  weightLbs: string | null;
  lengthIn: string | null;
  widthIn: string | null;
  heightIn: string | null;

  freightClass: string | null;
  nmfc: string | null;
  description: string | null;

  buyRate: string | null;
  sellRate: string | null;

  notes: string | null;
  miles: number | null;
};

export default function QuoteForm({
  customers,
  staffUsers,
  action,
  quote,
}: {
  customers: Customer[];
  staffUsers: StaffUser[];
  action: (formData: FormData) => void;
  quote?: QuoteFormQuote;
}) {
  const [customerId, setCustomerId] = useState("");
  const [miles, setMiles] = useState("");

  const [origin, setOrigin] = useState({
    name: "",
    address: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    country: "US",
  });

  const [destination, setDestination] = useState({
    name: "",
    address: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    country: "US",
  });

  const [freight, setFreight] = useState<FreightState>({
    commodity: "",
    freightClass: "",
    nmfc: "",
    pieceType: "",
    pallets: "",
    weightLbs: "",
    lengthIn: "",
    widthIn: "",
    heightIn: "",
    cubicFeet: "",
    pcf: "",
  });

  const selectedCustomer = useMemo(
    () => customers.find((customer) => customer.id === customerId),
    [customers, customerId]
  );

  async function lookupZip(zip: string, country: string) {
    if (country !== "US") return null;
    if (zip.trim().length !== 5) return null;

    const response = await fetch(`/api/zip/${zip.trim()}`);
    if (!response.ok) return null;

    return response.json() as Promise<{
      city: string;
      state: string;
      zip: string;
    }>;
  }

  async function calculateMiles({
    originZip,
    destinationZip,
    originCountry,
    destinationCountry,
  }: {
    originZip: string;
    destinationZip: string;
    originCountry: string;
    destinationCountry: string;
  }) {
    if (
      originCountry !== "US" ||
      destinationCountry !== "US" ||
      originZip.trim().length !== 5 ||
      destinationZip.trim().length !== 5
    ) {
      setMiles("");
      return;
    }

    const response = await fetch(
      `/api/miles?originZip=${originZip.trim()}&destinationZip=${destinationZip.trim()}&originCountry=${originCountry}&destinationCountry=${destinationCountry}`
    );

    if (!response.ok) {
      setMiles("");
      return;
    }

    const data = (await response.json()) as { miles: number };
    setMiles(String(data.miles));
  }

  async function handleOriginZipChange(zip: string) {
    setOrigin((current) => ({ ...current, zip }));

    const result = await lookupZip(zip, origin.country);

    if (result) {
      setOrigin((current) => ({
        ...current,
        city: result.city,
        state: result.state,
        zip: result.zip,
      }));
    }

    await calculateMiles({
      originZip: zip,
      destinationZip: destination.zip,
      originCountry: origin.country,
      destinationCountry: destination.country,
    });
  }

  async function handleDestinationZipChange(zip: string) {
    setDestination((current) => ({ ...current, zip }));

    const result = await lookupZip(zip, destination.country);

    if (result) {
      setDestination((current) => ({
        ...current,
        city: result.city,
        state: result.state,
        zip: result.zip,
      }));
    }

    await calculateMiles({
      originZip: origin.zip,
      destinationZip: zip,
      originCountry: origin.country,
      destinationCountry: destination.country,
    });
  }

  async function handleOriginCountryChange(country: string) {
    setOrigin((current) => ({ ...current, country }));

    await calculateMiles({
      originZip: origin.zip,
      destinationZip: destination.zip,
      originCountry: country,
      destinationCountry: destination.country,
    });
  }

  async function handleDestinationCountryChange(country: string) {
    setDestination((current) => ({ ...current, country }));

    await calculateMiles({
      originZip: origin.zip,
      destinationZip: destination.zip,
      originCountry: origin.country,
      destinationCountry: country,
    });
  }

  function updateFreightField(field: keyof FreightState, value: string) {
    const nextFreight = {
      ...freight,
      [field]: value,
    };

    setFreight(calculateDensity(nextFreight));
  }

  function applyOrigin(locationId: string) {
    const location = selectedCustomer?.locations.find(
      (item) => item.id === locationId
    );

    if (!location) return;

    setOrigin({
      name: location.companyName || location.nickname || "",
      address: location.address,
      address2: location.address2 || "",
      city: location.city,
      state: location.state,
      zip: location.zip,
      country: location.country || "US",
    });

    void calculateMiles({
      originZip: location.zip,
      destinationZip: destination.zip,
      originCountry: location.country || "US",
      destinationCountry: destination.country,
    });
  }

  function applyDestination(locationId: string) {
    const location = selectedCustomer?.locations.find(
      (item) => item.id === locationId
    );

    if (!location) return;

    setDestination({
      name: location.companyName || location.nickname || "",
      address: location.address,
      address2: location.address2 || "",
      city: location.city,
      state: location.state,
      zip: location.zip,
      country: location.country || "US",
    });

    void calculateMiles({
      originZip: origin.zip,
      destinationZip: location.zip,
      originCountry: origin.country,
      destinationCountry: location.country || "US",
    });
  }

  return (
    <form action={action} className="grid gap-4">
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}
      >
        <div>
          <label className="block text-sm font-bold text-[#111111]">
            Customer
          </label>
          <select
            name="customerId"
            required
            value={customerId}
            onChange={(event) => setCustomerId(event.target.value)}
            className="mt-2 w-full rounded-xl border border-[#D8DCD8] px-4 py-3"
          >
            <option value="">Select Customer</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-[#111111]">
            Customer Contact
          </label>
          <select
            name="requestedById"
            className="mt-2 w-full rounded-xl border border-[#D8DCD8] px-4 py-3"
          >
            <option value="">Select Contact</option>
            {selectedCustomer?.users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.firstName} {user.lastName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-[#111111]">
            Assigned CW Employee
          </label>
          <select
            name="assignedToId"
            className="mt-2 w-full rounded-xl border border-[#D8DCD8] px-4 py-3"
          >
            <option value="">Unassigned</option>
            {staffUsers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.firstName} {user.lastName}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-[#111111]">
          Service Type
        </label>
        <select
          name="serviceType"
          required
          className="mt-2 w-full rounded-xl border border-[#D8DCD8] px-4 py-3"
        >
          <option value="">Select Service Type</option>
          {serviceTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-6 border-t border-[#D8DCD8] pt-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-[#D8DCD8] bg-[#FBFCFB] p-5">
          <h2 className="text-xl font-bold text-[#111111]">Origin</h2>

          <div className="mt-5 grid gap-4">
            <select
              disabled={!selectedCustomer}
              onChange={(event) => applyOrigin(event.target.value)}
              className="rounded-xl border border-[#D8DCD8] bg-white px-4 py-3"
            >
              <option value="">Select saved origin location</option>
              {selectedCustomer?.locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.nickname || location.companyName || location.address}
                </option>
              ))}
            </select>

            <input
              name="originName"
              value={origin.name}
              onChange={(event) =>
                setOrigin({ ...origin, name: event.target.value })
              }
              placeholder="Origin Company"
              className="rounded-xl border border-[#D8DCD8] bg-white px-4 py-3"
            />

            <input
              name="originAddress"
              value={origin.address}
              onChange={(event) =>
                setOrigin({ ...origin, address: event.target.value })
              }
              placeholder="Origin Street Address"
              className="rounded-xl border border-[#D8DCD8] bg-white px-4 py-3"
            />

            <input
              name="originAddress2"
              value={origin.address2}
              onChange={(event) =>
                setOrigin({ ...origin, address2: event.target.value })
              }
              placeholder="Origin Street Address (Cont.)"
              className="rounded-xl border border-[#D8DCD8] bg-white px-4 py-3"
            />

            <div className="grid gap-4 md:grid-cols-4">
              <input
                name="originZip"
                value={origin.zip}
                onChange={(event) => handleOriginZipChange(event.target.value)}
                placeholder={origin.country === "US" ? "ZIP" : "Postal Code"}
                className="rounded-xl border border-[#D8DCD8] bg-white px-4 py-3"
              />

              <input
                name="originCity"
                value={origin.city}
                onChange={(event) =>
                  setOrigin({ ...origin, city: event.target.value })
                }
                placeholder="City"
                className="rounded-xl border border-[#D8DCD8] bg-white px-4 py-3 md:col-span-2"
              />

              <input
                name="originState"
                value={origin.state}
                onChange={(event) =>
                  setOrigin({ ...origin, state: event.target.value })
                }
                placeholder={
                  origin.country === "US" ? "State" : "State / Province"
                }
                className="rounded-xl border border-[#D8DCD8] bg-white px-4 py-3"
              />
            </div>

            <select
              name="originCountry"
              required
              value={origin.country}
              onChange={(event) => handleOriginCountryChange(event.target.value)}
              className="rounded-xl border border-[#D8DCD8] bg-white px-4 py-3"
            >
              {countries.map((country) => (
                <option key={country.value} value={country.value}>
                  {country.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="rounded-2xl border border-[#D8DCD8] bg-[#FBFCFB] p-5">
          <h2 className="text-xl font-bold text-[#111111]">Destination</h2>

          <div className="mt-5 grid gap-4">
            <select
              disabled={!selectedCustomer}
              onChange={(event) => applyDestination(event.target.value)}
              className="rounded-xl border border-[#D8DCD8] bg-white px-4 py-3"
            >
              <option value="">Select saved destination location</option>
              {selectedCustomer?.locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.nickname || location.companyName || location.address}
                </option>
              ))}
            </select>

            <input
              name="destinationName"
              value={destination.name}
              onChange={(event) =>
                setDestination({ ...destination, name: event.target.value })
              }
              placeholder="Destination Company"
              className="rounded-xl border border-[#D8DCD8] bg-white px-4 py-3"
            />

            <input
              name="destinationAddress"
              value={destination.address}
              onChange={(event) =>
                setDestination({
                  ...destination,
                  address: event.target.value,
                })
              }
              placeholder="Destination Street Address"
              className="rounded-xl border border-[#D8DCD8] bg-white px-4 py-3"
            />

            <input
              name="destinationAddress2"
              value={destination.address2}
              onChange={(event) =>
                setDestination({
                  ...destination,
                  address2: event.target.value,
                })
              }
              placeholder="Destination Street Address (Cont.)"
              className="rounded-xl border border-[#D8DCD8] bg-white px-4 py-3"
            />

            <div className="grid gap-4 md:grid-cols-4">
              <input
                name="destinationZip"
                value={destination.zip}
                onChange={(event) =>
                  handleDestinationZipChange(event.target.value)
                }
                placeholder={
                  destination.country === "US" ? "ZIP" : "Postal Code"
                }
                className="rounded-xl border border-[#D8DCD8] bg-white px-4 py-3"
              />

              <input
                name="destinationCity"
                value={destination.city}
                onChange={(event) =>
                  setDestination({
                    ...destination,
                    city: event.target.value,
                  })
                }
                placeholder="City"
                className="rounded-xl border border-[#D8DCD8] bg-white px-4 py-3 md:col-span-2"
              />

              <input
                name="destinationState"
                value={destination.state}
                onChange={(event) =>
                  setDestination({
                    ...destination,
                    state: event.target.value,
                  })
                }
                placeholder={
                  destination.country === "US" ? "State" : "State / Province"
                }
                className="rounded-xl border border-[#D8DCD8] bg-white px-4 py-3"
              />
            </div>

            <select
              name="destinationCountry"
              required
              value={destination.country}
              onChange={(event) =>
                handleDestinationCountryChange(event.target.value)
              }
              className="rounded-xl border border-[#D8DCD8] bg-white px-4 py-3"
            >
              {countries.map((country) => (
                <option key={country.value} value={country.value}>
                  {country.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <input name="miles" type="hidden" value={miles} />

      <div className="rounded-2xl border border-[#D8DCD8] bg-[#EEF7F1] p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#0F6B31]">
              Estimated Miles
            </p>
            <p className="mt-1 text-sm text-[#5F6B66]">
              Auto-calculates once origin and destination ZIPs are entered.
            </p>
          </div>

          <p className="text-3xl font-bold text-[#0F6B31]">
            {miles ? `${miles} mi` : "—"}
          </p>
        </div>
      </div>

      <div className="border-t border-[#D8DCD8] pt-6">
        <h2 className="text-xl font-bold text-[#111111]">Freight Details</h2>
      </div>

      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}
      >
        <input
          name="pallets"
          type="number"
          value={freight.pallets}
          onChange={(event) => updateFreightField("pallets", event.target.value)}
          placeholder="Pallet Count"
          className="rounded-xl border border-[#D8DCD8] px-4 py-3"
        />

        <input
          name="pieces"
          type="number"
          placeholder="Piece Count"
          className="rounded-xl border border-[#D8DCD8] px-4 py-3"
        />

        <select
          name="pieceType"
          value={freight.pieceType}
          onChange={(event) =>
            updateFreightField("pieceType", event.target.value)
          }
          className="rounded-xl border border-[#D8DCD8] px-4 py-3"
        >
          <option value="">Piece Type</option>
          {pieceTypes.map((type) => (
            <option key={type} value={type}>
              {formatEnumLabel(type)}
            </option>
          ))}
        </select>
      </div>

      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}
      >
        <input
          name="weightLbs"
          value={freight.weightLbs}
          onChange={(event) =>
            updateFreightField("weightLbs", event.target.value)
          }
          type="number"
          step="0.01"
          placeholder="Weight(lbs)"
          className="rounded-xl border border-[#D8DCD8] px-4 py-3"
        />

        <input
          name="lengthIn"
          value={freight.lengthIn}
          onChange={(event) =>
            updateFreightField("lengthIn", event.target.value)
          }
          type="number"
          step="0.01"
          placeholder="Length(in)"
          className="rounded-xl border border-[#D8DCD8] px-4 py-3"
        />

        <input
          name="widthIn"
          value={freight.widthIn}
          onChange={(event) => updateFreightField("widthIn", event.target.value)}
          type="number"
          step="0.01"
          placeholder="Width(in)"
          className="rounded-xl border border-[#D8DCD8] px-4 py-3"
        />

        <input
          name="heightIn"
          value={freight.heightIn}
          onChange={(event) =>
            updateFreightField("heightIn", event.target.value)
          }
          type="number"
          step="0.01"
          placeholder="Height(in)"
          className="rounded-xl border border-[#D8DCD8] px-4 py-3"
        />
      </div>

      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}
      >
        <input
          value={freight.cubicFeet}
          readOnly
          placeholder="Cubic Feet"
          className="rounded-xl border border-[#D8DCD8] bg-[#F6F8F6] px-4 py-3"
        />

        <input
          value={freight.pcf}
          readOnly
          placeholder="PCF / Density"
          className="rounded-xl border border-[#D8DCD8] bg-[#F6F8F6] px-4 py-3"
        />
      </div>

      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}
      >
        <input
          name="description"
          value={freight.commodity}
          onChange={(event) =>
            updateFreightField("commodity", event.target.value)
          }
          placeholder="Commodity"
          className="rounded-xl border border-[#D8DCD8] px-4 py-3"
        />

        <select
          name="freightClass"
          value={freight.freightClass}
          onChange={(event) =>
            updateFreightField("freightClass", event.target.value)
          }
          className="rounded-xl border border-[#D8DCD8] px-4 py-3"
        >
          <option value="">Class</option>

          {freightClasses.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <input
          name="nmfc"
          value={freight.nmfc}
          onChange={(event) => updateFreightField("nmfc", event.target.value)}
          placeholder="NMFC #"
          className="rounded-xl border border-[#D8DCD8] px-4 py-3"
        />
      </div>

      <div className="border-t border-[#D8DCD8] pt-6">
        <h2 className="text-xl font-bold text-[#111111]">Pricing</h2>
      </div>

      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}
      >
        <input
          name="buyRate"
          type="number"
          step="0.01"
          placeholder="Buy Rate"
          className="rounded-xl border border-[#D8DCD8] px-4 py-3"
        />

        <input
          name="sellRate"
          type="number"
          step="0.01"
          placeholder="Sell Rate"
          className="rounded-xl border border-[#D8DCD8] px-4 py-3"
        />
      </div>

      <textarea
        name="notes"
        rows={4}
        placeholder="Invoice Notes"
        className="rounded-xl border border-[#D8DCD8] px-4 py-3"
      />

      <div className="flex justify-end gap-3 border-t border-[#D8DCD8] pt-6">
        <a
          href="/dashboard/quotes"
          className="rounded-xl border border-[#D8DCD8] px-5 py-3 text-sm font-bold"
        >
          Cancel
        </a>

        <button
          type="submit"
          className="rounded-xl bg-[#0F6B31] px-5 py-3 text-sm font-bold text-white"
        >
          Save Quote
        </button>
      </div>
    </form>
  );
}