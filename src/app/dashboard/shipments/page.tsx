import Link from "next/link";
import { Package } from "lucide-react";

import { prisma } from "@/lib/prisma";

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

      <div className="mb-5 flex items-center gap-3">
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
          <div className="divide-y divide-[#D8DCD8]">
            {shipments.map((shipment) => (
              <Link
                key={shipment.id}
                href={`/dashboard/shipments/${shipment.id}`}
                className="block px-6 py-5 transition hover:bg-[#F6F8F6]"
              >
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-[#EEF7F1] p-3">
                        <Package size={22} color="#0F6B31" />
                      </div>

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

                    <p className="mt-4 text-sm text-[#5F6B66]">
                      Carrier: {shipment.carrier?.name || "Not assigned"}
                    </p>

                    <p className="mt-1 text-sm text-[#5F6B66]">
                      Assigned:{" "}
                      {shipment.assignedTo
                        ? `${shipment.assignedTo.firstName} ${shipment.assignedTo.lastName}`
                        : "Unassigned"}
                    </p>
                  </div>

                  <div className="text-right">
                    <p
                      className={`text-sm font-bold uppercase tracking-[0.12em] ${
                        shipment.status === "CANCELLED"
                          ? "text-red-600"
                          : "text-[#0F6B31]"
                      }`}
                    >
                      {shipment.status.replaceAll("_", " ")}
                    </p>

                    <p className="mt-3 text-sm text-[#5F6B66]">
                      From Quote: {shipment.quote?.quoteNumber || "N/A"}
                    </p>
                  </div>
                </div>
              </Link>
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