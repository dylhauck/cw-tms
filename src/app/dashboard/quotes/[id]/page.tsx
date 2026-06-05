import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Building2,
  DollarSign,
  FileText,
  MapPin,
  Package,
  User,
} from "lucide-react";

import QuoteStatusForm from "@/components/QuoteStatusForm";
import { prisma } from "@/lib/prisma";
import { updateQuoteStatus } from "../actions";

function formatMoney(value: unknown) {
  if (!value) return "$0.00";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value));
}

function formatAddress({
  name,
  address,
  city,
  state,
  zip,
  country,
}: {
  name?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  country?: string | null;
}) {
  const cityStateZip = [city, state, zip].filter(Boolean).join(", ");
  return [name, address, cityStateZip, country].filter(Boolean).join("\n");
}

function AddressCard({
  title,
  address,
}: {
  title: string;
  address: string;
}) {
  const mapUrl = address
    ? `https://maps.google.com/maps?q=${encodeURIComponent(
        address
      )}&output=embed`
    : "";

  return (
    <div className="rounded-2xl border border-[#D8DCD8] bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <MapPin size={22} color="#0F6B31" />
        <h2 className="text-xl font-bold text-[#111111]">{title}</h2>
      </div>

      <p className="mt-4 whitespace-pre-line text-sm leading-6 text-[#5F6B66]">
        {address || "Not set"}
      </p>

      <div className="mt-5 overflow-hidden rounded-xl border border-[#D8DCD8] bg-[#F6F8F6]">
        {mapUrl ? (
          <iframe
            src={mapUrl}
            className="h-56 w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <div className="flex h-56 items-center justify-center text-sm text-[#5F6B66]">
            No map available.
          </div>
        )}
      </div>
    </div>
  );
}

export default async function QuoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const quote = await prisma.quote.findUnique({
    where: { id },
    include: {
      customer: true,
      requestedBy: true,
      assignedTo: true,
      createdBy: true,
      shipment: true,
      activityLogs: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!quote) {
    notFound();
  }

  const updateQuoteStatusWithId = updateQuoteStatus.bind(null, quote.id);

  const originAddress = formatAddress({
    name: quote.originName,
    address: quote.originAddress,
    city: quote.originCity,
    state: quote.originState,
    zip: quote.originZip,
    country: quote.originCountry,
  });

  const destinationAddress = formatAddress({
    name: quote.destinationName,
    address: quote.destinationAddress,
    city: quote.destinationCity,
    state: quote.destinationState,
    zip: quote.destinationZip,
    country: quote.destinationCountry,
  });

  const marginPercent =
    quote.sellRate && quote.margin
      ? (Number(quote.margin) / Number(quote.sellRate)) * 100
      : 0;

  return (
    <div>
      <div className="mb-8 flex items-center justify-between gap-6">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#1D6A33]">
            Quote
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-[#111111]">
            {quote.quoteNumber}
          </h1>
          <p className="mt-3 text-lg text-[#5F6B66]">
            {quote.customer.name} · {quote.serviceType.replaceAll("_", " ")}
          </p>
        </div>

        <Link
          href={`/dashboard/quotes/${quote.id}/edit`}
          className="rounded-xl bg-[#0F6B31] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#0B5527]"
        >
          Edit Quote
        </Link>
      </div>

      <div className="grid gap-5 xl:grid-cols-4">
        <div className="rounded-2xl border border-[#D8DCD8] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-[#5F6B66]">Status</p>
            <FileText size={22} color="#0F6B31" />
          </div>
          <p className="mt-3 text-2xl font-bold text-[#0F6B31]">
            {quote.status.replaceAll("_", " ")}
          </p>
        </div>

        <div className="rounded-2xl border border-[#D8DCD8] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-[#5F6B66]">Sell Rate</p>
            <DollarSign size={22} color="#0F6B31" />
          </div>
          <p className="mt-3 text-2xl font-bold text-[#111111]">
            {formatMoney(quote.sellRate)}
          </p>
        </div>

        <div className="rounded-2xl border border-[#D8DCD8] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-[#5F6B66]">Buy Rate</p>
            <DollarSign size={22} color="#0F6B31" />
          </div>
          <p className="mt-3 text-2xl font-bold text-[#111111]">
            {formatMoney(quote.buyRate)}
          </p>
        </div>

        <div className="rounded-2xl border border-[#D8DCD8] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-[#5F6B66]">Margin</p>
            <DollarSign size={22} color="#0F6B31" />
          </div>
          <p className="mt-3 text-2xl font-bold text-[#0F6B31]">
            {formatMoney(quote.margin)}
          </p>
          <p className="mt-1 text-sm text-[#5F6B66]">
            {marginPercent.toFixed(2)}%
          </p>
        </div>
      </div>

      {!quote.shipment && quote.status !== "CANCELLED" ? (
        <div className="mt-8">
          <QuoteStatusForm
            currentStatus={quote.status}
            action={updateQuoteStatusWithId}
          />
        </div>
      ) : null}

      {quote.cancellationReason ? (
        <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-red-900">
            Cancellation Reason
          </h2>
          <p className="mt-3 whitespace-pre-line text-sm leading-6 text-red-800">
            {quote.cancellationReason}
          </p>
        </div>
      ) : null}

      <div className="mt-8 grid gap-5 xl:grid-cols-3">
        <div className="rounded-2xl border border-[#D8DCD8] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <Building2 size={22} color="#0F6B31" />
            <h2 className="text-xl font-bold text-[#111111]">Customer</h2>
          </div>

          <div className="mt-5 space-y-3 text-sm text-[#5F6B66]">
            <p>
              <span className="font-bold text-[#111111]">Company:</span>{" "}
              {quote.customer.name}
            </p>
            <p>
              <span className="font-bold text-[#111111]">Contact:</span>{" "}
              {quote.requestedBy
                ? `${quote.requestedBy.firstName} ${quote.requestedBy.lastName}`
                : "Not set"}
            </p>
            <p>
              <span className="font-bold text-[#111111]">Contact Email:</span>{" "}
              {quote.requestedBy?.email || "Not set"}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-[#D8DCD8] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <User size={22} color="#0F6B31" />
            <h2 className="text-xl font-bold text-[#111111]">CW Assignment</h2>
          </div>

          <div className="mt-5 space-y-3 text-sm text-[#5F6B66]">
            <p>
              <span className="font-bold text-[#111111]">Assigned To:</span>{" "}
              {quote.assignedTo
                ? `${quote.assignedTo.firstName} ${quote.assignedTo.lastName}`
                : "Unassigned"}
            </p>
            <p>
              <span className="font-bold text-[#111111]">Created By:</span>{" "}
              {quote.createdBy
                ? `${quote.createdBy.firstName} ${quote.createdBy.lastName}`
                : "Not set"}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-[#D8DCD8] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <Package size={22} color="#0F6B31" />
            <h2 className="text-xl font-bold text-[#111111]">Freight</h2>
          </div>

          <div className="mt-5 space-y-3 text-sm text-[#5F6B66]">
            <p>
              <span className="font-bold text-[#111111]">Pieces:</span>{" "}
              {quote.pieces || "Not set"}
            </p>
            <p>
              <span className="font-bold text-[#111111]">Pallets:</span>{" "}
              {quote.pallets || "Not set"}
            </p>
            <p>
              <span className="font-bold text-[#111111]">Weight:</span>{" "}
              {quote.weightLbs
                ? `${quote.weightLbs.toString()} lbs`
                : "Not set"}
            </p>
            <p>
              <span className="font-bold text-[#111111]">Class:</span>{" "}
              {quote.freightClass || "Not set"}
            </p>
            <p>
              <span className="font-bold text-[#111111]">NMFC:</span>{" "}
              {quote.nmfc || "Not set"}
            </p>
            <p>
              <span className="font-bold text-[#111111]">Miles:</span>{" "}
              {quote.miles ? `${quote.miles} mi` : "Not set"}
            </p>
            <p>
              <span className="font-bold text-[#111111]">Dimensions:</span>{" "}
              {quote.lengthIn || quote.widthIn || quote.heightIn
                ? `${quote.lengthIn || "?"} x ${quote.widthIn || "?"} x ${
                    quote.heightIn || "?"
                  } in`
                : "Not set"}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-5 xl:grid-cols-2">
        <AddressCard title="Origin" address={originAddress} />
        <AddressCard title="Destination" address={destinationAddress} />
      </div>

      <div className="mt-8 grid gap-5 xl:grid-cols-2">
        <div className="rounded-2xl border border-[#D8DCD8] bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-[#111111]">Notes</h2>
          <p className="mt-4 whitespace-pre-line text-sm leading-6 text-[#5F6B66]">
            {quote.notes || "No notes added."}
          </p>
        </div>

        <div className="rounded-2xl border border-[#D8DCD8] bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-[#111111]">Recent Activity</h2>

          <div className="mt-5 space-y-3">
            {quote.activityLogs.length ? (
              quote.activityLogs.map((activity) => (
                <div
                  key={activity.id}
                  className="rounded-xl border border-[#D8DCD8] bg-[#F6F8F6] p-4"
                >
                  <p className="text-sm font-semibold text-[#111111]">
                    {activity.message}
                  </p>
                  <p className="mt-1 text-xs text-[#5F6B66]">
                    {activity.createdAt.toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-[#5F6B66]">No activity yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}