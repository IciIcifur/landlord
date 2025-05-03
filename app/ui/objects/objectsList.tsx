"use client"

import { Card, CardBody } from "@heroui/card"
import { Button } from "@heroui/button"
import Link from "next/link"

interface ObjectProps {
  id: string
  name: string
  price: number
}

export default function ObjectsList({ objects }: { objects: ObjectProps[] }) {
  return (
    <div className="w-full flex flex-col gap-4 max-w-2xl mx-auto">
      {objects.map((object) => (
        <Card key={object.id} className="w-full">
          <CardBody className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">{object.name}</h3>
                <p className="text-default-500">ID: {object.id}</p>
                <p className="text-primary font-medium mt-1">{object.price} ₽</p>
              </div>
              <Button as={Link} href={`/${object.id}`} color="primary" size="sm" variant="flat">
                Подробнее
              </Button>
            </div>
          </CardBody>
        </Card>
      ))}

      {objects.length === 0 && (
        <Card className="w-full">
          <CardBody className="p-6 text-center">
            <p className="text-default-500">Строительные проекты не найдены.</p>
          </CardBody>
        </Card>
      )}
    </div>
  )
}
