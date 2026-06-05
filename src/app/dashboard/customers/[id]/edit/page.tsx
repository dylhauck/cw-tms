import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateCustomer } from "../../actions";

export default async function EditCustomerPage({
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

  const updateCustomerWithId = updateCustomer.bind(null, customer.id);

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#1D6A33]">
          Customers
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-[#111111]">
          Edit Customer
        </h1>
        <p className="mt-3 text-lg text-[#5F6B66]">
          Update customer contact, physical address, and billing information.
        </p>
      </div>

      <div className="rounded-2xl border border-[#D8DCD8] bg-white p-6 shadow-sm">
        <form action={updateCustomerWithId} className="grid gap-6">
          <div>
            <label className="block text-sm font-bold text-[#111111]">
              Customer Name
            </label>
            <input
              name="name"
              required
              defaultValue={customer.name}
              className="mt-2 w-full rounded-xl border border-[#D8DCD8] px-4 py-3 outline-none focus:border-[#0F6B31]"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-bold text-[#111111]">
                Phone
              </label>
              <input
                name="phone"
                defaultValue={customer.phone || ""}
                className="mt-2 w-full rounded-xl border border-[#D8DCD8] px-4 py-3 outline-none focus:border-[#0F6B31]"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#111111]">
                Email
              </label>
              <input
                name="email"
                type="email"
                defaultValue={customer.email || ""}
                className="mt-2 w-full rounded-xl border border-[#D8DCD8] px-4 py-3 outline-none focus:border-[#0F6B31]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-[#111111]">
              Website
            </label>
            <input
              name="website"
              defaultValue={customer.website || ""}
              className="mt-2 w-full rounded-xl border border-[#D8DCD8] px-4 py-3 outline-none focus:border-[#0F6B31]"
            />
          </div>

          <div className="border-t border-[#D8DCD8] pt-6">
            <h2 className="text-xl font-bold text-[#111111]">
              Physical Address
            </h2>
          </div>

          <input
            name="physicalAddress"
            defaultValue={customer.physicalAddress || ""}
            placeholder="Street Address"
            className="w-full rounded-xl border border-[#D8DCD8] px-4 py-3 outline-none focus:border-[#0F6B31]"
          />

          <div className="grid gap-6 md:grid-cols-4">
            <input
              name="physicalCity"
              defaultValue={customer.physicalCity || ""}
              placeholder="City"
              className="md:col-span-2 rounded-xl border border-[#D8DCD8] px-4 py-3 outline-none focus:border-[#0F6B31]"
            />
            <input
              name="physicalState"
              defaultValue={customer.physicalState || ""}
              placeholder="State"
              className="rounded-xl border border-[#D8DCD8] px-4 py-3 outline-none focus:border-[#0F6B31]"
            />
            <input
              name="physicalZip"
              defaultValue={customer.physicalZip || ""}
              placeholder="ZIP"
              className="rounded-xl border border-[#D8DCD8] px-4 py-3 outline-none focus:border-[#0F6B31]"
            />
          </div>

          <input name="physicalCountry" type="hidden" value="US" />

          <div className="border-t border-[#D8DCD8] pt-6">
            <h2 className="text-xl font-bold text-[#111111]">
              Billing Information
            </h2>
          </div>

          <input
            name="billingName"
            defaultValue={customer.billingName || ""}
            placeholder="Billing Name"
            className="w-full rounded-xl border border-[#D8DCD8] px-4 py-3 outline-none focus:border-[#0F6B31]"
          />

          <input
            name="billingEmail"
            type="email"
            defaultValue={customer.billingEmail || ""}
            placeholder="Billing Email"
            className="w-full rounded-xl border border-[#D8DCD8] px-4 py-3 outline-none focus:border-[#0F6B31]"
          />

          <input
            name="billingAddress"
            defaultValue={customer.billingAddress || ""}
            placeholder="Billing Street Address"
            className="w-full rounded-xl border border-[#D8DCD8] px-4 py-3 outline-none focus:border-[#0F6B31]"
          />

          <div className="grid gap-6 md:grid-cols-4">
            <input
              name="billingCity"
              defaultValue={customer.billingCity || ""}
              placeholder="Billing City"
              className="md:col-span-2 rounded-xl border border-[#D8DCD8] px-4 py-3 outline-none focus:border-[#0F6B31]"
            />
            <input
              name="billingState"
              defaultValue={customer.billingState || ""}
              placeholder="Billing State"
              className="rounded-xl border border-[#D8DCD8] px-4 py-3 outline-none focus:border-[#0F6B31]"
            />
            <input
              name="billingZip"
              defaultValue={customer.billingZip || ""}
              placeholder="Billing ZIP"
              className="rounded-xl border border-[#D8DCD8] px-4 py-3 outline-none focus:border-[#0F6B31]"
            />
          </div>

          <input name="billingCountry" type="hidden" value="US" />

          <div className="flex justify-end gap-3 border-t border-[#D8DCD8] pt-6">
            <a
              href={`/dashboard/customers/${customer.id}`}
              className="rounded-xl border border-[#D8DCD8] px-5 py-3 text-sm font-bold text-[#111111] transition hover:bg-[#F6F8F6]"
            >
              Cancel
            </a>

            <button
              type="submit"
              className="rounded-xl bg-[#0F6B31] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#0B5527]"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}