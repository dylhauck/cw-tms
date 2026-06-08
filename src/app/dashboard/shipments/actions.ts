"use server";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

function cleanValue(value: FormDataEntryValue | null) {
  const stringValue = value?.toString().trim();
  return stringValue ? stringValue : null;
}

async function requireStaffSession() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.userType !== "STAFF") {
    redirect("/login");
  }

  return session;
}

export async function cancelShipment(shipmentId: string, formData: FormData) {
  const session = await requireStaffSession();

  const cancellationReason = cleanValue(formData.get("cancellationReason"));

  if (!cancellationReason) {
    throw new Error("Cancellation reason is required.");
  }

  const shipment = await prisma.shipment.findUnique({
    where: {
      id: shipmentId,
    },
    include: {
      quote: true,
    },
  });

  if (!shipment) {
    throw new Error("Shipment not found.");
  }

  await prisma.shipment.update({
    where: {
      id: shipment.id,
    },
    data: {
      status: "CANCELLED",
      activityLogs: {
        create: {
          action: "STATUS_CHANGED",
          message: `${session.user.name} cancelled shipment ${shipment.shipmentNumber}. Reason: ${cancellationReason}`,
          userId: session.user.id,
          customerId: shipment.customerId,
        },
      },
    },
  });

  revalidatePath("/dashboard/shipments");
  revalidatePath(`/dashboard/shipments/${shipment.id}`);
  redirect("/dashboard/shipments?status=cancelled");
}