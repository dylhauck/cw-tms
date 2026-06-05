import { notFound } from "next/navigation";
import {
  Building2,
  DollarSign,
  FileText,
  MapPin,
  Package,
  Truck,
  User,
} from "lucide-react";
import Link from "next/link";

import CancelShipmentForm from "@/components/CancelShipmentForm";
import { prisma } from "@/lib/prisma";
import { cancelShipment } from "../actions";

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

function AddressCard({ title, address }: { title: string; address: string }) {
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

function RateBreakdownCard({
  title,
  total,
}: {
  title: string;
  total: unknown;
}) {
  return (
    <div className="rounded-2xl border border-[#D8DCD8] bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <DollarSign size={22} color="#0F6B31" />
        <h2 className="text-xl font-bold text-[#111111]">{title}</h2>
      </div>

      <div className="mt-5 space-y-3 text-sm text-[#5F6B66]">
        <div className="flex justify-between gap-4">
          <span className="font-bold text-[#111111]">Linehaul/Base Rate</span>
          <span>{formatMoney(total)}</span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="font-bold text-[#111111]">Fuel</span>
          <span>{formatMoney(0)}</span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="font-bold text-[#111111]">Accessorials</span>
          <span>{formatMoney(0)}</span>
        </div>

        <div className="border-t border-[#D8DCD8] pt-3">
          <div className="flex justify-between gap-4">
            <span className="text-base font-bold text-[#111111]">Total</span>
            <span className="text-base font-bold text-[#0F6B31]">
              {formatMoney(total)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function ShipmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const shipment = await prisma.shipment.findUnique({
    where: { id },
    include: {
      customer: true,
      carrier: true,
      quote: {
        include: {
          requestedBy: true,
        },
      },
      assignedTo: true,
      createdBy: true,
      trackingEvents: {
        orderBy: {
          eventTime: "desc",
        },
      },
      documents: true,
      activityLogs: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!shipment) {
    notFound();
  }

  const cancelShipmentWithId = cancelShipment.bind(null, shipment.id);

  const originAddress = formatAddress({
    name: shipment.originName,
    address: shipment.originAddress,
    city: shipment.originCity,
    state: shipment.originState,
    zip: shipment.originZip,
    country: shipment.originCountry,
  });

  const destinationAddress = formatAddress({
    name: shipment.destinationName,
    address: shipment.destinationAddress,
    city: shipment.destinationCity,
    state: shipment.destinationState,
    zip: shipment.destinationZip,
    country: shipment.destinationCountry,
  });

  const marginPercent =
    shipment.sellRate && shipment.margin
      ? (Number(shipment.margin) / Number(shipment.sellRate)) * 100
      : 0;

  const customerStaffName = shipment.quote?.requestedBy
    ? `${shipment.quote.requestedBy.firstName} ${shipment.quote.requestedBy.lastName}`
    : "Not set";

  return (
    <div>
      <div className="mb-8 flex items-start justify-between gap-6">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#1D6A33]">
            Shipment
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-[#111111]">
            {shipment.shipmentNumber}
          </h1>
          <p className="mt-3 text-lg text-[#5F6B66]">
            {shipment.customer.name} ·{" "}
            {shipment.serviceType.replaceAll("_", " ")}
          </p>
        </div>

        <div className="flex shrink-0 items-start gap-3">
          {shipment.quote ? (
            <Link
              href={`/dashboard/quotes/${shipment.quote.id}/edit`}
              className="rounded-xl bg-[#0F6B31] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#0B5527]"
            >
              Edit Quote
            </Link>
          ) : null}

          {shipment.status !== "CANCELLED" ? (
            <CancelShipmentForm action={cancelShipmentWithId} />
          ) : null}
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-4">
        <div className="rounded-2xl border border-[#D8DCD8] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-[#5F6B66]">Status</p>
            <Package size={22} color="#0F6B31" />
          </div>
          <p
            className={`mt-3 text-2xl font-bold ${
              shipment.status === "CANCELLED"
                ? "text-red-600"
                : "text-[#0F6B31]"
            }`}
          >
            {shipment.status.replaceAll("_", " ")}
          </p>
        </div>

        <div className="rounded-2xl border border-[#D8DCD8] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-[#5F6B66]">Carrier</p>
            <Truck size={22} color="#0F6B31" />
          </div>
          <p className="mt-3 text-2xl font-bold text-[#111111]">
            {shipment.carrier?.name || "Not assigned"}
          </p>
        </div>

        <div className="rounded-2xl border border-[#D8DCD8] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-[#5F6B66]">BOL #</p>
            <FileText size={22} color="#0F6B31" />
          </div>
          <p className="mt-3 text-2xl font-bold text-[#111111]">
            {shipment.bolNumber || shipment.shipmentNumber}
          </p>
        </div>

        <div className="rounded-2xl border border-[#D8DCD8] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-[#5F6B66]">Margin</p>
            <DollarSign size={22} color="#0F6B31" />
          </div>
          <p className="mt-3 text-2xl font-bold text-[#0F6B31]">
            {formatMoney(shipment.margin)}
          </p>
          <p className="mt-1 text-sm text-[#5F6B66]">
            {marginPercent.toFixed(2)}%
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-5 xl:grid-cols-2">
        <RateBreakdownCard title="Buy Rate Breakdown" total={shipment.buyRate} />
        <RateBreakdownCard
          title="Sell Rate Breakdown"
          total={shipment.sellRate}
        />
      </div>

      <div className="mt-8 grid gap-5 xl:grid-cols-3">
        <div className="rounded-2xl border border-[#D8DCD8] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <Package size={22} color="#0F6B31" />
            <h2 className="text-xl font-bold text-[#111111]">Freight Info</h2>
          </div>

          <div className="mt-5 space-y-3 text-sm text-[#5F6B66]">
            <p>
              <span className="font-bold text-[#111111]">Pieces:</span>{" "}
              {shipment.pieces || "Not set"}
            </p>
            <p>
              <span className="font-bold text-[#111111]">Piece Type:</span>{" "}
              {shipment.pieceType
                ? shipment.pieceType.replaceAll("_", " ")
                : "Not set"}
            </p>
            <p>
              <span className="font-bold text-[#111111]">Pallets:</span>{" "}
              {shipment.pallets || "Not set"}
            </p>
            <p>
              <span className="font-bold text-[#111111]">Weight:</span>{" "}
              {shipment.weightLbs
                ? `${shipment.weightLbs.toString()} lbs`
                : "Not set"}
            </p>
            <p>
              <span className="font-bold text-[#111111]">Class:</span>{" "}
              {shipment.freightClass || "Not set"}
            </p>
            <p>
              <span className="font-bold text-[#111111]">NMFC:</span>{" "}
              {shipment.nmfc || "Not set"}
            </p>
            <p>
              <span className="font-bold text-[#111111]">Miles:</span>{" "}
              {shipment.miles ? `${shipment.miles} mi` : "Not set"}
            </p>
            <p>
              <span className="font-bold text-[#111111]">Description:</span>{" "}
              {shipment.description || "Not set"}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-[#D8DCD8] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <Building2 size={22} color="#0F6B31" />
            <h2 className="text-xl font-bold text-[#111111]">Customer</h2>
          </div>

          <div className="mt-5 space-y-3 text-sm text-[#5F6B66]">
            <p>
              <span className="font-bold text-[#111111]">Company:</span>{" "}
              {shipment.customer.name}
            </p>
            <p>
              <span className="font-bold text-[#111111]">Staff:</span>{" "}
              {customerStaffName}
            </p>
            <p>
              <span className="font-bold text-[#111111]">Quote:</span>{" "}
              {shipment.quote?.quoteNumber || "N/A"}
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
              {shipment.assignedTo
                ? `${shipment.assignedTo.firstName} ${shipment.assignedTo.lastName}`
                : "Unassigned"}
            </p>
            <p>
              <span className="font-bold text-[#111111]">Created By:</span>{" "}
              {shipment.createdBy
                ? `${shipment.createdBy.firstName} ${shipment.createdBy.lastName}`
                : "Not set"}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-5 xl:grid-cols-2">
        <div className="rounded-2xl border border-[#D8DCD8] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <FileText size={22} color="#0F6B31" />
            <h2 className="text-xl font-bold text-[#111111]">References</h2>
          </div>

          <div className="mt-5 space-y-3 text-sm text-[#5F6B66]">
            <p>
              <span className="font-bold text-[#111111]">PRO:</span>{" "}
              {shipment.proNumber || "Not set"}
            </p>
            <p>
              <span className="font-bold text-[#111111]">BOL:</span>{" "}
              {shipment.bolNumber || shipment.shipmentNumber}
            </p>
            <p>
              <span className="font-bold text-[#111111]">PO:</span>{" "}
              {shipment.poNumber || "Not set"}
            </p>
            <p>
              <span className="font-bold text-[#111111]">Tracking:</span>{" "}
              {shipment.trackingNumber || "Not set"}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-[#D8DCD8] bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-[#111111]">Accessorials</h2>
          <p className="mt-5 text-sm leading-6 text-[#5F6B66]">
            No accessorials added yet. We will add accessorial tracking next so
            fuel, liftgate, residential, inside delivery, appointment, detention,
            and other charges show here.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-5 xl:grid-cols-2">
        <AddressCard title="Origin" address={originAddress} />
        <AddressCard title="Destination" address={destinationAddress} />
      </div>

      <div className="mt-8 grid gap-5 xl:grid-cols-2">
        <div className="rounded-2xl border border-[#D8DCD8] bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-[#111111]">Tracking Events</h2>

          <div className="mt-5 space-y-3">
            {shipment.trackingEvents.length ? (
              shipment.trackingEvents.map((event) => (
                <div
                  key={event.id}
                  className="rounded-xl border border-[#D8DCD8] bg-[#F6F8F6] p-4"
                >
                  <p className="text-sm font-bold text-[#111111]">
                    {event.status.replaceAll("_", " ")}
                  </p>
                  <p className="mt-1 text-sm text-[#5F6B66]">
                    {event.location || "No location"}
                  </p>
                  <p className="mt-1 text-xs text-[#5F6B66]">
                    {event.eventTime.toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-[#5F6B66]">
                No tracking events yet.
              </p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-[#D8DCD8] bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-[#111111]">Recent Activity</h2>

          <div className="mt-5 space-y-3">
            {shipment.activityLogs.length ? (
              shipment.activityLogs.map((activity) => (
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