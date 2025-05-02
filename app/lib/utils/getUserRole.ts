import { UserRole } from "@/app/lib/utils/definitions";
import { cookies } from "next/headers";
import "server-only";

export default async function GetUserRole(): Promise<UserRole | undefined> {
  const role = (await cookies()).get("userRole" as any)?.value;
  switch (role) {
    case "admin":
      return UserRole.ADMIN;
    case "client":
      return UserRole.CLIENT;
    default:
      return undefined;
  }
}
