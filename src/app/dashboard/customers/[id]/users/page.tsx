import Link from "next/link";
import { notFound } from "next/navigation";
import { Plus, Users } from "lucide-react";

import { prisma } from "@/lib/prisma";

export default async function CustomerUsersPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      users: {
        orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
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
            Customer Staff
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-[#111111]">
            {customer.name}
          </h1>
          <p className="mt-3 text-lg text-[#5F6B66]">
            Manage this customer&apos;s users, contacts, titles, and login
            access.
          </p>
        </div>

        <Link
          href={`/dashboard/customers/${customer.id}/users/new`}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#0F6B31] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#0B5527]"
        >
          <Plus size={18} />
          Add Staff
        </Link>
      </div>

      <div className="rounded-2xl border border-[#D8DCD8] bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-[#D8DCD8] px-6 py-5">
          <h2 className="text-xl font-bold text-[#111111]">All Staff</h2>
          <p className="text-sm font-semibold text-[#5F6B66]">
            {customer.users.length} total
          </p>
        </div>

        {customer.users.length ? (
          <div className="space-y-3 p-3">
            {customer.users.map((user) => (
              <div
                key={user.id}
                className="rounded-xl border border-[#D8DCD8] bg-white p-5"
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-[#EEF7F1] p-3">
                      <Users size={20} color="#0F6B31" />
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-[#111111]">
                        {user.firstName} {user.lastName}
                      </h3>

                      {user.title ? (
                        <p className="mt-1 text-sm font-semibold text-[#0F6B31]">
                          {user.title}
                        </p>
                      ) : null}

                      <div className="mt-4 grid gap-3 text-sm text-[#5F6B66] md:grid-cols-2">
                        <p>
                          <span className="font-bold text-[#111111]">
                            Email:
                          </span>{" "}
                          {user.email}
                        </p>

                        <p>
                          <span className="font-bold text-[#111111]">
                            Status:
                          </span>{" "}
                          {user.isActive ? "Active" : "Inactive"}
                        </p>

                        <p>
                          <span className="font-bold text-[#111111]">
                            Mobile:
                          </span>{" "}
                          {user.mobilePhone || "Not set"}
                        </p>

                        <p>
                          <span className="font-bold text-[#111111]">
                            Office:
                          </span>{" "}
                          {user.officePhone || "Not set"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 self-start">
  <Link
    href={`/dashboard/customers/${customer.id}/users/${user.id}/edit`}
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
              <Users size={42} color="#0F6B31" />
            </div>

            <h3 className="mt-6 text-xl font-bold text-[#111111]">
              No customer staff yet
            </h3>

            <p className="mt-3 max-w-md text-sm leading-6 text-[#5F6B66]">
              Customer staff will appear here once users are added to this
              customer profile.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}