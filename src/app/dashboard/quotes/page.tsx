import Link from "next/link";
import { FileText, Plus } from "lucide-react";

import { prisma } from "@/lib/prisma";

function getQuoteRowStyle(status: string) {
  switch (status) {
    case "QUOTED":
      return { backgroundColor: "#F6F8F6" };

    case "CONVERTED":
      return { backgroundColor: "#ECFDF3" };

    case "CANCELLED":
      return { backgroundColor: "#FEF2F2" };

    case "LOST":
      return { backgroundColor: "#EFF6FF" };

    default:
      return { backgroundColor: "#FFFFFF" };
  }
}

export default async function QuotesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const statusFilter = params.status ?? "pending";

  const quotes = await prisma.quote.findMany({
    where:
      statusFilter === "converted"
        ? { status: "CONVERTED" }
        : statusFilter === "cancelled"
        ? { status: "CANCELLED" }
        : statusFilter === "all"
        ? {}
        : {
            NOT: [{ status: "CANCELLED" }, { status: "CONVERTED" }],
          },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      customer: true,
      requestedBy: true,
      assignedTo: true,
      shipment: true,
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

      <div className="mb-5 flex items-center gap-3">
        <Link
          href="/dashboard/quotes"
          className={`rounded-xl px-4 py-2 text-sm font-bold ${
            statusFilter === "pending"
              ? "bg-[#0F6B31] text-white"
              : "border border-[#D8DCD8] bg-white text-[#111111]"
          }`}
        >
          Pending
        </Link>

        <Link
          href="/dashboard/quotes?status=converted"
          className={`rounded-xl px-4 py-2 text-sm font-bold ${
            statusFilter === "converted"
              ? "bg-[#0F6B31] text-white"
              : "border border-[#D8DCD8] bg-white text-[#111111]"
          }`}
        >
          Converted
        </Link>

        <Link
          href="/dashboard/quotes?status=cancelled"
          className={`rounded-xl px-4 py-2 text-sm font-bold ${
            statusFilter === "cancelled"
              ? "bg-[#0F6B31] text-white"
              : "border border-[#D8DCD8] bg-white text-[#111111]"
          }`}
        >
          Cancelled
        </Link>

        <Link
          href="/dashboard/quotes?status=all"
          className={`rounded-xl px-4 py-2 text-sm font-bold ${
            statusFilter === "all"
              ? "bg-[#0F6B31] text-white"
              : "border border-[#D8DCD8] bg-white text-[#111111]"
          }`}
        >
          All
        </Link>
      </div>

      <div className="rounded-2xl border border-[#D8DCD8] bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-[#D8DCD8] px-6 py-5">
          <h2 className="text-xl font-bold text-[#111111]">
            {statusFilter === "converted"
              ? "Converted Quotes"
              : statusFilter === "cancelled"
              ? "Cancelled Quotes"
              : statusFilter === "all"
              ? "All Quotes"
              : "Pending Quotes"}
          </h2>

          <p className="text-sm font-semibold text-[#5F6B66]">
            {quotes.length} total
          </p>
        </div>

        {quotes.length ? (
          <div className="divide-y divide-[#D8DCD8]">
            {quotes.map((quote) => (
              <Link
  key={quote.id}
  href={
    quote.shipment
      ? `/dashboard/shipments/${quote.shipment.id}`
      : `/dashboard/quotes/${quote.id}`
  }
  style={getQuoteRowStyle(quote.status)}
  className="block px-6 py-5 transition"
>
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-3">
  <span
    className={`block h-4 w-4 shrink-0 rounded-full ${
      quote.status === "CONVERTED"
        ? "bg-green-600"
        : quote.status === "CANCELLED"
        ? "bg-red-600"
        : quote.status === "LOST"
        ? "bg-blue-600"
        : "bg-black"
    }`}
  />

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
                    <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#111111]">
                      {quote.status.replaceAll("_", " ")}
                    </p>

                    <div className="mt-3">
                      {quote.shipment ? (
                        <span className="inline-flex rounded-xl bg-[#0F6B31] px-4 py-2 text-sm font-bold text-white">
                          View Shipment
                        </span>
                      ) : quote.status !== "CANCELLED" &&
                        quote.status !== "CONVERTED" ? (
                        <span className="inline-flex rounded-xl bg-[#0F6B31] px-4 py-2 text-sm font-bold text-white">
                          Edit Quote
                        </span>
                      ) : null}
                    </div>
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
              No quotes found
            </h3>

            <p className="mt-3 max-w-md text-sm leading-6 text-[#5F6B66]">
              No quotes match the selected filter.
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