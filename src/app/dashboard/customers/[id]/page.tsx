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
  city,
  state,
  zip,
  country,
}: {
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  country?: string | null;
}) {
  const cityStateZip = [city, state, zip].filter(Boolean).join(", ");
  return [address, cityStateZip, country].filter(Boolean).join("\n");
}

function MapPreview({
  title,
  address,
}: {
  title: string;
  address: string;
}) {
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

function SavedLocationCard({
  location,
}: {
  location: {
    id: string;
    nickname: string | null;
    companyName: string | null;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    contactName: string | null;
    contactPhone: string | null;
    contactEmail: string | null;
  };
}) {
  const fullAddress = formatAddress({
    address: location.address,
    city: location.city,
    state: location.state,
    zip: location.zip,
    country: location.country,
  });

  return (
    <div className="rounded-xl border border-[#D8DCD8] bg-[#F6F8F6] p-4">
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-white p-2">
          <MapPin size={18} color="#0F6B31" />
        </div>

        <div className="min-w-0">
          <p className="text-sm font-bold text-[#111111]">
            {location.nickname || location.companyName || "Saved Location"}
          </p>

          {location.companyName ? (
            <p className="mt-1 text-sm font-semibold text-[#0F6B31]">
              {location.companyName}
            </p>
          ) : null}

          <p className="mt-2 whitespace-pre-line text-sm leading-6 text-[#5F6B66]">
            {fullAddress}
          </p>

          {location.contactName ||
          location.contactPhone ||
          location.contactEmail ? (
            <div className="mt-3 space-y-1 text-sm text-[#5F6B66]">
              <p>Contact: {location.contactName || "Not set"}</p>
              <p>Phone: {location.contactPhone || "Not set"}</p>
              <p>Email: {location.contactEmail || "Not set"}</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function SavedCommodityCard({
  commodity,
}: {
  commodity: {
    id: string;
    name: string;
    description: string | null;
    freightClass: string | null;
    nmfc: string | null;
    pieceType: string | null;
    weightLbs: unknown;
    lengthIn: unknown;
    widthIn: unknown;
    heightIn: unknown;
  };
}) {
  const dimensions =
    commodity.lengthIn || commodity.widthIn || commodity.heightIn
      ? `${commodity.lengthIn || "?"} x ${commodity.widthIn || "?"} x ${
          commodity.heightIn || "?"
        } in`
      : "Not set";

  return (
    <div className="rounded-xl border border-[#D8DCD8] bg-[#F6F8F6] p-4">
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-white p-2">
          <Package size={18} color="#0F6B31" />
        </div>

        <div className="min-w-0">
          <p className="text-sm font-bold text-[#111111]">{commodity.name}</p>

          {commodity.description ? (
            <p className="mt-2 text-sm leading-6 text-[#5F6B66]">
              {commodity.description}
            </p>
          ) : null}

          <div className="mt-3 grid gap-2 text-sm text-[#5F6B66] md:grid-cols-2">
            <p>
              <span className="font-bold text-[#111111]">Class:</span>{" "}
              {commodity.freightClass || "Not set"}
            </p>
            <p>
              <span className="font-bold text-[#111111]">NMFC:</span>{" "}
              {commodity.nmfc || "Not set"}
            </p>
            <p>
              <span className="font-bold text-[#111111]">Piece Type:</span>{" "}
              {commodity.pieceType
                ? commodity.pieceType.replaceAll("_", " ")
                : "Not set"}
            </p>
            <p>
              <span className="font-bold text-[#111111]">Weight:</span>{" "}
              {commodity.weightLbs
                ? `${commodity.weightLbs.toString()} lbs`
                : "Not set"}
            </p>
            <p className="md:col-span-2">
              <span className="font-bold text-[#111111]">Dimensions:</span>{" "}
              {dimensions}
            </p>
          </div>
        </div>
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
      locations: {
        orderBy: {
          createdAt: "desc",
        },
      },
      commodities: {
        orderBy: {
          createdAt: "desc",
        },
      },
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
    city: customer.physicalCity,
    state: customer.physicalState,
    zip: customer.physicalZip,
    country: customer.physicalCountry,
  });

  const billingAddress = formatAddress({
    address: customer.billingAddress,
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
                href={`/dashboard/customers/${customer.id}/locations/new`}
                className="inline-flex items-center gap-2 rounded-xl bg-[#0F6B31] px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-[#0B5527]"
              >
                <Plus size={16} />
                Add Location
              </Link>
            </div>

            <div className="mt-5 space-y-3">
              {customer.locations.length ? (
                customer.locations.map((location) => (
                  <SavedLocationCard key={location.id} location={location} />
                ))
              ) : (
                <p className="text-sm text-[#5F6B66]">
                  No saved locations added yet.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-[#D8DCD8] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-[#111111]">
                Saved Commodities
              </h2>

              <Link
                href={`/dashboard/customers/${customer.id}/commodities/new`}
                className="inline-flex items-center gap-2 rounded-xl bg-[#0F6B31] px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-[#0B5527]"
              >
                <Plus size={16} />
                Add Commodity
              </Link>
            </div>

            <div className="mt-5 space-y-3">
              {customer.commodities.length ? (
                customer.commodities.map((commodity) => (
                  <SavedCommodityCard
                    key={commodity.id}
                    commodity={commodity}
                  />
                ))
              ) : (
                <p className="text-sm text-[#5F6B66]">
                  No saved commodities added yet.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-[#D8DCD8] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-[#111111]">
                Customer Staff
              </h2>

              <Link
                href={`/dashboard/customers/${customer.id}/users/new`}
                className="inline-flex items-center gap-2 rounded-xl bg-[#0F6B31] px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-[#0B5527]"
              >
                <Plus size={16} />
                Add Staff
              </Link>
            </div>

            <div className="mt-5 space-y-3">
              {customer.users.length ? (
                customer.users.map((user) => (
                  <div
                    key={user.id}
                    className="rounded-xl border border-[#D8DCD8] bg-[#F6F8F6] p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-bold text-[#111111]">
                          {user.firstName} {user.lastName}
                        </p>

                        {user.title ? (
                          <p className="mt-1 text-sm font-semibold text-[#0F6B31]">
                            {user.title}
                          </p>
                        ) : null}

                        <p className="mt-1 text-sm text-[#5F6B66]">
                          {user.email}
                        </p>

                        <div className="mt-3 space-y-1 text-sm text-[#5F6B66]">
                          <p>Mobile: {user.mobilePhone || "Not set"}</p>
                          <p>Office: {user.officePhone || "Not set"}</p>
                        </div>

                        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#0F6B31]">
                          {user.isActive ? "Active" : "Inactive"}
                        </p>
                      </div>

                      <Link
                        href={`/dashboard/customers/${customer.id}/users/${user.id}/edit`}
                        className="rounded-lg border border-[#D8DCD8] bg-white px-4 py-2 text-sm font-bold text-[#0F6B31] transition hover:bg-[#EEF7F1]"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[#5F6B66]">
                  No customer staff added yet.
                </p>
              )}
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