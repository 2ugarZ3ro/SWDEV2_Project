import Link from "next/link";
import { api } from "@/libs/api";
import { Facility } from "@/types";
import { sports } from "@/sports";
import FacilityCard from "@/components/FacilityCard";

export default async function FacilitiesPage({
  searchParams,
}: PageProps<"/facilities">) {
  const { sport } = await searchParams;
  const all = await api<Facility[]>("/facilities");
  const facilities = sport ? all.filter((f) => f.sportType === sport) : all;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Facilities</h1>
      <div className="flex flex-wrap gap-2 mb-6">
        {["All", ...sports].map((s) => {
          const active = (sport ?? "All") === s;
          return (
            <Link
              key={s}
              href={s === "All" ? "/facilities" : `/facilities?sport=${s}`}
              className={`px-4 py-1.5 rounded-full border text-sm ${
                active
                  ? "bg-teal-700 text-white border-teal-700"
                  : "bg-white border-gray-300"
              }`}
            >
              {s}
            </Link>
          );
        })}
      </div>
      {facilities.length === 0 ? (
        <p className="text-gray-500">No facilities</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {facilities.map((f) => (
            <FacilityCard key={f._id} facility={f} />
          ))}
        </div>
      )}
    </div>
  );
}
