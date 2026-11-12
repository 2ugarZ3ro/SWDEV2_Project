import { redirect } from "next/navigation";
import dayjs from "dayjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { api } from "@/libs/api";
import { Booking } from "@/types";
import NoAccess from "@/components/NoAccess";

function Bars({
  rows,
}: {
  rows: { label: string; value: number; note?: string }[];
}) {
  const max = Math.max(...rows.map((r) => r.value), 1);
  return (
    <div className="flex flex-col gap-2">
      {rows.map((r) => (
        <div key={r.label} className="flex items-center gap-3 text-sm">
          <span className="w-36 shrink-0 truncate">{r.label}</span>
          <div className="flex-1 bg-gray-100 rounded h-5">
            <div
              className="bg-teal-600 h-5 rounded"
              style={{ width: `${(r.value / max) * 100}%` }}
            />
          </div>
          <span className="w-28 text-right text-gray-500">{r.note}</span>
        </div>
      ))}
    </div>
  );
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (session.user.role !== "admin") return <NoAccess />;

  const bookings = await api<Booking[]>("/bookings", {
    token: session.user.token,
  });
  const price = (b: Booking) => b.facility.hourlyRate * b.durationHours;
  const today = dayjs().format("YYYY-MM-DD");

  const revenue = bookings.reduce((sum, b) => sum + price(b), 0);
  const hours = bookings.reduce((sum, b) => sum + b.durationHours, 0);
  const upcoming = bookings.filter((b) => b.bookingDate.slice(0, 10) >= today);

  const perFacility: Record<string, { count: number; revenue: number }> = {};
  for (const b of bookings) {
    const f = (perFacility[b.facility.name] ??= { count: 0, revenue: 0 });
    f.count++;
    f.revenue += price(b);
  }

  // booked hours falling in each hour of the day
  const perHour = Array.from({ length: 16 }, (_, i) => {
    const from = (i + 6) * 60;
    const booked = bookings.reduce(
      (sum, b) =>
        sum +
        Math.max(0, Math.min(b.endMinutes, from + 60) - Math.max(b.startMinutes, from)),
      0
    );
    return { label: `${String(i + 6).padStart(2, "0")}:00`, value: booked / 60 };
  });

  const stats = [
    ["Total bookings", bookings.length],
    ["Upcoming", upcoming.length],
    ["Hours booked", hours],
    ["Revenue", `฿${revenue}`],
  ];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {stats.map(([label, value]) => (
          <div key={label} className="bg-white rounded-xl shadow p-5">
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-3xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-bold mb-4">Bookings by facility</h2>
          <Bars
            rows={Object.entries(perFacility)
              .sort((a, b) => b[1].count - a[1].count)
              .map(([name, f]) => ({
                label: name,
                value: f.count,
                note: `${f.count} · ฿${f.revenue}`,
              }))}
          />
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-bold mb-4">Peak hours</h2>
          <Bars
            rows={perHour.map((h) => ({
              ...h,
              note: h.value ? `${h.value} h` : "",
            }))}
          />
        </div>
      </div>
    </div>
  );
}
