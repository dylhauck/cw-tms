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
    <form action={action} className="rounded-2xl border border-[#D8DCD8] bg-white p-5 shadow-sm">
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
        <option value="ACCEPTED">Accepted - Convert to Shipment</option>
        <option value="CANCELLED">Cancelled</option>
      </select>

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