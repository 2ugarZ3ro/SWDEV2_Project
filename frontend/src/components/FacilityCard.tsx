import Link from "next/link";
import { Facility } from "@/types";
import { sportColors } from "@/sports";

export default function FacilityCard({ facility }: { facility: Facility }) {
  return (
    <div className="bg-white rounded-xl shadow overflow-hidden flex flex-col">
      <div
        className={`h-20 px-5 flex items-center font-semibold text-teal-800 ${sportColors[facility.sportType]}`}
      >
        {facility.sportType}
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
