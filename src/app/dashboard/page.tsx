import {
  BarChart3,
  Bell,
  Clock3,
  DollarSign,
  FileText,
  ShieldCheck,
  Truck,
} from "lucide-react";

const statCards = [
  {
    label: "Open Quotes",
    value: "0",
    link: "View all quotes →",
    icon: FileText,
  },
  {
    label: "Active Shipments",
    value: "0",
    link: "View all shipments →",
    icon: Truck,
  },
  {
    label: "Revenue",
    value: "$0",
    link: "View report →",
    icon: DollarSign,
  },
  {
    label: "Margin",
    value: "$0",
    link: "View report →",
    icon: BarChart3,
  },
];

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-10">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#1D6A33]">
          Dashboard
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-[#111111]">
          Operations Overview
        </h1>
        <p className="mt-3 text-lg text-[#5F6B66]">
          Monitor quotes, shipments, customers, revenue, margin, and activity.
        </p>
      </div>

      <div className="grid gap-5 xl:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className="rounded-2xl border border-[#D8DCD8] bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-base font-medium text-[#4B5A52]">
                  {card.label}
                </p>

                <div className="rounded-full bg-[#EEF7F1] p-3">
                  <Icon size={22} color="#0F6B31" />
                </div>
              </div>

              <p className="mt-4 text-5xl font-bold text-[#0F6B31]">
                {card.value}
              </p>

              <p className="mt-6 text-base font-semibold text-[#0F6B31]">
                {card.link}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid gap-5 xl:grid-cols-2">
        <div className="rounded-2xl border border-[#D8DCD8] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <Clock3 size={22} color="#0F6B31" />
            <h2 className="text-xl font-bold text-[#111111]">
              Recent Activity
            </h2>
          </div>

          <div className="flex min-h-56 flex-col items-center justify-center text-center">
            <FileText size={52} color="#C1C8C4" />
            <p className="mt-5 text-base font-semibold text-[#111111]">
              No recent activity
            </p>
            <p className="mt-2 max-w-sm text-sm leading-6 text-[#5F6B66]">
              Activity will appear here as you start working in the system.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-[#D8DCD8] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <Bell size={22} color="#0F6B31" />
            <h2 className="text-xl font-bold text-[#111111]">Alerts</h2>
          </div>

          <div className="flex min-h-56 flex-col items-center justify-center text-center">
            <ShieldCheck size={58} color="#C1C8C4" />
            <p className="mt-5 text-base font-semibold text-[#111111]">
              No alerts
            </p>
            <p className="mt-2 max-w-sm text-sm leading-6 text-[#5F6B66]">
              You're all caught up. We'll notify you when something needs
              attention.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}