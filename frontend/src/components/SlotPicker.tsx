"use client";

import dayjs, { Dayjs } from "dayjs";
import { TextField, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Facility } from "@/types";

export type Slot = { date: Dayjs; start: string; duration: number };

export default function SlotPicker({
  facility,
  slot,
  onChange,
}: {
  facility: Facility;
  slot: Slot;
  onChange: (slot: Slot) => void;
}) {
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
