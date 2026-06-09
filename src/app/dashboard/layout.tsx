import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import {
  BadgeDollarSign,
  BarChart3,
  Building2,
  FileText,
  FolderOpen,
  LayoutDashboard,
  Settings,
  Truck,
} from "lucide-react";

import { authOptions } from "@/lib/auth";
import LogoutButton from "@/components/LogoutButton";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Customers", href: "/dashboard/customers", icon: Building2 },
  { name: "Quotes", href: "/dashboard/quotes", icon: FileText },
  { name: "Shipments", href: "/dashboard/shipments", icon: Truck },
  { name: "Carriers", href: "/dashboard/carriers", icon: BadgeDollarSign },
  { name: "Documents", href: "/dashboard/documents", icon: FolderOpen },
  { name: "Reports", href: "/dashboard/reports", icon: BarChart3 },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#F6F8F6] text-[#111111]">
      <header className="sticky top-0 z-30 border-b border-[#D8DCD8] bg-white shadow-sm">
        <div className="flex h-24 items-center justify-between px-8">
          <div className="flex items-center gap-5">
            <Image
              src="/cw-logo.png"
              alt="CW Worldwide logo"
              width={76}
              height={76}
              className="h-auto w-[76px] object-contain"
              priority
            />

            <div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#111111]">
                CW Worldwide
              </p>
              <p className="mt-1 text-xl font-bold text-[#1D6A33]">TMS</p>
            </div>

            <div className="ml-6 h-12 border-l border-[#D8DCD8]" />

            <div>
  <p className="text-lg font-bold text-[#111111]">
    CW Worldwide Transportation Management System
  </p>
</div>
          </div>

          <div className="flex items-center gap-6">
  <p className="text-sm text-[#5F6B66]">
    Signed in as {session.user.name} ·{" "}
    <span className="font-semibold text-[#1D6A33]">
      {session.user.userType}
    </span>
  </p>

  <LogoutButton />
</div>
        </div>

        <nav className="border-t border-[#D8DCD8] bg-[#0F6B31] px-8">
          <div className="flex h-16 items-center justify-center gap-3 overflow-x-auto px-4">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white transition hover:bg-white/15"
                >
                  <Icon size={18} />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-[1600px] p-8">{children}</main>
    </div>
  );
}