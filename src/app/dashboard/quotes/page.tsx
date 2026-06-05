import Link from "next/link";
import { FileText, Plus } from "lucide-react";

import { prisma } from "@/lib/prisma";

export default async function QuotesPage() {
  const quotes = await prisma.quote.findMany({
  where: {
    status: {
      not: "CONVERTED",
    },
  },
  orderBy: {
    createdAt: "desc",
  },
  include: {
    customer: true,
    requestedBy: true,
    assignedTo: true,
  },
});

  return (
    <div>
      <div className="mb-8 flex items-center justify-between gap-6">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#1D6A33]">
            Quotes
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-[#111111]">
            Quote Management
          </h1>
          <p className="mt-3 text-lg text-[#5F6B66]">
            Create, review, price, and manage customer quotes.
          </p>
        </div>

        <Link
          href="/dashboard/quotes/new"
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#0F6B31] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#0B5527]"
        >
          <Plus size={18} />
          New Quote
        </Link>
      </div>

      <div className="rounded-2xl border border-[#D8DCD8] bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-[#D8DCD8] px-6 py-5">
          <h2 className="text-xl font-bold text-[#111111]">All Quotes</h2>
          <p className="text-sm font-semibold text-[#5F6B66]">
            {quotes.length} total
          </p>
        </div>

        {quotes.length ? (
          <div className="divide-y divide-[#D8DCD8]">
            {quotes.map((quote) => (
              <Link
                key={quote.id}
                href={`/dashboard/quotes/${quote.id}`}
                className="block px-6 py-5 transition hover:bg-[#F6F8F6]"
              >
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-[#EEF7F1] p-3">
                        <FileText size={22} color="#0F6B31" />
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-[#111111]">
                          {quote.quoteNumber}
                        </h3>
                        <p className="mt-1 text-sm text-[#5F6B66]">
                          {quote.customer.name} ·{" "}
                          {quote.serviceType.replaceAll("_", " ")}
                        </p>
                      </div>
                    </div>

                    <p className="mt-4 text-sm text-[#5F6B66]">
                      Contact:{" "}
                      {quote.requestedBy
                        ? `${quote.requestedBy.firstName} ${quote.requestedBy.lastName}`
                        : "Not set"}
                    </p>

                    <p className="mt-1 text-sm text-[#5F6B66]">
                      Assigned:{" "}
                      {quote.assignedTo
                        ? `${quote.assignedTo.firstName} ${quote.assignedTo.lastName}`
                        : "Unassigned"}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#0F6B31]">
                      {quote.status.replaceAll("_", " ")}
                    </p>
                    <p className="mt-3 text-2xl font-bold text-[#111111]">
                      {quote.sellRate ? `$${quote.sellRate.toString()}` : "$0"}
                    </p>
                    <p className="mt-1 text-sm text-[#5F6B66]">Sell Rate</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex min-h-96 flex-col items-center justify-center px-6 py-16 text-center">
            <div className="rounded-full bg-[#EEF7F1] p-5">
              <FileText size={42} color="#0F6B31" />
            </div>

            <h3 className="mt-6 text-xl font-bold text-[#111111]">
              No quotes yet
            </h3>

            <p className="mt-3 max-w-md text-sm leading-6 text-[#5F6B66]">
              Quotes will appear here once they are created.
            </p>

            <Link
              href="/dashboard/quotes/new"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0F6B31] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#0B5527]"
            >
              <Plus size={18} />
              Create First Quote
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}