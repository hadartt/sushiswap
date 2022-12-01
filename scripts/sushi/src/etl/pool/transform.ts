import { Prisma, PrismaClient } from '@prisma/client'

/**
 * Filters pools to only include the ones that are new or have changed.
 * @param client
 * @param pools
 * @returns
 */
export async function filterPools(
  client: PrismaClient,
  pools: Prisma.PoolCreateManyInput[]
): Promise<Prisma.PoolCreateManyInput[]> {
  const poolSelect = Prisma.validator<Prisma.PoolSelect>()({
    id: true,
    address: true,
    reserve0: true,
    reserve1: true,
    totalSupply: true,
    liquidityUSD: true,
    liquidityNative: true,
    volumeUSD: true,
    volumeNative: true,
    token0Price: true,
    token1Price: true,
    apr: true,
    totalApr: true,
  })

  let poolsToCreate = 0
  let poolsToUpdate = 0
  const batchSize = 500
  const poolsToUpsert: Prisma.PoolCreateManyInput[] = []
  for (let i = 0; i < pools.length; i += batchSize) {
    const poolsToValidate = pools.slice(i, i + batchSize)
    const poolsFound = await client.pool.findMany({
      where: {
        address: { in: poolsToValidate.map((pool) => pool.address) },
      },
      select: poolSelect,
    })

    const filteredPools = poolsToValidate.filter((pool) => {
      const poolExists = poolsFound.find((p) => p.id === pool.id)
      if (!poolExists) {
        poolsToCreate++
        return true
      }
      if (
        pool.reserve0 !== poolExists.reserve0 ||
        pool.reserve1 !== poolExists.reserve1 ||
        pool.totalSupply !== poolExists.totalSupply ||
        Number(pool.liquidityUSD).toFixed(2) !== poolExists.liquidityUSD.toFixed(2).toString() ||
        Number(pool.volumeUSD).toFixed(2) !== poolExists.volumeUSD.toFixed(2).toString() ||
        pool.token0Price !== poolExists.token0Price ||
        pool.token1Price !== poolExists.token1Price ||
        pool.apr !== poolExists.apr
      ) {
        poolsToUpdate++
        return true
      }
      return false
    })
    poolsToUpsert.push(...filteredPools)
  }

  console.log(
    `TRANSFORM - Filtering pools, ${poolsToCreate} pools should be created and ${poolsToUpdate} pools should be updated.`
  )
  return poolsToUpsert
}
