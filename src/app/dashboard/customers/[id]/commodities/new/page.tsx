import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { createCustomerCommodity } from "../../../actions";

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

export default async function NewCustomerCommodityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const customer = await prisma.customer.findUnique({
    where: { id },
  });

  if (!customer) {
    notFound();
  }

  const createCustomerCommodityWithId = createCustomerCommodity.bind(
    null,
    customer.id
  );

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#1D6A33]">
          Saved Commodities
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-[#111111]">
          Add Saved Commodity
        </h1>
        <p className="mt-3 text-lg text-[#5F6B66]">
          Save reusable freight information for {customer.name}.
        </p>
      </div>

      <div className="rounded-2xl border border-[#D8DCD8] bg-white p-6 shadow-sm">
        <form action={createCustomerCommodityWithId} className="grid gap-6">
          <input
            name="name"
            required
            placeholder="Commodity Name, example: Safflower Oil"
            className="rounded-xl border border-[#D8DCD8] px-4 py-3"
          />

          <textarea
            name="description"
            rows={3}
            placeholder="Commodity Description"
            className="rounded-xl border border-[#D8DCD8] px-4 py-3"
          />

          <div className="grid gap-6 md:grid-cols-3">
            <input
              name="freightClass"
              placeholder="Freight Class"
              className="rounded-xl border border-[#D8DCD8] px-4 py-3"
            />

            <input
              name="nmfc"
              placeholder="NMFC #"
              className="rounded-xl border border-[#D8DCD8] px-4 py-3"
            />

            <select
              name="pieceType"
              className="rounded-xl border border-[#D8DCD8] px-4 py-3"
            >
              <option value="">Piece Type</option>
              {pieceTypes.map((type) => (
                <option key={type} value={type}>
                  {type.replaceAll("_", " ")}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            <input
              name="weightLbs"
              type="number"
              step="0.01"
              placeholder="Weight lbs"
              className="rounded-xl border border-[#D8DCD8] px-4 py-3"
            />

            <input
              name="lengthIn"
              type="number"
              step="0.01"
              placeholder="Length in"
              className="rounded-xl border border-[#D8DCD8] px-4 py-3"
            />

            <input
              name="widthIn"
              type="number"
              step="0.01"
              placeholder="Width in"
              className="rounded-xl border border-[#D8DCD8] px-4 py-3"
            />

            <input
              name="heightIn"
              type="number"
              step="0.01"
              placeholder="Height in"
              className="rounded-xl border border-[#D8DCD8] px-4 py-3"
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-[#D8DCD8] pt-6">
            <a
              href={`/dashboard/customers/${customer.id}`}
              className="rounded-xl border border-[#D8DCD8] px-5 py-3 text-sm font-bold"
            >
              Cancel
            </a>

            <button
              type="submit"
              className="rounded-xl bg-[#0F6B31] px-5 py-3 text-sm font-bold text-white"
            >
              Save Commodity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}