import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { requireUser } from "@/app/lib/utils/auth"
import { getRecordsByObjectId } from "@/app/lib/services/record-service"
import { getObjectById } from "@/app/lib/services/object-service"
import { errorResponse } from "@/app/lib/utils/response"

export async function GET(req: NextRequest, context: any) {
  const user = await requireUser(req)
  if (user instanceof NextResponse) return user

  const { id: userId, role } = user as {
    id: string
    email: string
    role: string
  }

  const params = await context.params
  const objectId = params.id

  const url = new URL(req.url)
  const returnBlob = url.searchParams.get("returnBlob") === "true"

  try {
    const object = await getObjectById(objectId, userId, role)
    if (!object) {
      return errorResponse("Объект не найден", 404)
    }

    const records = await getRecordsByObjectId(objectId)

    const csvContent = generateExcelCSV(records, object.name)

    if (returnBlob) {
      const base64Data = Buffer.from(csvContent, "utf-8").toString("base64")
      return NextResponse.json({
        filename: `${object.name}_records.csv`,
        data: base64Data,
        mimeType: "text/csv",
      })
    } else {
      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="${object.name}_records.csv"`,
          "Cache-Control": "no-cache",
        },
      })
    }
  } catch (error: any) {
    return errorResponse(error.message || "Ошибка при экспорте данных", 500)
  }
}

function generateExcelCSV(records: any[], objectName: string): string {
  const headers = [
    "Месяц",
    "Аренда",
    "Тепло",
    "Эксплуатация",
    "МОП",
    "Капремонт",
    "ТБО",
    "Электричество",
    "Аренда земли",
    "Прочие расходы",
    "Прочие доходы",
    "Охрана",
    "Итого расходы",
    "Итого доходы",
    "Итого прибыль",
  ]

  const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate)
    return date.toLocaleDateString("ru-RU", {
      month: "long",
      year: "numeric",
    })
  }

  const calculateTotals = (record: any) => {
    const totalExpenses =
      (record.heat || 0) +
      (record.exploitation || 0) +
      (record.mop || 0) +
      (record.renovation || 0) +
      (record.tbo || 0) +
      (record.electricity || 0) +
      (record.earthRent || 0) +
      (record.otherExpenses || 0) +
      (record.security || 0)

    const totalIncomes = (record.rent || 0) + (record.otherIncomes || 0)
    const totalProfit = totalIncomes - totalExpenses

    return { totalExpenses, totalIncomes, totalProfit }
  }

  const rows = records.map((record) => {
    const totals = calculateTotals(record)

    return [
      formatDate(record.date),
      record.rent || 0,
      record.heat || 0,
      record.exploitation || 0,
      record.mop || 0,
      record.renovation || 0,
      record.tbo || 0,
      record.electricity || 0,
      record.earthRent || 0,
      record.otherExpenses || 0,
      record.otherIncomes || 0,
      record.security || 0,
      totals.totalExpenses,
      totals.totalIncomes,
      totals.totalProfit,
    ]
  })

  const BOM = "\uFEFF"

  let csvContent = BOM
  csvContent += `Отчет по объекту: ${objectName}\n`
  csvContent += `Дата создания: ${new Date().toLocaleDateString("ru-RU")}\n\n`

  csvContent += headers.join(";") + "\n"

  rows.forEach((row) => {
    csvContent += row.join(";") + "\n"
  })

  if (rows.length > 0) {
    const totalRow = calculateSummaryRow(records)
    csvContent += "\n"
    csvContent += "ИТОГО;" + totalRow.join(";") + "\n"
  }

  return csvContent
}

function calculateSummaryRow(records: any[]): (string | number)[] {
  const totals = records.reduce(
    (acc, record) => {
      acc.rent += record.rent || 0
      acc.heat += record.heat || 0
      acc.exploitation += record.exploitation || 0
      acc.mop += record.mop || 0
      acc.renovation += record.renovation || 0
      acc.tbo += record.tbo || 0
      acc.electricity += record.electricity || 0
      acc.earthRent += record.earthRent || 0
      acc.otherExpenses += record.otherExpenses || 0
      acc.otherIncomes += record.otherIncomes || 0
      acc.security += record.security || 0
      return acc
    },
    {
      rent: 0,
      heat: 0,
      exploitation: 0,
      mop: 0,
      renovation: 0,
      tbo: 0,
      electricity: 0,
      earthRent: 0,
      otherExpenses: 0,
      otherIncomes: 0,
      security: 0,
    },
  )

  const totalExpenses =
    totals.heat +
    totals.exploitation +
    totals.mop +
    totals.renovation +
    totals.tbo +
    totals.electricity +
    totals.earthRent +
    totals.otherExpenses +
    totals.security

  const totalIncomes = totals.rent + totals.otherIncomes
  const totalProfit = totalIncomes - totalExpenses

  return [
    totals.rent,
    totals.heat,
    totals.exploitation,
    totals.mop,
    totals.renovation,
    totals.tbo,
    totals.electricity,
    totals.earthRent,
    totals.otherExpenses,
    totals.otherIncomes,
    totals.security,
    totalExpenses,
    totalIncomes,
    totalProfit,
  ]
}
