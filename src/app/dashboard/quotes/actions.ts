"use server";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { PieceType, ServiceType } from "@/generated/prisma/client";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function cleanValue(value: FormDataEntryValue | null) {
  const stringValue = value?.toString().trim();
  return stringValue ? stringValue : null;
}

function cleanDecimal(value: FormDataEntryValue | null) {
  const stringValue = cleanValue(value);
  return stringValue ? stringValue : null;
}

function cleanPieceType(value: FormDataEntryValue | null) {
  const stringValue = cleanValue(value);
  return stringValue ? (stringValue as PieceType) : null;
}

async function requireStaffSession() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.userType !== "STAFF") {
    redirect("/login");
  }

  return session;
}

async function getNextQuoteNumber() {
  const year = new Date().getFullYear();

  const count = await prisma.quote.count({
    where: {
      quoteNumber: {
        startsWith: `CWQ${year}`,
      },
    },
  });

  return `CWQ${year}${count + 1}`;
}

export async function createQuote(formData: FormData) {
  const session = await requireStaffSession();

  const customerId = cleanValue(formData.get("customerId"));
  const serviceType = cleanValue(formData.get("serviceType")) as
    | ServiceType
    | null;

  if (!customerId || !serviceType) {
    throw new Error("Customer and service type are required.");
  }

  const sellRate = cleanDecimal(formData.get("sellRate"));
  const buyRate = cleanDecimal(formData.get("buyRate"));
  const margin =
    sellRate && buyRate ? String(Number(sellRate) - Number(buyRate)) : null;

  const quoteNumber = await getNextQuoteNumber();

  const quote = await prisma.quote.create({
    data: {
      quoteNumber,
      customerId,
      serviceType,
      status: "QUOTED",
      requestedById: cleanValue(formData.get("requestedById")),
      assignedToId: cleanValue(formData.get("assignedToId")),
      createdById: session.user.id,

      originName: cleanValue(formData.get("originName")),
      originAddress: cleanValue(formData.get("originAddress")),
      originAddress2: cleanValue(formData.get("originAddress2")),
      originCity: cleanValue(formData.get("originCity")),
      originState: cleanValue(formData.get("originState")),
      originZip: cleanValue(formData.get("originZip")),
      originCountry: cleanValue(formData.get("originCountry")) || "US",

      destinationName: cleanValue(formData.get("destinationName")),
      destinationAddress: cleanValue(formData.get("destinationAddress")),
      destinationAddress2: cleanValue(formData.get("destinationAddress2")),
      destinationCity: cleanValue(formData.get("destinationCity")),
      destinationState: cleanValue(formData.get("destinationState")),
      destinationZip: cleanValue(formData.get("destinationZip")),
      destinationCountry:
        cleanValue(formData.get("destinationCountry")) || "US",

      pieces: cleanValue(formData.get("pieces"))
        ? Number(cleanValue(formData.get("pieces")))
        : null,
      pieceType: cleanPieceType(formData.get("pieceType")),
      pallets: cleanValue(formData.get("pallets"))
        ? Number(cleanValue(formData.get("pallets")))
        : null,
      weightLbs: cleanDecimal(formData.get("weightLbs")),
      lengthIn: cleanDecimal(formData.get("lengthIn")),
      widthIn: cleanDecimal(formData.get("widthIn")),
      heightIn: cleanDecimal(formData.get("heightIn")),
      freightClass: cleanValue(formData.get("freightClass")),
      nmfc: cleanValue(formData.get("nmfc")),
      miles: cleanValue(formData.get("miles"))
        ? Number(cleanValue(formData.get("miles")))
        : null,
      description: cleanValue(formData.get("description")),

      sellRate,
      buyRate,
      margin,
      notes: cleanValue(formData.get("notes")),

      activityLogs: {
        create: {
          action: "CREATED",
          message: `${session.user.name} created quote ${quoteNumber}.`,
          userId: session.user.id,
          customerId,
        },
      },
    },
  });

  redirect(`/dashboard/quotes/${quote.id}`);
}

export async function updateQuote(quoteId: string, formData: FormData) {
  const session = await requireStaffSession();

  const customerId = cleanValue(formData.get("customerId"));
  const serviceType = cleanValue(formData.get("serviceType")) as
    | ServiceType
    | null;

  if (!customerId || !serviceType) {
    throw new Error("Customer and service type are required.");
  }

  const sellRate = cleanDecimal(formData.get("sellRate"));
  const buyRate = cleanDecimal(formData.get("buyRate"));
  const margin =
    sellRate && buyRate ? String(Number(sellRate) - Number(buyRate)) : null;

  const quote = await prisma.quote.update({
    where: {
      id: quoteId,
    },
    data: {
      customerId,
      serviceType,
      requestedById: cleanValue(formData.get("requestedById")),
      assignedToId: cleanValue(formData.get("assignedToId")),

      originName: cleanValue(formData.get("originName")),
      originAddress: cleanValue(formData.get("originAddress")),
      originAddress2: cleanValue(formData.get("originAddress2")),
      originCity: cleanValue(formData.get("originCity")),
      originState: cleanValue(formData.get("originState")),
      originZip: cleanValue(formData.get("originZip")),
      originCountry: cleanValue(formData.get("originCountry")) || "US",

      destinationName: cleanValue(formData.get("destinationName")),
      destinationAddress: cleanValue(formData.get("destinationAddress")),
      destinationAddress2: cleanValue(formData.get("destinationAddress2")),
      destinationCity: cleanValue(formData.get("destinationCity")),
      destinationState: cleanValue(formData.get("destinationState")),
      destinationZip: cleanValue(formData.get("destinationZip")),
      destinationCountry:
        cleanValue(formData.get("destinationCountry")) || "US",

      pieces: cleanValue(formData.get("pieces"))
        ? Number(cleanValue(formData.get("pieces")))
        : null,
      pieceType: cleanPieceType(formData.get("pieceType")),
      pallets: cleanValue(formData.get("pallets"))
        ? Number(cleanValue(formData.get("pallets")))
        : null,
      weightLbs: cleanDecimal(formData.get("weightLbs")),
      lengthIn: cleanDecimal(formData.get("lengthIn")),
      widthIn: cleanDecimal(formData.get("widthIn")),
      heightIn: cleanDecimal(formData.get("heightIn")),
      freightClass: cleanValue(formData.get("freightClass")),
      nmfc: cleanValue(formData.get("nmfc")),
      miles: cleanValue(formData.get("miles"))
        ? Number(cleanValue(formData.get("miles")))
        : null,
      description: cleanValue(formData.get("description")),

      sellRate,
      buyRate,
      margin,
      notes: cleanValue(formData.get("notes")),

      activityLogs: {
        create: {
          action: "UPDATED",
          message: `${session.user.name} updated quote.`,
          userId: session.user.id,
          customerId,
        },
      },
    },
  });

  redirect(`/dashboard/quotes/${quote.id}`);
}

export async function convertQuoteToShipment(quoteId: string) {
  const session = await requireStaffSession();

  const quote = await prisma.quote.findUnique({
    where: {
      id: quoteId,
    },
    include: {
      shipment: true,
      customer: true,
    },
  });

  if (!quote) {
    throw new Error("Quote not found.");
  }

  if (quote.shipment) {
    redirect(`/dashboard/shipments/${quote.shipment.id}`);
  }

  const shipment = await prisma.$transaction(async (tx) => {
    const createdShipment = await tx.shipment.create({
      data: {
        shipmentNumber: quote.quoteNumber,
        serviceType: quote.serviceType,
        status: "BOOKED",
        bolNumber: quote.quoteNumber,

        customerId: quote.customerId,
        quoteId: quote.id,
        createdById: session.user.id,
        assignedToId: quote.assignedToId,

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
        pieceType: quote.pieceType,
        pallets: quote.pallets,
        weightLbs: quote.weightLbs,
        freightClass: quote.freightClass,
        nmfc: quote.nmfc,
        miles: quote.miles,
        description: quote.description,

        sellRate: quote.sellRate,
        buyRate: quote.buyRate,
        margin: quote.margin,

        notes: quote.notes,
      },
    });

    await tx.quote.update({
      where: {
        id: quote.id,
      },
      data: {
        status: "CONVERTED",
      },
    });

    await tx.activityLog.createMany({
      data: [
        {
          action: "UPDATED",
          message: `${session.user.name} converted quote ${quote.quoteNumber} to shipment.`,
          userId: session.user.id,
          quoteId: quote.id,
          customerId: quote.customerId,
        },
        {
          action: "CREATED",
          message: `${session.user.name} created shipment ${quote.quoteNumber} from quote ${quote.quoteNumber}.`,
          userId: session.user.id,
          shipmentId: createdShipment.id,
          customerId: quote.customerId,
        },
      ],
    });

    return createdShipment;
  });

  redirect(`/dashboard/shipments/${shipment.id}`);
}

export async function updateQuoteStatus(quoteId: string, formData: FormData) {
  const session = await requireStaffSession();

  const status = cleanValue(formData.get("status"));
  const cancellationReason = cleanValue(formData.get("cancellationReason"));

  if (!status) {
    throw new Error("Status is required.");
  }

  const quote = await prisma.quote.findUnique({
    where: { id: quoteId },
    include: {
      shipment: true,
    },
  });

  if (!quote) {
    throw new Error("Quote not found.");
  }

  if (status === "CANCELLED" && !cancellationReason) {
    throw new Error("Cancellation reason is required.");
  }

  if (status === "CONVERTED") {
    if (quote.shipment) {
      redirect(`/dashboard/shipments/${quote.shipment.id}`);
    }

    const shipment = await prisma.$transaction(async (tx) => {
      const createdShipment = await tx.shipment.create({
        data: {
          shipmentNumber: quote.quoteNumber,
          serviceType: quote.serviceType,
          status: "BOOKED",
          bolNumber: quote.quoteNumber,

          customerId: quote.customerId,
          quoteId: quote.id,
          createdById: session.user.id,
          assignedToId: quote.assignedToId,

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
          pieceType: quote.pieceType,
          pallets: quote.pallets,
          weightLbs: quote.weightLbs,
          freightClass: quote.freightClass,
          nmfc: quote.nmfc,
          miles: quote.miles,
          description: quote.description,

          sellRate: quote.sellRate,
          buyRate: quote.buyRate,
          margin: quote.margin,

          notes: quote.notes,
        },
      });

      await tx.quote.update({
        where: { id: quote.id },
        data: {
          status: "CONVERTED",
        },
      });

      await tx.activityLog.createMany({
        data: [
          {
            action: "STATUS_CHANGED",
            message: `${session.user.name} converted quote ${quote.quoteNumber}.`,
            userId: session.user.id,
            quoteId: quote.id,
            customerId: quote.customerId,
          },
          {
            action: "CREATED",
            message: `${session.user.name} created shipment ${quote.quoteNumber} from quote ${quote.quoteNumber}.`,
            userId: session.user.id,
            shipmentId: createdShipment.id,
            customerId: quote.customerId,
          },
        ],
      });

      return createdShipment;
    });

    redirect(`/dashboard/shipments/${shipment.id}`);
  }

  await prisma.quote.update({
    where: { id: quote.id },
    data: {
      status: status as "QUOTED" | "CANCELLED",
      cancellationReason: status === "CANCELLED" ? cancellationReason : null,
      activityLogs: {
        create: {
          action: "STATUS_CHANGED",
          message:
            status === "CANCELLED"
              ? `${session.user.name} cancelled quote ${quote.quoteNumber}. Reason: ${cancellationReason}`
              : `${session.user.name} changed quote ${quote.quoteNumber} status to ${status}.`,
          userId: session.user.id,
          customerId: quote.customerId,
        },
      },
    },
  });

  redirect(`/dashboard/quotes/${quote.id}`);
}