import { type Prisma, createClient } from '@sushiswap/database'
import { type PoolCountApiSchema } from '../../pure/pools/count/schema'
import { parsePoolArgs } from './parse'

export async function getPoolCountFromDB(
  args: typeof PoolCountApiSchema._output,
) {
  const where: Prisma.PoolWhereInput = parsePoolArgs(args)

  const client = await createClient()
  const count = await client.pool.count({
    where,
  })

  await client.$disconnect()
  return { count }
}
