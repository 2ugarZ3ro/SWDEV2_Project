import Link from "next/link";
import { Facility } from "@/types";
import SportImage from "./SportImage";

export default function FacilityCard({ facility }: { facility: Facility }) {
  return (
    <div className="bg-white rounded-xl shadow overflow-hidden flex flex-col">
      <div className="relative h-44">
        <SportImage
          sport={facility.sportType}
          sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
        />
        <span className="absolute left-3 top-3 px-3 py-0.5 rounded-full bg-white/90 text-teal-800 text-xs font-medium">
          {facility.sportType}
        </span>
      </div>
      <div className="p-5 flex flex-col gap-1 flex-1">
        <h2 className="text-xl font-bold">{facility.name}</h2>
        <p className="text-sm text-gray-500">{facility.location}</p>
        <p className="text-sm text-gray-500">
          Capacity {facility.capacity} people
        </p>
        <div className="mt-auto pt-4 flex items-center justify-between">
          <span className="font-medium">฿{facility.hourlyRate} / hour</span>
          <Link
            href={`/facilities/${facility._id}`}
            className="px-4 py-1.5 border border-gray-300 rounded-md text-sm"
          >
            View →
          </Link>
        </div>
      </div>
    </div>
  );
}
