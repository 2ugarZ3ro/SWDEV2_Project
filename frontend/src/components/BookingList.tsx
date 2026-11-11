"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { api } from "@/libs/api";
import { Booking } from "@/types";
import EditBookingDialog from "./EditBookingDialog";

const hhmm = (minutes: number) =>
  `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
const date = (b: Booking) => dayjs(b.bookingDate.slice(0, 10)).format("D MMM YYYY");

export default function BookingList({
  bookings,
  token,
  isAdmin,
}: {
  bookings: Booking[];
  token: string;
  isAdmin: boolean;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<Booking | null>(null);
  const [deleting, setDeleting] = useState<Booking | null>(null);

  async function remove() {
    await api(`/bookings/${deleting!._id}`, { method: "DELETE", token });
    setDeleting(null);
    router.refresh();
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100 text-gray-500">
            <tr>
              <th className="p-4">Facility</th>
              {isAdmin && <th className="p-4">Member</th>}
              <th className="p-4">Date</th>
              <th className="p-4">Time</th>
              <th className="p-4">Duration</th>
              <th className="p-4">Price</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id} className="border-t border-gray-200">
                <td className="p-4">
                  <p className="font-semibold">{b.facility.name}</p>
                  <p className="text-gray-500">{b.facility.sportType}</p>
                </td>
                {isAdmin && (
                  <td className="p-4">
                    <p className="font-semibold">{b.user.name}</p>
                    <p className="text-gray-500">{b.user.email}</p>
                  </td>
                )}
                <td className="p-4">{date(b)}</td>
                <td className="p-4">
                  {hhmm(b.startMinutes)}–{hhmm(b.endMinutes)}
                </td>
                <td className="p-4">{b.durationHours} h</td>
                <td className="p-4">฿{b.facility.hourlyRate * b.durationHours}</td>
                <td className="p-4">
                  <button
                    onClick={() => setEditing(b)}
                    className="text-teal-700 font-medium mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleting(b)}
                    className="text-red-600 font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <EditBookingDialog
          key={editing._id}
          booking={editing}
          token={token}
          onClose={() => setEditing(null)}
        />
      )}

      <Dialog open={!!deleting} onClose={() => setDeleting(null)}>
        <DialogTitle>Delete this booking?</DialogTitle>
        <DialogContent>
          <p className="text-gray-500 mb-3">This cannot be undone.</p>
          {deleting && (
            <div className="bg-gray-100 rounded p-3 text-sm">
              <p className="font-semibold">{deleting.facility.name}</p>
              <p>
                {date(deleting)} · {hhmm(deleting.startMinutes)}–
                {hhmm(deleting.endMinutes)}
              </p>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleting(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={remove}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
