import Link from "next/link";
import { FileText, Plus } from "lucide-react";
import QuoteRowActions from "@/components/QuoteRowActions";
import { updateQuoteStatus } from "./actions";
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
      return { backgroundColor: "#eed77dfd" };

    default:
      return { backgroundColor: "#FFFFFF" };
  }
}

function getQuoteDotColor(status: string) {
  switch (status) {
    case "CONVERTED":
      return "#16A34A";

    case "CANCELLED":
      return "#DC2626";

    case "LOST":
      return "#92400E";

    default:
      return "#111111";
  }
}

function formatDate(value: Date | null) {
  if (!value) return "Not set";

  return value.toLocaleDateString();
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
        : statusFilter === "lost"
        ? { status: "LOST" }
        : statusFilter === "cancelled"
        ? { status: "CANCELLED" }
        : statusFilter === "all"
        ? {}
        : {
            NOT: [
              { status: "CANCELLED" },
              { status: "CONVERTED" },
              { status: "LOST" },
            ],
          },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      customer: true,
      requestedBy: true,
      assignedTo: true,
      shipment: {
        include: {
          carrier: true,
        },
      },
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

      <div className="mb-8 flex items-center gap-4">
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
          href="/dashboard/quotes?status=lost"
          className={`rounded-xl px-4 py-2 text-sm font-bold ${
            statusFilter === "lost"
              ? "bg-[#0F6B31] text-white"
              : "border border-[#D8DCD8] bg-white text-[#111111]"
          }`}
        >
          Lost
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
              : statusFilter === "lost"
              ? "Lost Quotes"
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
          <div className="divide-y divide-[#C9D0C9]">
            {quotes.map((quote) => (
              <div
                key={quote.id}
                style={getQuoteRowStyle(quote.status)}
                className="border-b border-[#BFD8C8] px-6 py-7 last:border-b-0"
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                      <div
                        style={{
                          width: "14px",
                          height: "14px",
                          borderRadius: "9999px",
                          backgroundColor: getQuoteDotColor(quote.status),
                          flexShrink: 0,
                        }}
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

                    <div className="mt-4 grid gap-1 text-sm text-[#5F6B66]">
                      <p>
                        Contact:{" "}
                        {quote.requestedBy
                          ? `${quote.requestedBy.firstName} ${quote.requestedBy.lastName}`
                          : "Not set"}
                      </p>

                      <p>
                        Assigned:{" "}
                        {quote.assignedTo
                          ? `${quote.assignedTo.firstName} ${quote.assignedTo.lastName}`
                          : "Unassigned"}
                      </p>
                    </div>

                    <div className="mt-5">
                      <div
                        className="gap-4 text-sm text-[#5F6B66]"
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(6, minmax(180px, 1fr))",
                          alignItems: "start",
                        }}
                      >
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#111111]">
                            Pickup Date
                          </p>
                          <p className="mt-1">
                            {quote.shipment
                              ? formatDate(quote.shipment.pickupDate)
                              : "Not set"}
                          </p>

                          <p className="mt-4 text-xs font-bold uppercase tracking-[0.12em] text-[#111111]">
                            Pickup
                          </p>
                          <p className="mt-1">
                            {quote.shipment
                              ? `${quote.shipment.originAddress}, ${quote.shipment.originCity}, ${quote.shipment.originState} ${quote.shipment.originZip}`
                              : `${quote.originAddress || "Not set"}, ${
                                  quote.originCity || ""
                                }, ${quote.originState || ""} ${
                                  quote.originZip || ""
                                }`}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#111111]">
                            Delivery Date
                          </p>
                          <p className="mt-1">
                            {quote.shipment
                              ? formatDate(quote.shipment.deliveryDate)
                              : "Not set"}
                          </p>

                          <p className="mt-4 text-xs font-bold uppercase tracking-[0.12em] text-[#111111]">
                            Delivery
                          </p>
                          <p className="mt-1">
                            {quote.shipment
                              ? `${quote.shipment.destinationAddress}, ${quote.shipment.destinationCity}, ${quote.shipment.destinationState} ${quote.shipment.destinationZip}`
                              : `${quote.destinationAddress || "Not set"}, ${
                                  quote.destinationCity || ""
                                }, ${quote.destinationState || ""} ${
                                  quote.destinationZip || ""
                                }`}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#111111]">
                            Pallets
                          </p>
                          <p className="mt-1">
                            {quote.shipment?.pallets ??
                              quote.pallets ??
                              "Not set"}
                          </p>

                          <p className="mt-4 text-xs font-bold uppercase tracking-[0.12em] text-[#111111]">
                            Weight
                          </p>
                          <p className="mt-1">
                            {quote.shipment?.weightLbs
                              ? `${quote.shipment.weightLbs.toString()} lbs`
                              : quote.weightLbs
                              ? `${quote.weightLbs.toString()} lbs`
                              : "Not set"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#111111]">
                            Pieces
                          </p>
                          <p className="mt-1">
                            {quote.shipment?.pieces ??
                              quote.pieces ??
                              "Not set"}
                          </p>

                          <p className="mt-4 text-xs font-bold uppercase tracking-[0.12em] text-[#111111]">
                            Commodity
                          </p>
                          <p className="mt-1">
                            {quote.shipment?.description ||
                              quote.description ||
                              "Not set"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#111111]">
                            Declared Value
                          </p>
                          <p className="mt-1">Not set</p>

                          <p className="mt-4 text-xs font-bold uppercase tracking-[0.12em] text-[#111111]">
                            Carrier
                          </p>
                          <p className="mt-1">
                            {quote.shipment?.carrier?.name || "Unassigned"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#111111]">
                            Buy Rate
                          </p>
                          <p className="mt-1">
                            {quote.shipment?.buyRate
                              ? `$${quote.shipment.buyRate.toString()}`
                              : quote.buyRate
                              ? `$${quote.buyRate.toString()}`
                              : "$0"}
                          </p>

                          <p className="mt-4 text-xs font-bold uppercase tracking-[0.12em] text-[#111111]">
                            Sell Rate
                          </p>
                          <p className="mt-1">
                            {quote.shipment?.sellRate
                              ? `$${quote.shipment.sellRate.toString()}`
                              : quote.sellRate
                              ? `$${quote.sellRate.toString()}`
                              : "$0"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col items-end gap-3">
                    <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#111111]">
                      {quote.status.replaceAll("_", " ")}
                    </p>

                      <QuoteRowActions
  quoteId={quote.id}
  shipmentId={quote.shipment?.id || null}
  status={quote.status}
  action={updateQuoteStatus.bind(null, quote.id)}
/>
                    </div>
                  </div>
                </div>
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