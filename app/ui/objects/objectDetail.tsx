"use client"

import { Card, CardHeader, CardBody } from "@heroui/card"
import { Button } from "@heroui/button"
import { InfoIcon } from "lucide-react"
import Link from "next/link"

interface ObjectProps {
  id: string
  name: string
  price: number
}

interface ObjectDetailProps {
  object: ObjectProps | null
}

export default function ObjectDetail({ object }: ObjectDetailProps) {
  if (!object) {
    return (
      <div className="container mx-auto p-6">
        <Card className="p-6 max-w-md mx-auto">
          <div className="flex flex-col items-center justify-center gap-4 py-8">
            <InfoIcon className="size-12 text-default-400" />
            <h2 className="text-xl font-medium">Проект не найден</h2>
            <p className="text-default-500">
              Строительный проект, который вы ищете, не существует или у вас нет к нему доступа.
            </p>
            <Button as={Link} href="/" color="primary">
              Вернуться к проектам
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 max-w-2xl mx-auto">
        <Button as={Link} href="/" color="default" variant="light" className="mb-4">
          ← Назад к проектам
        </Button>
        <h1 className="text-2xl font-medium">{object.name}</h1>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-default-500">ID: {object.id}</span>
        </div>
      </div>

      <Card className="p-6 max-w-2xl mx-auto">
        <CardHeader className="pb-2 pt-0 px-0">
          <h2 className="text-xl font-medium">Детали проекта</h2>
        </CardHeader>
        <CardBody className="px-0 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-default-500">ID проекта</p>
              <p className="font-medium">{object.id}</p>
            </div>
            <div>
              <p className="text-sm text-default-500">Название проекта</p>
              <p className="font-medium">{object.name}</p>
            </div>
            <div>
              <p className="text-sm text-default-500">Стоимость аренды</p>
              <p className="font-medium">{object.price} ₽</p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
