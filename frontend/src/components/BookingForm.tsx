"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@mui/material";
import { api } from "@/libs/api";
import { Facility } from "@/types";
import SlotPicker, { Slot, defaultSlot, isPast } from "./SlotPicker";

export default function BookingForm({
  facility,
  token,
}: {
  facility: Facility;
  token: string;
}) {
  const router = useRouter();
  const [slot, setSlot] = useState<Slot>();
  const [error, setError] = useState("");

  // set on the client so the date and time follow the user's clock
  useEffect(() => setSlot(defaultSlot()), []);
  if (!slot) return null;

  async function book() {
    if (isPast(slot!)) return setError("This time has already passed");
    try {
      await api("/bookings", {
        method: "POST",
        token,
        body: {
          facility: facility._id,
          bookingDate: slot!.date.format("YYYY-MM-DD"),
          startTime: slot!.start,
          durationHours: slot!.duration,
        },
      });
      router.push("/bookings");
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Book a slot</h2>
      <SlotPicker facility={facility} slot={slot} onChange={setSlot} />
      <Button variant="contained" color="secondary" size="large" onClick={book}>
        Book now
      </Button>
      {error && (
        <p className="text-red-600 text-sm bg-red-50 rounded p-3">{error}</p>
      )}
    </div>
  );
}
