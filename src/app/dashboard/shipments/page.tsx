import Link from "next/link";
import { Package } from "lucide-react";

import { prisma } from "@/lib/prisma";

function getShipmentRowStyle(status: string) {
  switch (status) {
    case "BOOKED":
      return { backgroundColor: "#F6F8F6" };

    case "DISPATCHED":
      return { backgroundColor: "#EFF6FF" };

    case "PICKED_UP":
    case "IN_TRANSIT":
    case "OUT_FOR_DELIVERY":
      return { backgroundColor: "#ECFDF3" };

    case "DELIVERED":
      return { backgroundColor: "#F0FDF4" };

    case "EXCEPTION":
      return { backgroundColor: "#FEFCE8" };

    case "CANCELLED":
      return { backgroundColor: "#FEF2F2" };

    default:
      return { backgroundColor: "#FFFFFF" };
  }
}

function getShipmentDotColor(status: string) {
  switch (status) {
    case "BOOKED":
      return "#111111";

    case "DISPATCHED":
      return "#2563EB";

    case "PICKED_UP":
    case "IN_TRANSIT":
    case "OUT_FOR_DELIVERY":
    case "DELIVERED":
      return "#16A34A";

    case "EXCEPTION":
      return "#CA8A04";

    case "CANCELLED":
      return "#DC2626";

    default:
      return "#111111";
  }
}

function formatDate(value: Date | null) {
  if (!value) return "Not set";

  return value.toLocaleDateString();
}

export default async function ShipmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const statusFilter = params.status ?? "active";

  const shipments = await prisma.shipment.findMany({
    where:
      statusFilter === "cancelled"
        ? {
            status: "CANCELLED",
          }
        : statusFilter === "all"
        ? {}
        : {
            NOT: {
              status: "CANCELLED",
            },
          },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      customer: true,
      carrier: true,
      assignedTo: true,
      quote: true,
    },
  });

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#1D6A33]">
          Shipments
        </p>

        <h1 className="mt-4 text-4xl font-bold tracking-tight text-[#111111]">
          Shipment Management
        </h1>

        <p className="mt-3 text-lg text-[#5F6B66]">
          Track booked freight, shipment status, carrier details, and delivery
          activity.
        </p>
      </div>

      <div className="mb-8 flex items-center gap-4">
        <Link
          href="/dashboard/shipments"
          className={`rounded-xl px-4 py-2 text-sm font-bold ${
            statusFilter === "active"
              ? "bg-[#0F6B31] text-white"
              : "border border-[#D8DCD8] bg-white text-[#111111]"
          }`}
        >
          Active
        </Link>

        <Link
          href="/dashboard/shipments?status=cancelled"
          className={`rounded-xl px-4 py-2 text-sm font-bold ${
            statusFilter === "cancelled"
              ? "bg-[#0F6B31] text-white"
              : "border border-[#D8DCD8] bg-white text-[#111111]"
          }`}
        >
          Cancelled
        </Link>

        <Link
          href="/dashboard/shipments?status=all"
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
            {statusFilter === "cancelled"
              ? "Cancelled Shipments"
              : statusFilter === "all"
              ? "All Shipments"
              : "Active Shipments"}
          </h2>

          <p className="text-sm font-semibold text-[#5F6B66]">
            {shipments.length} total
          </p>
        </div>

        {shipments.length ? (
          <div className="divide-y divide-[#C9D0C9]">
            {shipments.map((shipment) => (
              <div
                key={shipment.id}
                style={getShipmentRowStyle(shipment.status)}
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
                          backgroundColor: getShipmentDotColor(
                            shipment.status
                          ),
                          flexShrink: 0,
                        }}
                      />

                      <div>
                        <h3 className="text-lg font-bold text-[#111111]">
                          {shipment.shipmentNumber}
                        </h3>

                        <p className="mt-1 text-sm text-[#5F6B66]">
                          {shipment.customer.name} ·{" "}
                          {shipment.serviceType.replaceAll("_", " ")}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-1 text-sm text-[#5F6B66]">
                      <p>
                        Carrier: {shipment.carrier?.name || "Not assigned"}
                      </p>

                      <p>
                        Assigned:{" "}
                        {shipment.assignedTo
                          ? `${shipment.assignedTo.firstName} ${shipment.assignedTo.lastName}`
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
                            {formatDate(shipment.pickupDate)}
                          </p>

                          <p className="mt-4 text-xs font-bold uppercase tracking-[0.12em] text-[#111111]">
                            Pickup
                          </p>
                          <p className="mt-1">
                            {shipment.originAddress},{" "}
                            {shipment.originCity},{" "}
                            {shipment.originState} {shipment.originZip}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#111111]">
                            Delivery Date
                          </p>
                          <p className="mt-1">
                            {formatDate(shipment.deliveryDate)}
                          </p>

                          <p className="mt-4 text-xs font-bold uppercase tracking-[0.12em] text-[#111111]">
                            Delivery
                          </p>
                          <p className="mt-1">
                            {shipment.destinationAddress},{" "}
                            {shipment.destinationCity},{" "}
                            {shipment.destinationState}{" "}
                            {shipment.destinationZip}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#111111]">
                            Pallets
                          </p>
                          <p className="mt-1">
                            {shipment.pallets ?? "Not set"}
                          </p>

                          <p className="mt-4 text-xs font-bold uppercase tracking-[0.12em] text-[#111111]">
                            Weight
                          </p>
                          <p className="mt-1">
                            {shipment.weightLbs
                              ? `${shipment.weightLbs.toString()} lbs`
                              : "Not set"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#111111]">
                            Pieces
                          </p>
                          <p className="mt-1">
                            {shipment.pieces ?? "Not set"}
                          </p>

                          <p className="mt-4 text-xs font-bold uppercase tracking-[0.12em] text-[#111111]">
                            Commodity
                          </p>
                          <p className="mt-1">
                            {shipment.description || "Not set"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#111111]">
                            Declared Value
                          </p>
                          <p className="mt-1">Not set</p>

                          <p className="mt-4 text-xs font-bold uppercase tracking-[0.12em] text-[#111111]">
                            From Quote
                          </p>
                          <p className="mt-1">
                            {shipment.quote?.quoteNumber || "N/A"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#111111]">
                            Buy Rate
                          </p>
                          <p className="mt-1">
                            {shipment.buyRate
                              ? `$${shipment.buyRate.toString()}`
                              : "$0"}
                          </p>

                          <p className="mt-4 text-xs font-bold uppercase tracking-[0.12em] text-[#111111]">
                            Sell Rate
                          </p>
                          <p className="mt-1">
                            {shipment.sellRate
                              ? `$${shipment.sellRate.toString()}`
                              : "$0"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col items-end gap-3">
                    <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#111111]">
                      {shipment.status.replaceAll("_", " ")}
                    </p>

                    <Link
                      href={`/dashboard/shipments/${shipment.id}`}
                      className="inline-flex rounded-xl bg-[#0F6B31] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#0B5527]"
                    >
                      View Shipment
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex min-h-96 flex-col items-center justify-center px-6 py-16 text-center">
            <div className="rounded-full bg-[#EEF7F1] p-5">
              <Package size={42} color="#0F6B31" />
            </div>

            <h3 className="mt-6 text-xl font-bold text-[#111111]">
              No shipments found
            </h3>

            <p className="mt-3 max-w-md text-sm leading-6 text-[#5F6B66]">
              No shipments match the selected filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}