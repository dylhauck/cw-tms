import { createCustomer } from "../actions";

export default function NewCustomerPage() {
  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#1D6A33]">
          Customers
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-[#111111]">
          Add Customer
        </h1>
        <p className="mt-3 text-lg text-[#5F6B66]">
          Create a new customer account and store their physical and billing
          address information.
        </p>
      </div>

      <div className="rounded-2xl border border-[#D8DCD8] bg-white p-6 shadow-sm">
        <form action={createCustomer} className="grid gap-6">
          <div>
            <label className="block text-sm font-bold text-[#111111]">
              Customer Name
            </label>
            <input
              name="name"
              required
              className="mt-2 w-full rounded-xl border border-[#D8DCD8] px-4 py-3 outline-none focus:border-[#0F6B31]"
              placeholder="ABC Manufacturing"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-bold text-[#111111]">
                Phone
              </label>
              <input
                name="phone"
                className="mt-2 w-full rounded-xl border border-[#D8DCD8] px-4 py-3 outline-none focus:border-[#0F6B31]"
                placeholder="708-555-1234"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#111111]">
                Email
              </label>
              <input
                name="email"
                type="email"
                className="mt-2 w-full rounded-xl border border-[#D8DCD8] px-4 py-3 outline-none focus:border-[#0F6B31]"
                placeholder="shipping@customer.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-[#111111]">
              Website
            </label>
            <input
              name="website"
              className="mt-2 w-full rounded-xl border border-[#D8DCD8] px-4 py-3 outline-none focus:border-[#0F6B31]"
              placeholder="https://customer.com"
            />
          </div>

          <div className="border-t border-[#D8DCD8] pt-6">
            <h2 className="text-xl font-bold text-[#111111]">
              Physical Address
            </h2>
            <p className="mt-1 text-sm text-[#5F6B66]">
              Main customer location used for mapping, lanes, reporting, and
              shipment setup.
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold text-[#111111]">
              Street Address
            </label>
            <input
              name="physicalAddress"
              className="mt-2 w-full rounded-xl border border-[#D8DCD8] px-4 py-3 outline-none focus:border-[#0F6B31]"
              placeholder="123 Main St"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-[#111111]">
                City
              </label>
              <input
                name="physicalCity"
                className="mt-2 w-full rounded-xl border border-[#D8DCD8] px-4 py-3 outline-none focus:border-[#0F6B31]"
                placeholder="Chicago"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#111111]">
                State
              </label>
              <input
                name="physicalState"
                className="mt-2 w-full rounded-xl border border-[#D8DCD8] px-4 py-3 outline-none focus:border-[#0F6B31]"
                placeholder="IL"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#111111]">
                ZIP
              </label>
              <input
                name="physicalZip"
                className="mt-2 w-full rounded-xl border border-[#D8DCD8] px-4 py-3 outline-none focus:border-[#0F6B31]"
                placeholder="60601"
              />
            </div>
          </div>

          <input name="physicalCountry" type="hidden" value="US" />

          <div className="rounded-2xl border border-dashed border-[#D8DCD8] bg-[#F6F8F6] p-5">
            <p className="text-sm font-bold text-[#111111]">Map Preview</p>
            <p className="mt-2 text-sm leading-6 text-[#5F6B66]">
              A map preview will appear here once mapping is connected. This
              will let CW expand and verify each customer location.
            </p>
          </div>

          <div className="border-t border-[#D8DCD8] pt-6">
            <h2 className="text-xl font-bold text-[#111111]">
              Billing Information
            </h2>
            <p className="mt-1 text-sm text-[#5F6B66]">
              Billing address can be different from the physical location.
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold text-[#111111]">
              Billing Name
            </label>
            <input
              name="billingName"
              className="mt-2 w-full rounded-xl border border-[#D8DCD8] px-4 py-3 outline-none focus:border-[#0F6B31]"
              placeholder="ABC Manufacturing Accounts Payable"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-[#111111]">
              Billing Email
            </label>
            <input
              name="billingEmail"
              type="email"
              className="mt-2 w-full rounded-xl border border-[#D8DCD8] px-4 py-3 outline-none focus:border-[#0F6B31]"
              placeholder="ap@customer.com"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-[#111111]">
              Billing Street Address
            </label>
            <input
              name="billingAddress"
              className="mt-2 w-full rounded-xl border border-[#D8DCD8] px-4 py-3 outline-none focus:border-[#0F6B31]"
              placeholder="456 Billing Ave"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-[#111111]">
                Billing City
              </label>
              <input
                name="billingCity"
                className="mt-2 w-full rounded-xl border border-[#D8DCD8] px-4 py-3 outline-none focus:border-[#0F6B31]"
                placeholder="Chicago"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#111111]">
                Billing State
              </label>
              <input
                name="billingState"
                className="mt-2 w-full rounded-xl border border-[#D8DCD8] px-4 py-3 outline-none focus:border-[#0F6B31]"
                placeholder="IL"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#111111]">
                Billing ZIP
              </label>
              <input
                name="billingZip"
                className="mt-2 w-full rounded-xl border border-[#D8DCD8] px-4 py-3 outline-none focus:border-[#0F6B31]"
                placeholder="60601"
              />
            </div>
          </div>

          <input name="billingCountry" type="hidden" value="US" />

          <div className="rounded-2xl border border-dashed border-[#D8DCD8] bg-[#F6F8F6] p-5">
            <p className="text-sm font-bold text-[#111111]">
              Billing Map Preview
            </p>
            <p className="mt-2 text-sm leading-6 text-[#5F6B66]">
              Billing map preview will appear here once mapping is connected.
            </p>
          </div>

          <div className="flex justify-end gap-3 border-t border-[#D8DCD8] pt-6">
            <a
              href="/dashboard/customers"
              className="rounded-xl border border-[#D8DCD8] px-5 py-3 text-sm font-bold text-[#111111] transition hover:bg-[#F6F8F6]"
            >
              Cancel
            </a>

            <button
              type="submit"
              className="rounded-xl bg-[#0F6B31] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#0B5527]"
            >
              Create Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}