import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { updateCustomerUser } from "../../../../actions";

export default async function EditCustomerUserPage({
  params,
}: {
  params: Promise<{ id: string; userId: string }>;
}) {
  const { id, userId } = await params;

  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      customerId: id,
    },
    include: {
      customer: true,
    },
  });

  if (!user || !user.customer) {
    notFound();
  }

  const updateCustomerUserWithIds = updateCustomerUser.bind(
    null,
    id,
    user.id
  );

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#1D6A33]">
          Customer Staff
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-[#111111]">
          Edit Customer Staff
        </h1>
        <p className="mt-3 text-lg text-[#5F6B66]">
          Update staff details for {user.customer.name}.
        </p>
      </div>

      <div className="rounded-2xl border border-[#D8DCD8] bg-white p-6 shadow-sm">
        <form action={updateCustomerUserWithIds} className="grid gap-6">
          <div className="grid gap-6 md:grid-cols-2">
            <input name="firstName" required defaultValue={user.firstName} placeholder="First Name" className="rounded-xl border border-[#D8DCD8] px-4 py-3" />
            <input name="lastName" required defaultValue={user.lastName} placeholder="Last Name" className="rounded-xl border border-[#D8DCD8] px-4 py-3" />
          </div>

          <input name="title" defaultValue={user.title || ""} placeholder="Title / Position" className="rounded-xl border border-[#D8DCD8] px-4 py-3" />
          <input name="email" type="email" required defaultValue={user.email} placeholder="Email" className="rounded-xl border border-[#D8DCD8] px-4 py-3" />

          <div className="grid gap-6 md:grid-cols-2">
            <input name="mobilePhone" defaultValue={user.mobilePhone || ""} placeholder="Mobile Phone" className="rounded-xl border border-[#D8DCD8] px-4 py-3" />
            <input name="officePhone" defaultValue={user.officePhone || ""} placeholder="Office Phone" className="rounded-xl border border-[#D8DCD8] px-4 py-3" />
          </div>

          <input name="password" type="password" placeholder="New Password (leave blank to keep current)" className="rounded-xl border border-[#D8DCD8] px-4 py-3" />

          <label className="flex items-center gap-3 text-sm font-bold text-[#111111]">
            <input
              name="isActive"
              type="checkbox"
              defaultChecked={user.isActive}
              className="h-4 w-4"
            />
            Active User
          </label>

          <div className="flex justify-end gap-3 border-t border-[#D8DCD8] pt-6">
            <a href={`/dashboard/customers/${id}`} className="rounded-xl border border-[#D8DCD8] px-5 py-3 text-sm font-bold">
              Cancel
            </a>

            <button type="submit" className="rounded-xl bg-[#0F6B31] px-5 py-3 text-sm font-bold text-white">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}