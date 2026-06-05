"use server";

import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { PieceType } from "@/generated/prisma/client";
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

export async function createCustomer(formData: FormData) {
  const session = await requireStaffSession();

  const name = cleanValue(formData.get("name"));

  if (!name) {
    throw new Error("Customer name is required.");
  }

  const customer = await prisma.customer.create({
    data: {
      name,
      phone: cleanValue(formData.get("phone")),
      email: cleanValue(formData.get("email")),
      website: cleanValue(formData.get("website")),

      physicalAddress: cleanValue(formData.get("physicalAddress")),
      physicalCity: cleanValue(formData.get("physicalCity")),
      physicalState: cleanValue(formData.get("physicalState")),
      physicalZip: cleanValue(formData.get("physicalZip")),
      physicalCountry: cleanValue(formData.get("physicalCountry")) || "US",

      billingName: cleanValue(formData.get("billingName")),
      billingEmail: cleanValue(formData.get("billingEmail")),
      billingAddress: cleanValue(formData.get("billingAddress")),
      billingCity: cleanValue(formData.get("billingCity")),
      billingState: cleanValue(formData.get("billingState")),
      billingZip: cleanValue(formData.get("billingZip")),
      billingCountry: cleanValue(formData.get("billingCountry")) || "US",

      activityLogs: {
        create: {
          action: "CREATED",
          message: `${session.user.name} created customer ${name}.`,
          userId: session.user.id,
        },
      },
    },
  });

  redirect(`/dashboard/customers/${customer.id}`);
}

export async function updateCustomer(customerId: string, formData: FormData) {
  const session = await requireStaffSession();

  const name = cleanValue(formData.get("name"));

  if (!name) {
    throw new Error("Customer name is required.");
  }

  const customer = await prisma.customer.update({
    where: {
      id: customerId,
    },
    data: {
      name,
      phone: cleanValue(formData.get("phone")),
      email: cleanValue(formData.get("email")),
      website: cleanValue(formData.get("website")),

      physicalAddress: cleanValue(formData.get("physicalAddress")),
      physicalCity: cleanValue(formData.get("physicalCity")),
      physicalState: cleanValue(formData.get("physicalState")),
      physicalZip: cleanValue(formData.get("physicalZip")),
      physicalCountry: cleanValue(formData.get("physicalCountry")) || "US",

      billingName: cleanValue(formData.get("billingName")),
      billingEmail: cleanValue(formData.get("billingEmail")),
      billingAddress: cleanValue(formData.get("billingAddress")),
      billingCity: cleanValue(formData.get("billingCity")),
      billingState: cleanValue(formData.get("billingState")),
      billingZip: cleanValue(formData.get("billingZip")),
      billingCountry: cleanValue(formData.get("billingCountry")) || "US",

      activityLogs: {
        create: {
          action: "UPDATED",
          message: `${session.user.name} updated customer ${name}.`,
          userId: session.user.id,
        },
      },
    },
  });

  redirect(`/dashboard/customers/${customer.id}`);
}

export async function createCustomerUser(customerId: string, formData: FormData) {
  const session = await requireStaffSession();

  const firstName = cleanValue(formData.get("firstName"));
  const lastName = cleanValue(formData.get("lastName"));
  const email = cleanValue(formData.get("email"));
  const password = cleanValue(formData.get("password"));

  if (!firstName || !lastName || !email || !password) {
    throw new Error("First name, last name, email, and password are required.");
  }

  const customer = await prisma.customer.findUnique({
    where: {
      id: customerId,
    },
  });

  if (!customer) {
    throw new Error("Customer not found.");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      title: cleanValue(formData.get("title")),
      mobilePhone: cleanValue(formData.get("mobilePhone")),
      officePhone: cleanValue(formData.get("officePhone")),
      email: email.toLowerCase(),
      passwordHash,
      userType: "CUSTOMER",
      customerId,
      isActive: true,
    },
  });

  await prisma.activityLog.create({
    data: {
      action: "CREATED",
      message: `${session.user.name} added customer user ${user.firstName} ${user.lastName} to ${customer.name}.`,
      userId: session.user.id,
      customerId,
    },
  });

  redirect(`/dashboard/customers/${customerId}`);
}

export async function updateCustomerUser(
  customerId: string,
  userId: string,
  formData: FormData
) {
  const session = await requireStaffSession();

  const firstName = cleanValue(formData.get("firstName"));
  const lastName = cleanValue(formData.get("lastName"));
  const email = cleanValue(formData.get("email"));
  const password = cleanValue(formData.get("password"));
  const isActive = formData.get("isActive") === "on";

  if (!firstName || !lastName || !email) {
    throw new Error("First name, last name, and email are required.");
  }

  const customer = await prisma.customer.findUnique({
    where: {
      id: customerId,
    },
  });

  if (!customer) {
    throw new Error("Customer not found.");
  }

  const updateData: {
    firstName: string;
    lastName: string;
    title: string | null;
    mobilePhone: string | null;
    officePhone: string | null;
    email: string;
    isActive: boolean;
    passwordHash?: string;
  } = {
    firstName,
    lastName,
    title: cleanValue(formData.get("title")),
    mobilePhone: cleanValue(formData.get("mobilePhone")),
    officePhone: cleanValue(formData.get("officePhone")),
    email: email.toLowerCase(),
    isActive,
  };

  if (password) {
    updateData.passwordHash = await bcrypt.hash(password, 12);
  }

  const user = await prisma.user.update({
    where: {
      id: userId,
      customerId,
    },
    data: updateData,
  });

  await prisma.activityLog.create({
    data: {
      action: "UPDATED",
      message: `${session.user.name} updated customer user ${user.firstName} ${user.lastName} for ${customer.name}.`,
      userId: session.user.id,
      customerId,
    },
  });

  redirect(`/dashboard/customers/${customerId}`);
}

export async function createCustomerLocation(
  customerId: string,
  formData: FormData
) {
  const session = await requireStaffSession();

  const address = cleanValue(formData.get("address"));
  const city = cleanValue(formData.get("city"));
  const state = cleanValue(formData.get("state"));
  const zip = cleanValue(formData.get("zip"));

  if (!address || !city || !state || !zip) {
    throw new Error("Address, city, state, and ZIP are required.");
  }

  const customer = await prisma.customer.findUnique({
    where: {
      id: customerId,
    },
  });

  if (!customer) {
    throw new Error("Customer not found.");
  }

  const location = await prisma.customerLocation.create({
    data: {
      customerId,
      nickname: cleanValue(formData.get("nickname")),
      companyName: cleanValue(formData.get("companyName")),
      address,
      city,
      state,
      zip,
      country: cleanValue(formData.get("country")) || "US",
      contactName: cleanValue(formData.get("contactName")),
      contactPhone: cleanValue(formData.get("contactPhone")),
      contactEmail: cleanValue(formData.get("contactEmail")),
    },
  });

  await prisma.activityLog.create({
    data: {
      action: "CREATED",
      message: `${session.user.name} added saved location ${
        location.nickname || location.companyName || location.address
      } to ${customer.name}.`,
      userId: session.user.id,
      customerId,
    },
  });

  redirect(`/dashboard/customers/${customerId}`);
}

export async function createCustomerCommodity(
  customerId: string,
  formData: FormData
) {
  const session = await requireStaffSession();

  const name = cleanValue(formData.get("name"));

  if (!name) {
    throw new Error("Commodity name is required.");
  }

  const customer = await prisma.customer.findUnique({
    where: {
      id: customerId,
    },
  });

  if (!customer) {
    throw new Error("Customer not found.");
  }

  const commodity = await prisma.commodity.create({
    data: {
      customerId,
      name,
      description: cleanValue(formData.get("description")),
      freightClass: cleanValue(formData.get("freightClass")),
      nmfc: cleanValue(formData.get("nmfc")),
      pieceType: cleanValue(formData.get("pieceType")) as any,
      weightLbs: cleanValue(formData.get("weightLbs")),
      lengthIn: cleanValue(formData.get("lengthIn")),
      widthIn: cleanValue(formData.get("widthIn")),
      heightIn: cleanValue(formData.get("heightIn")),
    },
  });

  await prisma.activityLog.create({
    data: {
      action: "CREATED",
      message: `${session.user.name} added saved commodity ${commodity.name} to ${customer.name}.`,
      userId: session.user.id,
      customerId,
    },
  });

  redirect(`/dashboard/customers/${customerId}`);
}