import { SimplePool } from '@sushiswap/rockset-client'
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Currency,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Reply,
  ReplyContent,
} from '@sushiswap/ui'
import { FC, ReactNode } from 'react'
import { formatPercent } from 'sushi'
import { ChainId } from 'sushi/chain'
import { tryParseAmount } from 'sushi/currency'

import { incentiveRewardToToken } from '../../lib/functions'

interface APRHoverCardProps {
  children: ReactNode
  pool: SimplePool
  showEmissions?: boolean
}

export const APRHoverCard: FC<APRHoverCardProps> = ({
  children,
  pool,
  showEmissions = true,
}) => {
  const incentives = [] as any[]
  const incentiveApr = 0
  const card = (
    <>
      <CardHeader>
        <CardTitle>
          {formatPercent(pool.last1DFeeApr)}{' '}
          <span className="ml-1 text-sm font-normal text-muted-foreground">
            {formatPercent(pool.last1DFeeApr)} fees{' '}
            {incentives.length > 0
              ? `+ ${formatPercent(incentiveApr)} rewards`
              : ''}
          </span>
        </CardTitle>
        <CardDescription className="text-xs font-normal">
          APR is calculated based on the fees
          {incentives.length > 0 ? ' and rewards' : ''} generated by the pool
          over the last 24 hours.{' '}
          <b>The APR displayed is algorithmic and subject to change.</b>
        </CardDescription>
      </CardHeader>
      {incentives.length > 0 && showEmissions ? (
        <CardContent>
          <Reply>
            <ReplyContent>
              <p className="mb-1 text-xs text-muted-foreground">
                Reward emissions (per day)
              </p>
              <ul className="space-y-1 list-disc">
                {incentives.map((el, i) => {
                  const amount = tryParseAmount(
                    el.rewardPerDay.toString(),
                    incentiveRewardToToken(el.chainId as ChainId, el),
                  )
                  if (!amount) return null

                  return (
                    <li key={i} className="flex items-center gap-1">
                      <Currency.Icon
                        currency={amount?.currency}
                        width={12}
                        height={12}
                      />
                      {amount?.toSignificant(6)} {amount?.currency.symbol}
                    </li>
                  )
                })}
              </ul>
            </ReplyContent>
          </Reply>
        </CardContent>
      ) : null}
    </>
  )

  return (
    <>
      <div className="hidden sm:block">
        <HoverCard openDelay={0} closeDelay={0}>
          <HoverCardTrigger asChild>{children}</HoverCardTrigger>
          <HoverCardContent side="right" className="!p-0 max-w-[320px]">
            {card}
          </HoverCardContent>
        </HoverCard>
      </div>
      <div className="block sm:hidden">
        <Popover>
          <PopoverTrigger onClick={(e) => e.stopPropagation()} asChild>
            {children}
          </PopoverTrigger>
          <PopoverContent side="right" className="!p-0 max-w-[320px]">
            {card}
          </PopoverContent>
        </Popover>
      </div>
    </>
  )
}
