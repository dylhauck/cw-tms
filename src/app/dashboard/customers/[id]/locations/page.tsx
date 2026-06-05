import Link from "next/link";
import { notFound } from "next/navigation";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function CustomerLocationsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      locations: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!customer) notFound();

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">
            Saved Locations
          </h1>
          <p className="mt-2 text-[#5F6B66]">
            {customer.name}
          </p>
        </div>

        <Link
          href={`/dashboard/customers/${customer.id}/locations/new`}
          className="inline-flex items-center gap-2 rounded-xl bg-[#0F6B31] px-5 py-3 text-sm font-bold text-white"
        >
          <Plus size={16} />
          Add Location
        </Link>
      </div>

      <div className="space-y-4">
        {customer.locations.map((location) => (
          <div
            key={location.id}
            className="rounded-2xl border border-[#D8DCD8] bg-white p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-lg">
                  {location.nickname || location.companyName || "Location"}
                </h2>

                <p className="mt-2 text-[#5F6B66]">
                  {location.address}
                </p>

                {location.address2 && (
                  <p className="text-[#5F6B66]">
                    {location.address2}
                  </p>
                )}

                <p className="text-[#5F6B66]">
                  {location.city}, {location.state} {location.zip}
                </p>
              </div>

              <div className="shrink-0 self-start">
  <Link
    href={`/dashboard/customers/${customer.id}/locations/${location.id}/edit`}
    className="rounded-lg border border-[#D8DCD8] bg-white px-4 py-2 text-sm font-bold text-[#0F6B31] transition hover:bg-[#EEF7F1]"
  >
    Edit
  </Link>
</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}