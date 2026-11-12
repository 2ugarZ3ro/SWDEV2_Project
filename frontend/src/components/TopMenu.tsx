import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import LogoutButton from "./LogoutButton";

export default async function TopMenu() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-medium">
          <Link href="/" className="text-xl font-bold text-teal-800">
            SportBook
          </Link>
          <Link href="/facilities">Facilities</Link>
          {user?.role === "member" && <Link href="/bookings">My Bookings</Link>}
          {user?.role === "admin" && (
            <>
              <Link href="/bookings">All Bookings</Link>
              <Link href="/admin/facilities">Manage Facilities</Link>
              <Link href="/admin/dashboard">Dashboard</Link>
            </>
          )}
        </div>
        <div className="flex items-center gap-4 text-sm">
          {user ? (
            <>
              <span>Hi, {user.name}</span>
              <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 text-xs font-medium capitalize">
                {user.role}
              </span>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-1.5 border border-gray-300 rounded-md"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-1.5 bg-teal-700 text-white rounded-md"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
