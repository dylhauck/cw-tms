import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { createCustomerUser } from "../../../actions";

export default async function NewCustomerUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const customer = await prisma.customer.findUnique({
    where: { id },
  });

  if (!customer) {
    notFound();
  }

  const createCustomerUserWithId = createCustomerUser.bind(null, customer.id);

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#1D6A33]">
          Customer Users
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-[#111111]">
          Add Customer Staff
        </h1>
        <p className="mt-3 text-lg text-[#5F6B66]">
          Create a login for a staff member at {customer.name}.
        </p>
      </div>

      <div className="rounded-2xl border border-[#D8DCD8] bg-white p-6 shadow-sm">
        <form action={createCustomerUserWithId} className="grid gap-6">
          <div className="grid gap-6 md:grid-cols-2">
            <input name="firstName" required placeholder="First Name" className="rounded-xl border border-[#D8DCD8] px-4 py-3" />
            <input name="lastName" required placeholder="Last Name" className="rounded-xl border border-[#D8DCD8] px-4 py-3" />
          </div>

          <input name="title" placeholder="Title / Position" className="rounded-xl border border-[#D8DCD8] px-4 py-3" />
          <input name="email" type="email" required placeholder="Email" className="rounded-xl border border-[#D8DCD8] px-4 py-3" />

          <div className="grid gap-6 md:grid-cols-2">
            <input name="mobilePhone" placeholder="Mobile Phone" className="rounded-xl border border-[#D8DCD8] px-4 py-3" />
            <input name="officePhone" placeholder="Office Phone" className="rounded-xl border border-[#D8DCD8] px-4 py-3" />
          </div>

          <input name="password" type="password" required placeholder="Temporary Password" className="rounded-xl border border-[#D8DCD8] px-4 py-3" />

          <div className="flex justify-end gap-3 border-t border-[#D8DCD8] pt-6">
            <a href={`/dashboard/customers/${customer.id}`} className="rounded-xl border border-[#D8DCD8] px-5 py-3 text-sm font-bold">
              Cancel
            </a>

            <button type="submit" className="rounded-xl bg-[#0F6B31] px-5 py-3 text-sm font-bold text-white">
              Create Customer User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}