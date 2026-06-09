"use client";

import Link from "next/link";
import { useState } from "react";

export default function QuoteRowActions({
  quoteId,
  shipmentId,
  status,
  action,
}: {
  quoteId: string;
  shipmentId: string | null;
  status: string;
  action: (formData: FormData) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modal, setModal] = useState<"LOST" | "CANCELLED" | null>(null);

  if (shipmentId) {
    return (
      <Link
        href={`/dashboard/shipments/${shipmentId}`}
        className="inline-flex rounded-xl bg-[#0F6B31] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#0B5527]"
      >
        View Shipment
      </Link>
    );
  }

  if (status === "CANCELLED" || status === "CONVERTED" || status === "LOST") {
    return null;
  }

  return (
    <div className="relative flex flex-col items-end gap-3">
      <Link
        href={`/dashboard/quotes/${quoteId}/edit`}
        className="inline-flex rounded-xl bg-[#0F6B31] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#0B5527]"
      >
        Edit Quote
      </Link>

      <button
        type="button"
        onClick={() => setMenuOpen((current) => !current)}
className="inline-flex w-full justify-center rounded-xl bg-[#0F6B31] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#0B5527]"      >
        Actions
      </button>

      {menuOpen ? (
<div className="absolute right-0 top-[108px] z-20 w-full rounded-xl border border-[#D8DCD8] bg-white p-2 shadow-lg">
            <form action={action}>
            <input type="hidden" name="status" value="CONVERTED" />
            <button className="w-full rounded-lg px-3 py-2 text-center text-sm font-bold hover:bg-[#F6F8F6]">
              Convert to Shipment
            </button>
          </form>

          <button
            type="button"
            onClick={() => {
              setModal("LOST");
              setMenuOpen(false);
            }}
            className="w-full rounded-lg px-3 py-2 text-center text-sm font-bold hover:bg-[#F6F8F6]"
          >
            Mark Lost
          </button>

          <button
            type="button"
            onClick={() => {
              setModal("CANCELLED");
              setMenuOpen(false);
            }}
            className="w-full rounded-lg px-3 py-2 text-center text-sm font-bold text-red-700 hover:bg-red-50"
          >
            Cancel Quote
          </button>
        </div>
      ) : null}

      {modal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <form
            action={action}
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
          >
            <input type="hidden" name="status" value={modal} />

            <h2 className="text-xl font-bold text-[#111111]">
              {modal === "LOST" ? "Mark Quote Lost" : "Cancel Quote"}
            </h2>

            {modal === "LOST" ? (
              <div className="mt-4">
                <label className="block text-sm font-bold text-[#111111]">
                  Rate Lost To
                </label>
                <input
                  name="lostRate"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  className="mt-2 w-full rounded-xl border border-[#D8DCD8] px-4 py-3"
                  placeholder="Enter competitor rate..."
                />
              </div>
            ) : (
              <div className="mt-4">
                <label className="block text-sm font-bold text-[#111111]">
                  Cancellation Reason
                </label>
                <textarea
                  name="cancellationReason"
                  required
                  rows={4}
                  className="mt-2 w-full rounded-xl border border-[#D8DCD8] px-4 py-3"
                  placeholder="Enter cancellation reason..."
                />
              </div>
            )}

            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setModal(null)}
                className="rounded-xl border border-[#D8DCD8] px-5 py-3 text-sm font-bold"
              >
                Keep Quote
              </button>

              <button
                type="submit"
                className="rounded-xl bg-[#0F6B31] px-5 py-3 text-sm font-bold text-white"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}