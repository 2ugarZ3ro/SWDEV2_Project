import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { api } from "@/libs/api";
import { Facility } from "@/types";
import BookingForm from "@/components/BookingForm";
import SportImage from "@/components/SportImage";

export default async function FacilityPage({
  params,
}: PageProps<"/facilities/[id]">) {
  const { id } = await params;
  const facility = await api<Facility>(`/facilities/${id}`);
  const session = await getServerSession(authOptions);
  const user = session?.user;

  return (
    <div>
      <Link href="/facilities" className="text-sm text-teal-700">
        ← Facilities / {facility.name}
      </Link>
      <div className="grid gap-8 lg:grid-cols-2 mt-4">
        <div className="flex flex-col gap-4">
          <span className="self-start px-3 py-0.5 rounded-full bg-teal-50 text-teal-800 text-xs font-medium">
            {facility.sportType}
          </span>
          <h1 className="text-4xl font-bold">{facility.name}</h1>
          <p className="text-gray-500">{facility.location}</p>
          <div className="relative h-72 rounded-xl overflow-hidden">
            <SportImage
              sport={facility.sportType}
              sizes="(min-width: 1024px) 560px, 100vw"
            />
          </div>
          <div className="bg-white rounded-xl shadow p-5 grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Capacity</p>
              <p className="font-semibold">{facility.capacity} people</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Hourly rate</p>
              <p className="font-semibold">฿{facility.hourlyRate} / hour</p>
            </div>
          </div>
          <p className="text-sm text-teal-800">
            No past dates · 0.5–2 h · Finish before midnight · No overlapping
            facility or member bookings.
          </p>
        </div>

        <div>
          {user?.role === "member" && (
            <BookingForm facility={facility} token={user.token} />
          )}
          {user?.role === "admin" && (
            <div className="bg-white rounded-xl shadow p-6">
              <p className="font-semibold mb-2">
                Admins manage bookings from the Bookings page
              </p>
              <Link href="/bookings" className="text-teal-700 text-sm">
                Go to All Bookings →
              </Link>
            </div>
          )}
          {!user && (
            <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-3">
              <p>Login to reserve this facility and manage your bookings.</p>
              <Link
                href="/login"
                className="text-center py-2 rounded-md bg-teal-700 text-white font-medium"
              >
                Login to book
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
