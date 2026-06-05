import { notFound } from "next/navigation";

import QuoteForm from "@/components/QuoteForm";
import { prisma } from "@/lib/prisma";
import { updateQuote } from "../../actions";

export default async function EditQuotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const quote = await prisma.quote.findUnique({
    where: { id },
  });

  if (!quote) {
    notFound();
  }

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

  const updateQuoteWithId = updateQuote.bind(null, quote.id);

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#1D6A33]">
          Quotes
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-[#111111]">
          Edit Quote {quote.quoteNumber}
        </h1>
        <p className="mt-3 text-lg text-[#5F6B66]">
          Update quote details, shipment information, and pricing.
        </p>
      </div>

      <div className="rounded-2xl border border-[#D8DCD8] bg-white p-6 shadow-sm">
        <QuoteForm
          customers={customers}
          staffUsers={staffUsers}
          action={updateQuoteWithId}
          quote={{
            id: quote.id,
            customerId: quote.customerId,
            requestedById: quote.requestedById,
            assignedToId: quote.assignedToId,
            serviceType: quote.serviceType,

            originName: quote.originName,
            originAddress: quote.originAddress,
            originAddress2: quote.originAddress2,
            originCity: quote.originCity,
            originState: quote.originState,
            originZip: quote.originZip,
            originCountry: quote.originCountry,

            destinationName: quote.destinationName,
            destinationAddress: quote.destinationAddress,
            destinationAddress2: quote.destinationAddress2,
            destinationCity: quote.destinationCity,
            destinationState: quote.destinationState,
            destinationZip: quote.destinationZip,
            destinationCountry: quote.destinationCountry,

            pieces: quote.pieces,
            pallets: quote.pallets,
            pieceType: quote.pieceType,

            weightLbs: quote.weightLbs?.toString() || null,
            lengthIn: quote.lengthIn?.toString() || null,
            widthIn: quote.widthIn?.toString() || null,
            heightIn: quote.heightIn?.toString() || null,

            freightClass: quote.freightClass,
            nmfc: quote.nmfc,
            description: quote.description,

            buyRate: quote.buyRate?.toString() || null,
            sellRate: quote.sellRate?.toString() || null,

            notes: quote.notes,
            miles: quote.miles,
          }}
        />
      </div>
    </div>
  );
}