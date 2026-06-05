"use client";

import { useState } from "react";

export default function CancelShipmentForm({
  action,
}: {
  action: (formData: FormData) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-red-700"
      >
        Cancel Shipment
      </button>
    );
  }

  return (
    <form
      action={action}
      className="rounded-2xl border border-red-200 bg-red-50 p-5 shadow-sm"
    >
      <h2 className="text-lg font-bold text-red-900">Cancel Shipment</h2>

      <p className="mt-2 text-sm leading-6 text-red-800">
        Please enter the reason this shipment is being cancelled.
      </p>

      <textarea
        name="cancellationReason"
        required
        rows={4}
        className="mt-4 w-full rounded-xl border border-red-200 bg-white px-4 py-3 text-sm outline-none focus:border-red-500"
        placeholder="Enter cancellation reason..."
      />

      <div className="mt-4 flex justify-end gap-3">
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="rounded-xl border border-red-200 bg-white px-5 py-3 text-sm font-bold text-red-700"
        >
          Keep Shipment
        </button>

        <button
          type="submit"
          className="rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-red-700"
        >
          Confirm Cancel
        </button>
      </div>
    </form>
  );
}