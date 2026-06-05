import Link from "next/link";
import { Building2, Mail, MapPin, Phone, Plus } from "lucide-react";

import { prisma } from "@/lib/prisma";

export default async function CustomersPage() {
  const customers = await prisma.customer.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      users: true,
      quotes: true,
      shipments: true,
      documents: true,
    },
  });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between gap-6">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#1D6A33]">
            Customers
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-[#111111]">
            Customer Management
          </h1>
          <p className="mt-3 text-lg text-[#5F6B66]">
            Manage customer accounts, contacts, locations, users, quotes,
            shipments, and documents.
          </p>
        </div>

        <Link
          href="/dashboard/customers/new"
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#0F6B31] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#0B5527]"
        >
          <Plus size={18} />
          Add Customer
        </Link>
      </div>

      {customers.length === 0 ? (
        <div className="rounded-2xl border border-[#D8DCD8] bg-white shadow-sm">
          <div className="border-b border-[#D8DCD8] px-6 py-5">
            <h2 className="text-xl font-bold text-[#111111]">
              All Customers
            </h2>
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
              customer can have users, quotes, shipments, documents, invoices,
              and payment history.
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
      ) : (
        <div className="rounded-2xl border border-[#D8DCD8] bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-[#D8DCD8] px-6 py-5">
            <h2 className="text-xl font-bold text-[#111111]">All Customers</h2>
            <p className="text-sm font-semibold text-[#5F6B66]">
              {customers.length} total
            </p>
          </div>

          <div className="space-y-3 p-3">
            {customers.map((customer) => {
              const addressParts = [
                customer.physicalAddress,
                customer.physicalCity,
                customer.physicalState,
                customer.physicalZip,
              ].filter(Boolean);

              return (
                <Link
                  key={customer.id}
                  href={`/dashboard/customers/${customer.id}`}
                  className="block rounded-xl border border-[#D8DCD8] bg-white px-6 py-5 transition hover:border-[#0F6B31] hover:bg-[#F6F8F6]"
                  >
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-[#EEF7F1] p-3">
                          <Building2 size={22} color="#0F6B31" />
                        </div>

                        <div>
                          <h3 className="text-lg font-bold text-[#111111]">
                            {customer.name}
                          </h3>
                          <p className="mt-1 text-sm text-[#5F6B66]">
                            Created {customer.createdAt.toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-3 text-sm text-[#5F6B66] md:grid-cols-3">
                        <div className="flex items-center gap-2">
                          <Phone size={16} color="#0F6B31" />
                          <span>{customer.phone || "No phone"}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Mail size={16} color="#0F6B31" />
                          <span>{customer.email || "No email"}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <MapPin size={16} color="#0F6B31" />
                          <span>
                            {addressParts.length
                              ? addressParts.join(", ")
                              : "No address"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-3 text-center">
                      <div className="flex min-h-[74px] flex-col items-center justify-center rounded-xl border border-[#D8DCD8] bg-[#F6F8F6] px-4 py-3">
                        <p className="text-lg font-bold text-[#0F6B31]">
                          {customer.users.length}
                        </p>
                        <p className="mt-1 text-xs font-semibold text-[#5F6B66]">
                          Users
                        </p>
                      </div>

                      <div className="flex min-h-[74px] flex-col items-center justify-center rounded-xl border border-[#D8DCD8] bg-[#F6F8F6] px-4 py-3">
                        <p className="text-lg font-bold text-[#0F6B31]">
                          {customer.quotes.length}
                        </p>
                        <p className="mt-1 text-xs font-semibold text-[#5F6B66]">
                          Quotes
                        </p>
                      </div>

                      <div className="flex min-h-[74px] flex-col items-center justify-center rounded-xl border border-[#D8DCD8] bg-[#F6F8F6] px-4 py-3">
                        <p className="text-lg font-bold text-[#0F6B31]">
                          {customer.shipments.length}
                        </p>
                        <p className="mt-1 text-xs font-semibold text-[#5F6B66]">
                          Shipments
                        </p>
                      </div>

                      <div className="flex min-h-[74px] flex-col items-center justify-center rounded-xl border border-[#D8DCD8] bg-[#F6F8F6] px-4 py-3">
                        <p className="text-lg font-bold text-[#0F6B31]">
                          {customer.documents.length}
                        </p>
                        <p className="mt-1 text-xs font-semibold text-[#5F6B66]">
                          Docs
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}