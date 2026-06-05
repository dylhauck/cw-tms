import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { updateQuote } from "../../actions";

const serviceTypes = [
  "PARCEL",
  "LTL",
  "FULL_TRUCKLOAD",
  "INTERMODAL",
  "CARTAGE",
  "AIR",
  "OCEAN",
  "EXPEDITED",
  "WAREHOUSING",
];

const pieceTypes = [
  "BASKETS",
  "BOXES",
  "BUNDLES",
  "CARTONS",
  "CASES",
  "CRATES",
  "DRUMS",
  "JERRYCANS",
  "OTHER",
  "PAILS",
  "PALLETS",
  "ROLLS",
  "TOTES",
  "UNITS",
];

export default async function EditQuotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const quote = await prisma.quote.findUnique({
    where: { id },
  });

  if (!quote) {
    notFound();
  }

  const customers = await prisma.customer.findMany({
    orderBy: { name: "asc" },
    include: {
      users: {
        where: {
          userType: "CUSTOMER",
          isActive: true,
        },
        orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
      },
    },
  });

  const staffUsers = await prisma.user.findMany({
    where: {
      userType: "STAFF",
      isActive: true,
    },
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
  });

  const updateQuoteWithId = updateQuote.bind(null, quote.id);

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#1D6A33]">
          Quotes
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-[#111111]">
          Edit Quote {quote.quoteNumber}
        </h1>
        <p className="mt-3 text-lg text-[#5F6B66]">
          Update quote details, shipment information, and pricing.
        </p>
      </div>

      <div className="rounded-2xl border border-[#D8DCD8] bg-white p-6 shadow-sm">
        <form action={updateQuoteWithId} className="grid gap-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <label className="block text-sm font-bold text-[#111111]">
                Customer
              </label>
              <select
                name="customerId"
                required
                defaultValue={quote.customerId}
                className="mt-2 w-full rounded-xl border border-[#D8DCD8] px-4 py-3"
              >
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
                defaultValue={quote.requestedById || ""}
                className="mt-2 w-full rounded-xl border border-[#D8DCD8] px-4 py-3"
              >
                <option value="">Select contact</option>
                {customers.flatMap((customer) =>
                  customer.users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.firstName} {user.lastName}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#111111]">
                Assigned CW Employee
              </label>
              <select
                name="assignedToId"
                defaultValue={quote.assignedToId || ""}
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
              defaultValue={quote.serviceType}
              className="mt-2 w-full rounded-xl border border-[#D8DCD8] px-4 py-3"
            >
              {serviceTypes.map((type) => (
                <option key={type} value={type}>
                  {type.replaceAll("_", " ")}
                </option>
              ))}
            </select>
          </div>

          <div className="border-t border-[#D8DCD8] pt-6">
            <h2 className="text-xl font-bold text-[#111111]">Origin</h2>
          </div>

          <input
            name="originName"
            defaultValue={quote.originName || ""}
            placeholder="Origin Company"
            className="rounded-xl border border-[#D8DCD8] px-4 py-3"
          />

          <input
            name="originAddress"
            defaultValue={quote.originAddress || ""}
            placeholder="Origin Street Address"
            className="rounded-xl border border-[#D8DCD8] px-4 py-3"
          />

          <div className="grid gap-6 md:grid-cols-4">
            <input
              name="originCity"
              defaultValue={quote.originCity || ""}
              placeholder="City"
              className="md:col-span-2 rounded-xl border border-[#D8DCD8] px-4 py-3"
            />

            <input
              name="originState"
              defaultValue={quote.originState || ""}
              placeholder="State"
              className="rounded-xl border border-[#D8DCD8] px-4 py-3"
            />

            <input
              name="originZip"
              defaultValue={quote.originZip || ""}
              placeholder="ZIP"
              className="rounded-xl border border-[#D8DCD8] px-4 py-3"
            />
          </div>

          <input name="originCountry" type="hidden" value="US" />

          <div className="border-t border-[#D8DCD8] pt-6">
            <h2 className="text-xl font-bold text-[#111111]">Destination</h2>
          </div>

          <input
            name="destinationName"
            defaultValue={quote.destinationName || ""}
            placeholder="Destination Company"
            className="rounded-xl border border-[#D8DCD8] px-4 py-3"
          />

          <input
            name="destinationAddress"
            defaultValue={quote.destinationAddress || ""}
            placeholder="Destination Street Address"
            className="rounded-xl border border-[#D8DCD8] px-4 py-3"
          />

          <div className="grid gap-6 md:grid-cols-4">
            <input
              name="destinationCity"
              defaultValue={quote.destinationCity || ""}
              placeholder="City"
              className="md:col-span-2 rounded-xl border border-[#D8DCD8] px-4 py-3"
            />

            <input
              name="destinationState"
              defaultValue={quote.destinationState || ""}
              placeholder="State"
              className="rounded-xl border border-[#D8DCD8] px-4 py-3"
            />

            <input
              name="destinationZip"
              defaultValue={quote.destinationZip || ""}
              placeholder="ZIP"
              className="rounded-xl border border-[#D8DCD8] px-4 py-3"
            />
          </div>

          <input name="destinationCountry" type="hidden" value="US" />

          <div className="border-t border-[#D8DCD8] pt-6">
            <h2 className="text-xl font-bold text-[#111111]">
              Freight Details
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            <input
              name="pieces"
              type="number"
              defaultValue={quote.pieces || ""}
              placeholder="Pieces"
              className="rounded-xl border border-[#D8DCD8] px-4 py-3"
            />

            <select
              name="pieceType"
              defaultValue={quote.pieceType || ""}
              className="rounded-xl border border-[#D8DCD8] px-4 py-3"
            >
              <option value="">Piece Type</option>
              {pieceTypes.map((type) => (
                <option key={type} value={type}>
                  {type.replaceAll("_", " ")}
                </option>
              ))}
            </select>

            <input
              name="pallets"
              type="number"
              defaultValue={quote.pallets || ""}
              placeholder="Pallets"
              className="rounded-xl border border-[#D8DCD8] px-4 py-3"
            />

            <input
              name="weightLbs"
              type="number"
              step="0.01"
              defaultValue={quote.weightLbs?.toString() || ""}
              placeholder="Weight lbs"
              className="rounded-xl border border-[#D8DCD8] px-4 py-3"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <input
              name="freightClass"
              defaultValue={quote.freightClass || ""}
              placeholder="Class"
              className="rounded-xl border border-[#D8DCD8] px-4 py-3"
            />

            <input
              name="nmfc"
              defaultValue={quote.nmfc || ""}
              placeholder="NMFC #"
              className="rounded-xl border border-[#D8DCD8] px-4 py-3"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <input
              name="lengthIn"
              type="number"
              step="0.01"
              defaultValue={quote.lengthIn?.toString() || ""}
              placeholder="Length in"
              className="rounded-xl border border-[#D8DCD8] px-4 py-3"
            />

            <input
              name="widthIn"
              type="number"
              step="0.01"
              defaultValue={quote.widthIn?.toString() || ""}
              placeholder="Width in"
              className="rounded-xl border border-[#D8DCD8] px-4 py-3"
            />

            <input
              name="heightIn"
              type="number"
              step="0.01"
              defaultValue={quote.heightIn?.toString() || ""}
              placeholder="Height in"
              className="rounded-xl border border-[#D8DCD8] px-4 py-3"
            />
          </div>

          <textarea
            name="description"
            rows={3}
            defaultValue={quote.description || ""}
            placeholder="Commodity Description"
            className="rounded-xl border border-[#D8DCD8] px-4 py-3"
          />

          <div className="border-t border-[#D8DCD8] pt-6">
            <h2 className="text-xl font-bold text-[#111111]">Pricing</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <input
              name="buyRate"
              type="number"
              step="0.01"
              defaultValue={quote.buyRate?.toString() || ""}
              placeholder="Buy Rate"
              className="rounded-xl border border-[#D8DCD8] px-4 py-3"
            />

            <input
              name="sellRate"
              type="number"
              step="0.01"
              defaultValue={quote.sellRate?.toString() || ""}
              placeholder="Sell Rate"
              className="rounded-xl border border-[#D8DCD8] px-4 py-3"
            />
          </div>

          <textarea
            name="notes"
            rows={4}
            defaultValue={quote.notes || ""}
            placeholder="Internal Notes"
            className="rounded-xl border border-[#D8DCD8] px-4 py-3"
          />

          <div className="flex justify-end gap-3 border-t border-[#D8DCD8] pt-6">
            <a
              href={`/dashboard/quotes/${quote.id}`}
              className="rounded-xl border border-[#D8DCD8] px-5 py-3 text-sm font-bold"
            >
              Cancel
            </a>

            <button
              type="submit"
              className="rounded-xl bg-[#0F6B31] px-5 py-3 text-sm font-bold text-white"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}