import Link from "next/link";
import { Building2, Plus } from "lucide-react";

export default function CustomersPage() {
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#1D6A33]">
            Customers
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-[#111111]">
            Customer Management
          </h1>
          <p className="mt-3 text-lg text-[#5F6B66]">
            Manage customer accounts, contacts, users, quotes, shipments, and documents.
          </p>
        </div>

        <Link
          href="/dashboard/customers/new"
          className="inline-flex items-center gap-2 rounded-xl bg-[#0F6B31] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#0B5527]"
        >
          <Plus size={18} />
          Add Customer
        </Link>
      </div>

      <div className="rounded-2xl border border-[#D8DCD8] bg-white shadow-sm">
        <div className="border-b border-[#D8DCD8] px-6 py-5">
          <h2 className="text-xl font-bold text-[#111111]">All Customers</h2>
        </div>

        <div className="flex min-h-96 flex-col items-center justify-center px-6 py-16 text-center">
          <div className="rounded-full bg-[#EEF7F1] p-5">
            <Building2 size={42} color="#0F6B31" />
          </div>

          <h3 className="mt-6 text-xl font-bold text-[#111111]">
            No customers yet
          </h3>

          <p className="mt-3 max-w-md text-sm leading-6 text-[#5F6B66]">
            Customers will appear here once they are added to the TMS. Each
            customer can have users, quotes, shipments, documents, invoices, and
            payment history.
          </p>

          <Link
            href="/dashboard/customers/new"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0F6B31] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#0B5527]"
          >
            <Plus size={18} />
            Add First Customer
          </Link>
        </div>
      </div>
    </div>
  );
}