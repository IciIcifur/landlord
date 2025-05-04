import { cookies } from "next/headers"
import GetUserRole from "@/app/lib/utils/getUserRole"
import ObjectDetail from "@/app/ui/objects/objectDetail"

interface ObjectPageProps {
  object_id: string
}

async function getObject(userId?: string, objectId?: string) {
  const objects = [
    { id: "1", name: "Проект 1", price: 5000 },
    { id: "2", name: "Проект 2", price: 7500 },
    { id: "3", name: "Проект 3", price: 3200 },
    { id: "4", name: "Проект 4", price: 9800 },
    { id: "5", name: "Проект 5", price: 6400 },
  ]

  return objects.find((obj) => obj.id === objectId) || null
}

export default async function ObjectPage({
  params,
}: {
  params: ObjectPageProps
}) {
  await GetUserRole()

  const cookieStore = await cookies()
  const userId = cookieStore.get("userId")?.value

  const resolvedParams = await Promise.resolve(params)
  const object = await getObject(userId, resolvedParams.object_id)

  return <ObjectDetail object={object} />
}
