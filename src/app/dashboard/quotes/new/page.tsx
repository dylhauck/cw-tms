import QuoteForm from "@/components/QuoteForm";
import { prisma } from "@/lib/prisma";
import { createQuote } from "../actions";

export default async function NewQuotePage() {
  const customersFromDb = await prisma.customer.findMany({
    orderBy: { name: "asc" },
    include: {
      users: {
        where: {
          userType: "CUSTOMER",
          isActive: true,
        },
        orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
      },
      locations: {
        where: {
          isActive: true,
        },
        orderBy: [{ nickname: "asc" }, { companyName: "asc" }],
      },
      commodities: {
        where: {
          isActive: true,
        },
        orderBy: {
          name: "asc",
        },
      },
    },
  });

  const customers = customersFromDb.map((customer) => ({
    id: customer.id,
    name: customer.name,
    users: customer.users.map((user) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
    })),
    locations: customer.locations.map((location) => ({
      id: location.id,
      nickname: location.nickname,
      companyName: location.companyName,
      address: location.address,
      address2: location.address2,
      city: location.city,
      state: location.state,
      zip: location.zip,
      country: location.country,
    })),
    commodities: customer.commodities.map((commodity) => ({
      id: commodity.id,
      name: commodity.name,
      description: commodity.description,
      freightClass: commodity.freightClass,
      nmfc: commodity.nmfc,
      pieceType: commodity.pieceType,
      weightLbs: commodity.weightLbs?.toString() || null,
      lengthIn: commodity.lengthIn?.toString() || null,
      widthIn: commodity.widthIn?.toString() || null,
      heightIn: commodity.heightIn?.toString() || null,
    })),
  }));

  const staffUsers = await prisma.user.findMany({
    where: {
      userType: "STAFF",
      isActive: true,
    },
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
    select: {
      id: true,
      firstName: true,
      lastName: true,
    },
  });

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#1D6A33]">
          Quotes
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-[#111111]">
          Create Quote
        </h1>
        <p className="mt-3 text-lg text-[#5F6B66]">
          Select a customer, reuse saved locations and commodities, then create
          the quote.
        </p>
      </div>

      <div className="rounded-2xl border border-[#D8DCD8] bg-white p-6 shadow-sm">
        <QuoteForm
          customers={customers}
          staffUsers={staffUsers}
          action={createQuote}
        />
      </div>
    </div>
  );
}