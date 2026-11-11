"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { api } from "@/libs/api";
import { Booking } from "@/types";
import SlotPicker, { Slot, isPast } from "./SlotPicker";

export default function EditBookingDialog({
  booking,
  token,
  onClose,
}: {
  booking: Booking;
  token: string;
  onClose: () => void;
}) {
  const router = useRouter();
  const [slot, setSlot] = useState<Slot>({
    date: dayjs(booking.bookingDate.slice(0, 10)),
    start: booking.startTime,
    duration: booking.durationHours,
  });
  const [error, setError] = useState("");

  async function save() {
    if (isPast(slot)) return setError("This time has already passed");
    try {
      await api(`/bookings/${booking._id}`, {
        method: "PUT",
        token,
        body: {
          bookingDate: slot.date.format("YYYY-MM-DD"),
          startTime: slot.start,
          durationHours: slot.duration,
        },
      });
      onClose();
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Edit Booking</DialogTitle>
      <DialogContent>
        <div className="bg-gray-100 rounded p-3 mb-4 text-sm">
          <p className="text-gray-500">Facility (read-only)</p>
          <p className="font-semibold">{booking.facility.name}</p>
          <p className="text-gray-500">
            {booking.facility.location} · ฿{booking.facility.hourlyRate} / hour
          </p>
        </div>
        <SlotPicker
          facility={booking.facility}
          slot={slot}
          onChange={setSlot}
          excludeId={booking._id}
        />
        {error && (
          <p className="text-red-600 text-sm bg-red-50 rounded p-3 mt-4">
            {error}
          </p>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={save}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
