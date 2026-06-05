import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { createCustomerLocation } from "../../../actions";

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

export default async function NewCustomerLocationPage({
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

  const createCustomerLocationWithId = createCustomerLocation.bind(
    null,
    customer.id
  );

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#1D6A33]">
          Saved Locations
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-[#111111]">
          Add Saved Location
        </h1>
        <p className="mt-3 text-lg text-[#5F6B66]">
          Save a reusable shipping location for {customer.name}.
        </p>
      </div>

      <div className="rounded-2xl border border-[#D8DCD8] bg-white p-6 shadow-sm">
        <form action={createCustomerLocationWithId} className="grid gap-6">
          <input
            name="nickname"
            placeholder="Nickname, example: Main Warehouse"
            className="rounded-xl border border-[#D8DCD8] px-4 py-3"
          />

          <input
            name="companyName"
            placeholder="Company Name"
            className="rounded-xl border border-[#D8DCD8] px-4 py-3"
          />

          <input
            name="address"
            required
            placeholder="Street Address"
            className="rounded-xl border border-[#D8DCD8] px-4 py-3"
          />

          <input
            name="address2"
            placeholder="Street Address (Cont.), example: Dock 4, Suite 200, Building B"
            className="rounded-xl border border-[#D8DCD8] px-4 py-3"
          />

          <div className="grid gap-6 md:grid-cols-4">
            <input
              name="city"
              required
              placeholder="City"
              className="md:col-span-2 rounded-xl border border-[#D8DCD8] px-4 py-3"
            />

            <input
              name="state"
              required
              placeholder="State / Province"
              className="rounded-xl border border-[#D8DCD8] px-4 py-3"
            />

            <input
              name="zip"
              required
              placeholder="ZIP / Postal Code"
              className="rounded-xl border border-[#D8DCD8] px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-[#111111]">
              Country
            </label>
            <select
              name="country"
              defaultValue="US"
              className="mt-2 w-full rounded-xl border border-[#D8DCD8] px-4 py-3"
            >
              {countries.map((country) => (
                <option key={country.value} value={country.value}>
                  {country.label}
                </option>
              ))}
            </select>
          </div>

          <div className="border-t border-[#D8DCD8] pt-6">
            <h2 className="text-xl font-bold text-[#111111]">
              Location Contact
            </h2>
          </div>

          <input
            name="contactName"
            placeholder="Contact Name"
            className="rounded-xl border border-[#D8DCD8] px-4 py-3"
          />

          <div className="grid gap-6 md:grid-cols-2">
            <input
              name="contactPhone"
              placeholder="Contact Phone"
              className="rounded-xl border border-[#D8DCD8] px-4 py-3"
            />

            <input
              name="contactEmail"
              type="email"
              placeholder="Contact Email"
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
              Save Location
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}