import { notFound } from "next/navigation";
import {
  Building2,
  FileText,
  MapPin,
  Package,
  Plus,
  Users,
} from "lucide-react";
import Link from "next/link";

import { prisma } from "@/lib/prisma";

function formatAddress({
  address,
  address2,
  city,
  state,
  zip,
  country,
}: {
  address?: string | null;
  address2?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  country?: string | null;
}) {
  const cityStateZip = [city, state, zip].filter(Boolean).join(", ");

  return [address, address2, cityStateZip, country]
    .filter(Boolean)
    .join("\n");
}

function MapPreview({ title, address }: { title: string; address: string }) {
  const mapQuery = encodeURIComponent(address);
  const mapUrl = address
    ? `https://maps.google.com/maps?q=${mapQuery}&output=embed`
    : "";

  return (
    <div className="mt-5 rounded-2xl border border-dashed border-[#D8DCD8] bg-[#F6F8F6] p-5">
      <div className="flex items-center gap-3">
        <MapPin size={20} color="#0F6B31" />
        <p className="text-sm font-bold text-[#111111]">{title}</p>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-[#D8DCD8] bg-white">
        {mapUrl ? (
          <iframe
            src={mapUrl}
            className="h-64 w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <div className="flex h-64 items-center justify-center text-center">
            <p className="text-sm text-[#5F6B66]">No address available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      users: true,
      quotes: true,
      shipments: true,
      documents: true,
      locations: true,
      commodities: true,
      activityLogs: {
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
      },
    },
  });

  if (!customer) {
    notFound();
  }

  const physicalAddress = formatAddress({
    address: customer.physicalAddress,
    address2: customer.physicalAddress2,
    city: customer.physicalCity,
    state: customer.physicalState,
    zip: customer.physicalZip,
    country: customer.physicalCountry,
  });

  const billingAddress = formatAddress({
    address: customer.billingAddress,
    address2: customer.billingAddress2,
    city: customer.billingCity,
    state: customer.billingState,
    zip: customer.billingZip,
    country: customer.billingCountry,
  });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between gap-6">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#1D6A33]">
            Customer
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-[#111111]">
            {customer.name}
          </h1>
          <p className="mt-3 text-lg text-[#5F6B66]">
            Customer profile, addresses, saved locations, saved commodities,
            users, quotes, shipments, documents, and activity.
          </p>
        </div>

        <Link
          href={`/dashboard/customers/${customer.id}/edit`}
          className="shrink-0 rounded-xl bg-[#0F6B31] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#0B5527]"
        >
          Edit Customer
        </Link>
      </div>

      <div className="grid gap-5 xl:grid-cols-4">
        <div className="rounded-2xl border border-[#D8DCD8] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-[#5F6B66]">Users</p>
            <Users size={22} color="#0F6B31" />
          </div>
          <p className="mt-3 text-4xl font-bold text-[#0F6B31]">
            {customer.users.length}
          </p>
        </div>

        <div className="rounded-2xl border border-[#D8DCD8] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-[#5F6B66]">Quotes</p>
            <FileText size={22} color="#0F6B31" />
          </div>
          <p className="mt-3 text-4xl font-bold text-[#0F6B31]">
            {customer.quotes.length}
          </p>
        </div>

        <div className="rounded-2xl border border-[#D8DCD8] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-[#5F6B66]">Shipments</p>
            <Package size={22} color="#0F6B31" />
          </div>
          <p className="mt-3 text-4xl font-bold text-[#0F6B31]">
            {customer.shipments.length}
          </p>
        </div>

        <div className="rounded-2xl border border-[#D8DCD8] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-[#5F6B66]">Documents</p>
            <Building2 size={22} color="#0F6B31" />
          </div>
          <p className="mt-3 text-4xl font-bold text-[#0F6B31]">
            {customer.documents.length}
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-5 xl:grid-cols-2">
        <div className="rounded-2xl border border-[#D8DCD8] bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-[#111111]">
            Customer Details
          </h2>

          <div className="mt-5 space-y-3 text-sm text-[#5F6B66]">
            <p>
              <span className="font-bold text-[#111111]">Phone:</span>{" "}
              {customer.phone || "Not set"}
            </p>
            <p>
              <span className="font-bold text-[#111111]">Email:</span>{" "}
              {customer.email || "Not set"}
            </p>
            <p>
              <span className="font-bold text-[#111111]">Website:</span>{" "}
              {customer.website || "Not set"}
            </p>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-bold text-[#111111]">
              Physical Address
            </h3>
            <p className="mt-3 whitespace-pre-line text-sm leading-6 text-[#5F6B66]">
              {physicalAddress || "Not set"}
            </p>
            <MapPreview title="Physical Location" address={physicalAddress} />
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-bold text-[#111111]">
              Billing Address
            </h3>
            <p className="mt-3 whitespace-pre-line text-sm leading-6 text-[#5F6B66]">
              {billingAddress || "Not set"}
            </p>
            <MapPreview title="Billing Location" address={billingAddress} />
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-[#D8DCD8] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-[#111111]">
                Saved Locations
              </h2>

              <Link
                href={`/dashboard/customers/${customer.id}/locations`}
                className="rounded-xl bg-[#0F6B31] px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-[#0B5527]"
              >
                View Locations
              </Link>
            </div>

            <div className="mt-5 rounded-xl border border-[#D8DCD8] bg-[#F6F8F6] p-5">
              <p className="text-3xl font-bold text-[#0F6B31]">
                {customer.locations.length}
              </p>
              <p className="mt-1 text-sm text-[#5F6B66]">
                Saved Locations
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-[#D8DCD8] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-[#111111]">
                Saved Commodities
              </h2>

              <Link
                href={`/dashboard/customers/${customer.id}/commodities`}
                className="rounded-xl bg-[#0F6B31] px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-[#0B5527]"
              >
                View Commodities
              </Link>
            </div>

            <div className="mt-5 rounded-xl border border-[#D8DCD8] bg-[#F6F8F6] p-5">
              <p className="text-3xl font-bold text-[#0F6B31]">
                {customer.commodities.length}
              </p>
              <p className="mt-1 text-sm text-[#5F6B66]">
                Saved Commodities
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-[#D8DCD8] bg-white p-6 shadow-sm">
  <div className="flex items-center justify-between gap-4">
    <h2 className="text-xl font-bold text-[#111111]">
      Customer Staff
    </h2>

    <Link
      href={`/dashboard/customers/${customer.id}/users`}
      className="rounded-xl bg-[#0F6B31] px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-[#0B5527]"
    >
      View Staff
    </Link>
  </div>

  <div className="mt-5 rounded-xl border border-[#D8DCD8] bg-[#F6F8F6] p-5">
    <p className="text-3xl font-bold text-[#0F6B31]">
      {customer.users.length}
    </p>

    <p className="mt-1 text-sm text-[#5F6B66]">
      Staff Members
    </p>
  </div>
</div>

          <div className="rounded-2xl border border-[#D8DCD8] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#111111]">
              Recent Activity
            </h2>

            <div className="mt-5 space-y-3">
              {customer.activityLogs.length ? (
                customer.activityLogs.map((activity) => (
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
    </div>
  );
}