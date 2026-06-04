"use server";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function cleanValue(value: FormDataEntryValue | null) {
  const stringValue = value?.toString().trim();
  return stringValue ? stringValue : null;
}

export async function createCustomer(formData: FormData) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.userType !== "STAFF") {
    redirect("/login");
  }

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