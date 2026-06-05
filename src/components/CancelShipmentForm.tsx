"use client";

import { useState } from "react";

export default function CancelShipmentForm({
  action,
}: {
  action: (formData: FormData) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        style={{ backgroundColor: "#dc2626", color: "white" }}
        className="rounded-xl px-5 py-3 text-sm font-bold shadow-sm transition hover:opacity-90"
      >
        Cancel Shipment
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 backdrop-blur-sm">
          <form
            action={action}
            className="w-full max-w-lg rounded-2xl border border-red-200 bg-white p-6 shadow-2xl"
          >
            <h2 className="text-xl font-bold text-red-700">
              Cancel Shipment
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#5F6B66]">
              Please enter the reason this shipment is being cancelled.
            </p>

            <textarea
              name="cancellationReason"
              required
              rows={4}
              className="mt-4 w-full rounded-xl border border-red-200 bg-white px-4 py-3 text-sm outline-none focus:border-red-500"
              placeholder="Enter cancellation reason..."
            />

            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-xl border border-[#D8DCD8] bg-white px-5 py-3 text-sm font-bold text-[#111111]"
              >
                Keep Shipment
              </button>

              <button
                type="submit"
                style={{ backgroundColor: "#dc2626", color: "white" }}
                className="rounded-xl px-5 py-3 text-sm font-bold shadow-sm transition hover:opacity-90"
              >
                Confirm Cancel
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </>
  );
}