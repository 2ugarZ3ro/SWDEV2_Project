import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { api } from "@/libs/api";
import { Facility } from "@/types";
import FacilityManager from "@/components/FacilityManager";

export default async function ManageFacilitiesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  if (session.user.role !== "admin") {
    return (
      <div className="text-center mt-16">
        <h1 className="text-2xl font-bold mb-2">You don&apos;t have access</h1>
        <Link href="/" className="text-teal-700">
          Back to home
        </Link>
      </div>
    );
  }

  const facilities = await api<Facility[]>("/facilities");
  return <FacilityManager facilities={facilities} token={session.user.token} />;
}
