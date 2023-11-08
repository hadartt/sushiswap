import {
  SteerVaultsApiSchema,
  getSteerVaultsFromDB,
} from '@sushiswap/client/api'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const result = SteerVaultsApiSchema.safeParse(
    Object.fromEntries(searchParams),
  )

  if (!result.success) {
    return NextResponse.json(result.error.format(), { status: 400 })
  }

  const pools = await getSteerVaultsFromDB(result.data)
  return NextResponse.json(pools)
}
