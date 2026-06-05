import Link from "next/link";
import { notFound } from "next/navigation";
import { Package, Plus } from "lucide-react";

import { prisma } from "@/lib/prisma";

function formatValue(value: unknown) {
  return value ? value.toString() : "Not set";
}

function formatPieceType(value: string | null) {
  return value ? value.replaceAll("_", " ") : "Not set";
}

export default async function CustomerCommoditiesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      commodities: {
        orderBy: { name: "asc" },
      },
    },
  });

  if (!customer) {
    notFound();
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between gap-6">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#1D6A33]">
            Saved Commodities
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-[#111111]">
            {customer.name}
          </h1>
          <p className="mt-3 text-lg text-[#5F6B66]">
            Manage this customer&apos;s saved commodities for faster quoting.
          </p>
        </div>

        <Link
          href={`/dashboard/customers/${customer.id}/commodities/new`}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#0F6B31] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#0B5527]"
        >
          <Plus size={18} />
          Add Commodity
        </Link>
      </div>

      <div className="rounded-2xl border border-[#D8DCD8] bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-[#D8DCD8] px-6 py-5">
          <h2 className="text-xl font-bold text-[#111111]">
            All Commodities
          </h2>
          <p className="text-sm font-semibold text-[#5F6B66]">
            {customer.commodities.length} total
          </p>
        </div>

        {customer.commodities.length ? (
          <div className="space-y-3 p-3">
            {customer.commodities.map((commodity) => (
              <div
                key={commodity.id}
                className="rounded-xl border border-[#D8DCD8] bg-white p-5"
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-[#EEF7F1] p-3">
                      <Package size={20} color="#0F6B31" />
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-[#111111]">
                        {commodity.name}
                      </h3>

                      <div className="mt-4 grid gap-3 text-sm text-[#5F6B66] md:grid-cols-2">
                        <p>
                          <span className="font-bold text-[#111111]">
                            Class:
                          </span>{" "}
                          {commodity.freightClass || "Not set"}
                        </p>

                        <p>
                          <span className="font-bold text-[#111111]">
                            NMFC:
                          </span>{" "}
                          {commodity.nmfc || "Not set"}
                        </p>

                        <p>
                          <span className="font-bold text-[#111111]">
                            Piece Type:
                          </span>{" "}
                          {formatPieceType(commodity.pieceType)}
                        </p>

                        <p>
                          <span className="font-bold text-[#111111]">
                            Weight:
                          </span>{" "}
                          {commodity.weightLbs
                            ? `${commodity.weightLbs.toString()} lbs`
                            : "Not set"}
                        </p>

                        <p className="md:col-span-2">
                          <span className="font-bold text-[#111111]">
                            Dimensions:
                          </span>{" "}
                          {formatValue(commodity.lengthIn)} x{" "}
                          {formatValue(commodity.widthIn)} x{" "}
                          {formatValue(commodity.heightIn)} in
                        </p>

                        {commodity.description ? (
                          <p className="md:col-span-2">
                            <span className="font-bold text-[#111111]">
                              Description:
                            </span>{" "}
                            {commodity.description}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 self-start">
  <Link
    href={`/dashboard/customers/${customer.id}/commodities/${commodity.id}/edit`}
    className="rounded-lg border border-[#D8DCD8] bg-white px-4 py-2 text-sm font-bold text-[#0F6B31] transition hover:bg-[#EEF7F1]"
  >
    Edit
  </Link>
</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex min-h-80 flex-col items-center justify-center px-6 py-16 text-center">
            <div className="rounded-full bg-[#EEF7F1] p-5">
              <Package size={42} color="#0F6B31" />
            </div>

            <h3 className="mt-6 text-xl font-bold text-[#111111]">
              No saved commodities yet
            </h3>

            <p className="mt-3 max-w-md text-sm leading-6 text-[#5F6B66]">
              Saved commodities will appear here once they are added to this
              customer profile.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}