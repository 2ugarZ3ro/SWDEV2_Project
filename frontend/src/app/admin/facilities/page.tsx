import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { api } from "@/libs/api";
import { Facility } from "@/types";
import FacilityManager from "@/components/FacilityManager";
import NoAccess from "@/components/NoAccess";

export default async function ManageFacilitiesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (session.user.role !== "admin") return <NoAccess />;

  const facilities = await api<Facility[]>("/facilities");
  return <FacilityManager facilities={facilities} token={session.user.token} />;
}
