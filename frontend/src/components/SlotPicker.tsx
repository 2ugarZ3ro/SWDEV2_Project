"use client";

import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { TextField, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { api } from "@/libs/api";
import { BusySlot, Facility } from "@/types";
import AvailabilityTimeline from "./AvailabilityTimeline";

export type Slot = { date: Dayjs; start: string; duration: number };

const minutes = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};
const nowMinutes = () => dayjs().hour() * 60 + dayjs().minute();

export const isPast = (slot: Slot) =>
  slot.date.isSame(dayjs(), "day") && minutes(slot.start) < nowMinutes();

// next half hour today, or 09:00 tomorrow once the day is nearly over
export function defaultSlot(): Slot {
  const next = Math.max(Math.ceil(nowMinutes() / 30) * 30, 6 * 60);
  if (next >= 21 * 60 + 30) {
    return { date: dayjs().add(1, "day"), start: "09:00", duration: 1 };
  }
  const start = `${String(Math.floor(next / 60)).padStart(2, "0")}:${next % 60 ? "30" : "00"}`;
  return { date: dayjs(), start, duration: 1 };
}

export default function SlotPicker({
  facility,
  slot,
  onChange,
  excludeId = "",
}: {
  facility: Facility;
  slot: Slot;
  onChange: (slot: Slot) => void;
  excludeId?: string;
}) {
  const [busy, setBusy] = useState<BusySlot[]>([]);
  const day = slot.date.format("YYYY-MM-DD");

  useEffect(() => {
    api<BusySlot[]>(
      `/facilities/${facility._id}/availability?date=${day}&exclude=${excludeId}`
    ).then(setBusy);
  }, [facility._id, day, excludeId]);

  // today's hours that are already gone show as unavailable
  const passed: BusySlot[] =
    slot.date.isSame(dayjs(), "day") && nowMinutes() > 6 * 60
      ? [{ startTime: "", endTime: "", startMinutes: 6 * 60, endMinutes: nowMinutes() }]
      : [];

  const end = dayjs(`2000-01-01 ${slot.start}`)
    .add(slot.duration * 60, "minute")
    .format("HH:mm");

  return (
    <div className="flex flex-col gap-4">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Date"
          value={slot.date}
          minDate={dayjs()}
          onChange={(date) => date && onChange({ ...slot, date })}
        />
      </LocalizationProvider>

      <div>
        <p className="text-sm font-medium mb-1">Availability</p>
        <AvailabilityTimeline
          busy={[...passed, ...busy]}
          start={slot.start}
          duration={slot.duration}
          onPick={(start) => onChange({ ...slot, start })}
        />
        <p className="text-xs text-gray-500 mt-1">
          Select a free slot to set your start time
        </p>
      </div>

      <TextField
        label="Start time"
        type="time"
        value={slot.start}
        onChange={(e) => onChange({ ...slot, start: e.target.value })}
        slotProps={{ inputLabel: { shrink: true } }}
      />

      <div>
        <p className="text-sm mb-1">Duration</p>
        <ToggleButtonGroup
          exclusive
          fullWidth
          color="primary"
          value={slot.duration}
          onChange={(_, duration) => duration && onChange({ ...slot, duration })}
        >
          {[0.5, 1, 1.5, 2].map((h) => (
            <ToggleButton key={h} value={h}>
              {h} h
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </div>

      <div className="flex items-center justify-between border-t border-gray-200 pt-4">
        <div className="text-sm text-gray-500">
          <p className="font-medium text-gray-900">
            {slot.start}–{end}
          </p>
          <p>
            {slot.duration} h × ฿{facility.hourlyRate} / hour
          </p>
        </div>
        <p className="text-2xl font-bold">
          Total ฿{facility.hourlyRate * slot.duration}
        </p>
      </div>
    </div>
  );
}
