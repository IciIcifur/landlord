import { cookies } from "next/headers";
import GetUserRole from "@/app/lib/utils/getUserRole";

interface ObjectPageProps {
  object_id: string;
}

async function getObject(userId?: string, objectId?: string) {
  // get request for object for this userId
  return objectId;
}

export default async function ObjectPage({
  params,
}: {
  params: Promise<ObjectPageProps>;
}) {
  const userRole = await GetUserRole();
  const userId = (await cookies()).get("userId" as any)?.value;

  const object = await getObject(userId, (await params).object_id);

  return <p>Object {object} properties here</p>;
}
