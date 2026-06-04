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
      <div className="fixed left-0 top-0 z-30 flex h-24 w-72 items-center border-b border-r border-[#D8DCD8] bg-white px-6">
        <Image
          src="/cw-logo.png"
          alt="CW Worldwide logo"
          width={76}
          height={76}
          className="h-auto w-[76px] object-contain"
          priority
        />

        <div className="ml-4">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#111111]">
            CW Worldwide
          </p>
          <p className="mt-1 text-xl font-bold text-[#1D6A33]">TMS</p>
        </div>
      </div>

      <aside className="fixed bottom-0 left-0 top-24 z-20 w-72 bg-[#0F6B31] text-white">
        <nav className="space-y-2 px-5 py-7">
          {navigation.map((item, index) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-base font-semibold transition ${
                  index === 0
                    ? "bg-white/15 text-white"
                    : "text-white/95 hover:bg-white/10"
                }`}
              >
                <Icon size={20} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="pl-72">
        <header className="sticky top-0 z-20 flex h-24 items-center justify-between border-b border-[#D8DCD8] bg-white px-8 shadow-sm">
          <div>
            <p className="text-lg font-bold text-[#111111]">
              CW Worldwide Transportation Management System
            </p>
            <p className="mt-1 text-sm text-[#5F6B66]">
              Signed in as {session.user.name} ·{" "}
              <span className="font-semibold text-[#1D6A33]">
                {session.user.userType}
              </span>
            </p>
          </div>

          <LogoutButton />
        </header>

        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}