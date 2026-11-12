import { BusySlot } from "@/types";

const FROM = 6 * 60;
const TO = 22 * 60;
const pct = (minutes: number) => ((minutes - FROM) / (TO - FROM)) * 100;
const toMinutes = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

export default function AvailabilityTimeline({
  busy,
  start,
  duration,
  onPick,
}: {
  busy: BusySlot[];
  start: string;
  duration: number;
  onPick: (start: string) => void;
}) {
  const from = toMinutes(start);
  const to = from + duration * 60;

  function pick(e: React.MouseEvent<HTMLDivElement>) {
    const box = e.currentTarget.getBoundingClientRect();
    const minutes = FROM + ((e.clientX - box.left) / box.width) * (TO - FROM);
    const rounded = Math.floor(minutes / 30) * 30;
    if (busy.some((b) => rounded >= b.startMinutes && rounded < b.endMinutes))
      return;
    const h = String(Math.floor(rounded / 60)).padStart(2, "0");
    onPick(`${h}:${rounded % 60 === 0 ? "00" : "30"}`);
  }

  return (
    <div>
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        {["06:00", "10:00", "14:00", "18:00", "22:00"].map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
      <div
        onClick={pick}
        className="relative h-10 bg-white border border-gray-300 rounded cursor-pointer overflow-hidden"
      >
        {busy.map((b) => (
          <div
            key={b.startMinutes}
            className="absolute inset-y-0 bg-gray-300 cursor-not-allowed"
            style={{
              left: `${pct(b.startMinutes)}%`,
              width: `${pct(b.endMinutes) - pct(b.startMinutes)}%`,
              backgroundImage:
                "repeating-linear-gradient(45deg, #9ca3af 0 1px, transparent 1px 6px)",
            }}
          />
        ))}
        <div
          className="absolute inset-y-0 bg-teal-700/90 rounded text-white text-[10px] flex items-center justify-center overflow-hidden whitespace-nowrap pointer-events-none"
          style={{
            left: `${Math.max(pct(from), 0)}%`,
            width: `${Math.min(pct(to), 100) - Math.max(pct(from), 0)}%`,
          }}
        >
          {duration >= 1 && duration}
        </div>
      </div>
      <div className="flex gap-4 text-xs text-gray-500 mt-1">
        <span>▢ Free</span>
        <span>▨ Booked</span>
        <span className="text-teal-700">■ Selected</span>
      </div>
    </div>
  );
}
