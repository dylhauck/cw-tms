"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

export default function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-2 px-5 py-7">
      {navigation.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-base font-semibold transition ${
              isActive
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
  );
}