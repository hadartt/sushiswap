import { ChainId } from '@sushiswap/chain'
import { SUSHI_ADDRESS } from '@sushiswap/currency'
import { gql, request } from 'graphql-request'

import { DATE_FILTERS, GOV_STATUS } from './constants'
import { endOfPreviousQuarter } from './helpers'

import type { Address } from 'wagmi'
async function fetchUrl<T>(urlPath: string, options?: RequestInit) {
  const url = new URL(urlPath)

  return fetch(url, options).then((res) => {
    if (!res.ok) {
      console.error(res.status, res.statusText, url.href)
      return
    }
    return res.json() as T
  })
}

export async function getSushiPriceUSD() {
  const prices = await fetchUrl<{ [key: string]: number }>('https://token-price.sushi.com/v0/1')

  return prices?.[SUSHI_ADDRESS[ChainId.ETHEREUM].toLowerCase()] ?? 0
}

async function getBlockNumberFromTimestamp(timestamp: number) {
  const ETH_BLOCKS_GRAPH_URL = 'https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks'
  const query = gql`
    query Blocks($timestamp: BigInt) {
      blocks(where: { timestamp_gte: $timestamp }, first: 1, orderBy: timestamp, orderDirection: asc) {
        number
      }
    }
  `

  const res = await request<{ blocks: { number: string }[] }>(ETH_BLOCKS_GRAPH_URL, query, { timestamp })
  return +res.blocks[0].number
}

/* ===== Discourse (forum) & Snapshot ===== */
export interface GovernanceItem {
  type: {
    id: string
    title: string
    color: string
  }
  title: string
  isActive: boolean
  url: string
  category: string
}
export type GovernanceStatus = keyof typeof GOV_STATUS

const DISCOURSE_API_KEY = '86fb0ca272612c10eabca94eec66f2d350bd11a10da2eff0744809a0e3cb6eb9' // TODO: env var
const DISCOURSE_BASE_URL = 'https://forum.sushi.com/'
const DISCOURSE_PROPOSAL_ID = 8
const SNAPSHOT_URL = 'https://hub.snapshot.org/graphql'

async function fetchDiscourse<T>(path: string) {
  const data = await fetchUrl<T>(DISCOURSE_BASE_URL + path, {
    headers: {
      'Api-Key': DISCOURSE_API_KEY,
      'Api-Username': 'sushi',
    },
  })

  return data
}

export async function getLatestGovernanceItems(filters?: {
  dateFilter: 'month' | 'quarter' | 'year' | 'all'
  sortForumPosts?: 'created' | 'activity' | 'default'
}) {
  const filterSeconds = filters
    ? DATE_FILTERS.options.find((option) => option.key === filters.dateFilter)?.seconds
    : null

  const forumParams = filters?.sortForumPosts ? new URLSearchParams({ order: filters.sortForumPosts }) : ''
  const forumUrl = `latest.json?${forumParams.toString()}`

  const query = gql`
    query Proposals($after: Int) {
      proposals(where: { space: "sushigov.eth", created_gte: $after }, orderBy: "created", orderDirection: desc) {
        id
        title
        body
        state
        author
      }
    }
  `

  const [forumTopicsRes, forumCategoriesRes, snapshotRes] = await Promise.all([
    fetchDiscourse<{
      topic_list: {
        topics: {
          title: string
          created_at: string
          category_id: number
          slug: string
        }[]
      }
    }>(forumUrl),
    fetchDiscourse<{
      category_list: {
        categories: {
          id: number
          name: string
        }[]
      }
    }>('categories.json'),
    request<{
      proposals: {
        id: string
        title: string
        body: string
        state: 'open' | 'closed'
        author: string
      }[]
    }>(SNAPSHOT_URL, query, { after: filterSeconds ? Math.floor(new Date().getTime() / 1000) - filterSeconds : null }),
  ])

  const snapshotProposals = snapshotRes.proposals.map((proposal) => ({
    type: GOV_STATUS.IMPLEMENTATION,
    title: proposal.title,
    isActive: proposal.state === 'open',
    url: 'https://snapshot.org/#/sushigov.eth/proposal/' + proposal.id,
    category: GOV_STATUS.IMPLEMENTATION.title,
  }))

  const forumTopics =
    forumTopicsRes?.topic_list.topics
      .filter((t) => {
        if (filterSeconds) {
          const topicCreationDateSeconds = Math.floor(new Date(t.created_at).getTime() / 1000)
          const nowSeconds = Math.floor(new Date().getTime() / 1000)
          const filterFrom = nowSeconds - filterSeconds

          if (topicCreationDateSeconds < filterFrom) return false
        }
        return true
      })
      .map((topic) => {
        const topicType = topic.category_id === DISCOURSE_PROPOSAL_ID ? GOV_STATUS.PROPOSAL : GOV_STATUS.DISCUSSION

        return {
          type: topicType,
          title: topic.title,
          isActive: false,
          url: 'https://forum.sushi.com/t/' + topic.slug,
          category:
            forumCategoriesRes?.category_list.categories.find((category) => category.id === topic.category_id)?.name ??
            topicType.title,
        }
      }) ?? []

  const res = [...snapshotProposals, ...forumTopics].reduce(
    (acc: Record<GovernanceStatus, GovernanceItem[]>, curr) => {
      acc[curr.type.id].push(curr)
      return acc
    },
    {
      IMPLEMENTATION: [],
      PROPOSAL: [],
      DISCUSSION: [],
    }
  )

  return res
}

export async function getForumStats() {
  const query = gql`
    query Space {
      space(id: "sushigov.eth") {
        proposalsCount
      }
    }
  `
  const [forumStats, proposalCountRes] = await Promise.all([
    fetchDiscourse<{
      about: {
        stats: { user_count: number; active_users_7_days: number; active_users_30_days: number }
      }
    }>('about.json'),
    request<{ space: { proposalsCount: number } }>(SNAPSHOT_URL, query),
  ])

  const data = { ...forumStats?.about.stats, proposalsCount: proposalCountRes.space.proposalsCount }

  return data
}

/* ===== $SUSHI subgraph ===== */

const GRAPH_URL = 'https://api.thegraph.com/subgraphs/name/olastenberg/sushi'

function getTokenConcentration(topTenUsers: { balance: string }[], totalSupply: string) {
  const topTenBalances: bigint = topTenUsers.reduce(
    (acc: bigint, curr: { balance: string }) => acc + BigInt(curr.balance),
    0n
  )
  const tokenConcentration = Number((topTenBalances * 100n) / BigInt(totalSupply)) / 100

  return tokenConcentration
}

export async function getTokenHolders(filters?: { balanceFilter: number; orderDirection: 'asc' | 'desc' }) {
  const query = gql`
    query TokenHolders(
      $usersFilter: User_filter
      $usersOrderDirection: OrderDirection
      $previousQuarterBlockNumber: Int
    ) {
      sushi(id: "Sushi") {
        userCount
        totalSupply
      }
      users(first: 10, orderBy: balance, where: $usersFilter, orderDirection: $usersOrderDirection) {
        balance
        id
      }
      topTenUsers: users(first: 10, orderBy: balance, orderDirection: desc) {
        balance
      }
      previousQuarterTopTenUsers: users(
        first: 10
        orderBy: balance
        orderDirection: desc
        block: { number: $previousQuarterBlockNumber }
      ) {
        balance
      }
      previousQuarterSushiStats: sushi(id: "Sushi", block: { number: $previousQuarterBlockNumber }) {
        userCount
        totalSupply
      }
    }
  `

  const previousQuarterTimestamp = Math.floor(endOfPreviousQuarter(Date.now()) / 1000)
  const previousQuarterBlockNumber = await getBlockNumberFromTimestamp(previousQuarterTimestamp)

  const tokenHoldersRes = await request(GRAPH_URL, query, {
    usersOrderDirection: filters?.orderDirection ?? 'desc',
    usersFilter: {
      balance_gt: filters?.balanceFilter ? (BigInt(1e18) * BigInt(+filters.balanceFilter)).toString() : 0,
    },
    previousQuarterBlockNumber,
  })

  const tokenConcentration = getTokenConcentration(tokenHoldersRes.topTenUsers, tokenHoldersRes.sushi.totalSupply)
  const previousQuarterTokenConcentration = getTokenConcentration(
    tokenHoldersRes.previousQuarterTopTenUsers,
    tokenHoldersRes.previousQuarterSushiStats.totalSupply
  )

  const res = {
    userCount: tokenHoldersRes.sushi.userCount,
    totalSupply: tokenHoldersRes.sushi.totalSupply,
    users: tokenHoldersRes.users,
    tokenConcentration,
    previousQuarter: {
      userCount: tokenHoldersRes.previousQuarterSushiStats.userCount,
      totalSupply: tokenHoldersRes.previousQuarterSushiStats.totalSupply,
      tokenConcentration: previousQuarterTokenConcentration,
    },
  }

  return res
}

/* ===== Defillama ===== */

export async function getTreasuryHistoricalTvl() {
  const allBalances = await fetchUrl<{
    chainTvls: {
      [group: string]: {
        tvl: {
          date: number
          totalLiquidityUSD: number
        }[]
      }
    }
  }>('https://api.llama.fi/treasury/sushi')

  if (!allBalances) return []

  const combinedData = {}

  for (const group in allBalances.chainTvls) {
    // defillama: skip sum of keys like ethereum-staking, arbitrum-vesting
    if (group.includes('-') || group.toLowerCase() === 'offers') continue

    allBalances.chainTvls[group].tvl.forEach(({ date, totalLiquidityUSD }) => {
      if (!combinedData[date]) {
        combinedData[date] = 0
      }
      combinedData[date] += totalLiquidityUSD
    })
  }

  const result = Object.entries(combinedData).map(([date, totalLiquidityUSD]) => ({
    date,
    value: totalLiquidityUSD as number,
  }))

  return result
}

export const TREASURY_ADDRESS = '0xe94B5EEC1fA96CEecbD33EF5Baa8d00E4493F4f3'

/* ===== Zapper ===== */

const ZAPPER_API_KEY = '8f751c9d-0cbd-4038-a6b5-689e818de73e' // TODO: env var
const ZAPPER_BASE_URL = 'https://api.zapper.xyz/v2/'

const SUSHI_WALLETS = [
  '0x19B3Eb3Af5D93b77a5619b047De0EED7115A19e7',
  '0x850a57630a2012b2494779fbc86bbc24f2a7baef',
  '0xe94b5eec1fa96ceecbd33ef5baa8d00e4493f4f3',
  '0x1219bfa3a499548507b4917e33f17439b67a2177',
  '0x978982772b8e4055b921bf9295c0d74eb36bc54e',
  '0xf9e7d4c6d36ca311566f46c81e572102a2dc9f52',
  '0x5ad6211cd3fde39a9cecb5df6f380b8263d1e277',
  '0xa19b3b22f29e23e4c04678c94cfc3e8f202137d8',
  '0x1026cbed7b7E851426b959BC69dcC1bf5876512d', // merkle distributor
  '0xcbe6b83e77cdc011cc18f6f0df8444e5783ed982', // merkle distributor
]

const SUSHI_NETWORKS = ['ethereum', 'polygon', 'optimism', 'arbitrum', 'fantom']

async function fetchZapper<T>(path: string) {
  const encodedKey = Buffer.from(ZAPPER_API_KEY + ':').toString('base64')

  const data = await fetchUrl<T>(ZAPPER_BASE_URL + path, {
    method: 'GET',
    headers: {
      Authorization: 'Basic ' + encodedKey,
    },
  })

  return data
}

function getZapperParams() {
  const params = new URLSearchParams()

  for (const sushiAddress of SUSHI_WALLETS) {
    params.append('addresses[]', sushiAddress)
  }
  for (const network of SUSHI_NETWORKS) {
    params.append('networks[]', network)
  }

  return params
}

export async function getTreasuryVestingValue() {
  const params = getZapperParams()

  const appBalances = await fetchZapper<{ balanceUSD: number }[]>(`balances/apps?${params.toString()}`)
  const totalVestingValue = appBalances?.reduce((acc, curr) => acc + curr.balanceUSD, 0)
  return totalVestingValue
}

interface ZapperToken {
  id: string
  address: Address
  name: string
  symbol: string
  price: number
  balance: number
  balanceUSD: number
  decimals: number
}
interface ZapperBalance {
  address: Address
  network: string
  token: ZapperToken
}

export interface TreasuryBalance {
  id: string
  token: {
    address: Address
    name: string
    symbol: string
    chainId: number
    decimals: number
    isNative: boolean
  }
  price: number
  balance: number
  balanceUSD: number
  portfolioShare: number
}

export interface TreasurySnapshot {
  totalValueUsd: number
  balancesValueUsd: number
  vestingValueUsd: number
  balances: TreasuryBalance[]
}

export async function getTreasurySnapshot() {
  const params = getZapperParams()

  const [tokenBalances, appBalances] = await Promise.all([
    fetchZapper<{ [key: string]: ZapperBalance[] }>(`balances/tokens?${params.toString()}`),
    fetchZapper<{ balanceUSD: number }[]>(`balances/apps?${params.toString()}`),
  ])

  const flattened = tokenBalances
    ? Object.values(tokenBalances)
        .flat()
        .map((b) => ({ ...b.token, network: b.network }))
        .filter((i) => i.balanceUSD > 10_000)
    : []

  const combined = flattened.reduce((acc: (ZapperToken & { network: string })[], curr) => {
    const existingToken = acc.find(({ symbol }) => symbol === curr.symbol)
    if (existingToken) {
      existingToken.price += curr.price
      existingToken.balance += curr.balance
      existingToken.balanceUSD += curr.balanceUSD
    } else {
      acc.push({ ...curr })
    }
    return acc
  }, [])

  const balancesValueUsd = combined.reduce((acc, curr) => acc + Number(curr.balanceUSD), 0)
  const vestingValueUsd = appBalances?.reduce((acc, curr) => acc + curr.balanceUSD, 0) ?? 0
  const totalValueUsd = balancesValueUsd + vestingValueUsd

  const NETWORK_TO_ID = {
    ethereum: 1,
    polygon: 137,
    optimism: 10,
    arbitrum: 42161,
    fantom: 250,
  }

  const balances: TreasuryBalance[] = combined.map((info) => {
    const portfolioShare = info.balanceUSD / balancesValueUsd
    const token = {
      address: info.address,
      name: info.name,
      symbol: info.symbol,
      chainId: NETWORK_TO_ID[info.network],
      decimals: info.decimals,
      isNative: info.address === '0x0000000000000000000000000000000000000000',
    }
    return {
      id: info.id,
      token,
      portfolioShare,
      price: info.price,
      balance: info.balance,
      balanceUSD: info.balanceUSD,
    }
  })

  return {
    balancesValueUsd,
    balances,
    vestingValueUsd,
    totalValueUsd,
  }
}

/* ===== Notion ===== */

interface NotionEvent {
  // id: 'f1f5caf7-3cd0-44cb-b59e-e2f553239019'
  properties: {
    Date: { date: { start: string } }
    'Location (City, Country)': { rich_text: [{ plain_text: string }] }
    'Event URL': { url: string }
    'Event Name': { title: [{ plain_text: string }] }
    Image: { url: string }
  }
}

export interface SushiEvent {
  imgUrl: string
  title: string
  date: string
  location: string
  eventUrl: string
}

const NOTION_API_KEY = 'secret_ju72Hrhy650UPp8g2ZgK3ptjiGC6XwONF1veM9QqQ4I' // TODO: env var
const NOTION_BASE_URL = 'https://api.notion.com/v1/'
const NOTION_VERSION = '2022-06-28'

async function fetchNotionDatabase<T>(databaseId: string) {
  const data = await fetchUrl<{ results: T }>(`https://api.notion.com/v1/databases/${databaseId}/query`, {
    headers: {
      Authorization: `Bearer ${NOTION_API_KEY}`,
      'Notion-Version': NOTION_VERSION,
    },
    method: 'POST',
  })

  return data?.results
}

export async function getNotionEvents() {
  const EVENTS_DB_ID = 'f2ab0048afd842c38ab4a21e2ceb121f'
  const notionEvents = await fetchNotionDatabase<NotionEvent[]>(EVENTS_DB_ID)

  const events: SushiEvent[] =
    notionEvents
      ?.filter((e) => e.properties['Event Name'].title.length)
      .map((event) => {
        const date = event.properties.Date.date.start
        const location = event.properties['Location (City, Country)'].rich_text[0].plain_text
        const title = event.properties['Event Name'].title[0].plain_text
        const imgUrl = event.properties.Image.url
        const eventUrl = event.properties['Event URL'].url
        return { date, location, title, imgUrl, eventUrl }
      }) ?? []

  return events
}

export async function getNotionBudget() {
  const BUDGET_DB_ID = 'bd11844610cf4203a92c4058bdefdd08'
  const notionBudget = await fetchNotionDatabase<NotionEvent[]>(BUDGET_DB_ID)

  console.log('notionBudget', JSON.stringify(notionBudget, null, 2))
}
