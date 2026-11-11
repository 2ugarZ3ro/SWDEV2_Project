import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { api } from "@/libs/api";
import { Booking } from "@/types";
import BookingList from "@/components/BookingList";

export default async function BookingsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const { role, token } = session.user;
  const bookings = await api<Booking[]>("/bookings", { token });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">
          {role === "admin" ? "All Bookings" : "My Bookings"}
        </h1>
        {role === "member" && (
          <Link
            href="/facilities"
            className="px-4 py-2 rounded-md bg-teal-700 text-white font-medium"
          >
            Browse Facilities →
          </Link>
        )}
      </div>
      {bookings.length === 0 ? (
        <p className="text-gray-500">No bookings yet</p>
      ) : (
        <BookingList bookings={bookings} token={token} isAdmin={role === "admin"} />
      )}
    </div>
  );
}
