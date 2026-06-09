"use client";

import { useState } from "react";

export default function QuoteStatusForm({
  currentStatus,
  action,
}: {
  currentStatus: string;
  action: (formData: FormData) => void;
}) {
  const [status, setStatus] = useState(currentStatus);

  return (
    <form
      action={action}
      className="rounded-2xl border border-[#D8DCD8] bg-white p-5 shadow-sm"
    >
      <label className="block text-sm font-bold text-[#111111]">
        Quote Action
      </label>

      <select
        name="status"
        value={status}
        onChange={(event) => setStatus(event.target.value)}
        className="mt-2 w-full rounded-xl border border-[#D8DCD8] px-4 py-3"
      >
        <option value="QUOTED">Quoted</option>
        <option value="CONVERTED">Convert to Shipment</option>
        <option value="LOST">Lost</option>
        <option value="CANCELLED">Cancelled</option>
      </select>

      {status === "LOST" ? (
        <div className="mt-4">
          <label className="block text-sm font-bold text-[#111111]">
            Rate Lost To
          </label>

          <div className="mt-2 flex overflow-hidden rounded-xl border border-[#D8DCD8] bg-white">
            <span className="flex items-center border-r border-[#D8DCD8] bg-[#F6F8F6] px-4 text-sm font-bold text-[#5F6B66]">
              $
            </span>

            <input
              type="number"
              step="0.01"
              min="0"
              name="lostRate"
              required
              className="w-full px-4 py-3 text-sm outline-none"
              placeholder="Enter competitor rate..."
            />
          </div>
        </div>
      ) : null}

      {status === "CANCELLED" ? (
        <div className="mt-4">
          <label className="block text-sm font-bold text-[#111111]">
            Cancellation Reason
          </label>
          <textarea
            name="cancellationReason"
            required
            rows={3}
            className="mt-2 w-full rounded-xl border border-[#D8DCD8] px-4 py-3"
            placeholder="Enter why the customer did not proceed..."
          />
        </div>
      ) : null}

      <button
        type="submit"
        className="mt-4 w-full rounded-xl bg-[#0F6B31] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#0B5527]"
      >
        Save Quote Action
      </button>
    </form>
  );
}