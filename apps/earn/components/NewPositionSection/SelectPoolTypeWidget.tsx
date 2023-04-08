import { RadioGroup } from '@headlessui/react'
import { StarIcon } from '@heroicons/react/solid'
import { CheckIcon, classNames } from '@sushiswap/ui'
import { PoolFinderType } from '@sushiswap/wagmi'
import React, { FC, memo } from 'react'
import { ContentBlock } from '../AddPage/ContentBlock'

const POOL_OPTIONS = [
  {
    value: PoolFinderType.ConcentratedLiquidity,
    title: 'Concentrated Liquidity Pool',
    subtitle: 'Yields the highest returns',
  },
  {
    value: PoolFinderType.Stable,
    title: 'Stable Pool',
    subtitle: 'Suitable for stable pairs',
  },
  {
    value: PoolFinderType.Classic,
    title: 'Classic Pool',
    subtitle: 'Suitable for regular pairs',
  },
]

interface SelectPoolTypeWidgetProps {
  poolType: PoolFinderType
  setPoolType(type: PoolFinderType): void
}

export const SelectPoolTypeWidget: FC<SelectPoolTypeWidgetProps> = memo(function SelectPoolTypeWidget({
  poolType,
  setPoolType,
}) {
  return (
    <ContentBlock
      title={
        <>
          Select your preferred <span className="text-gray-900 dark:text-white">pool type</span>.
        </>
      }
    >
      <RadioGroup value={poolType} onChange={setPoolType} className="grid grid-cols-2 gap-4">
        {POOL_OPTIONS.map((option) => (
          <RadioGroup.Option
            key={option.value}
            value={option.value}
            className={({ checked }) =>
              classNames(
                checked ? 'ring ring-blue' : '',
                'relative px-5 py-3 flex items-center rounded-xl bg-white dark:bg-slate-800/40 cursor-pointer'
              )
            }
          >
            {({ checked }) => (
              <div className="flex flex-col gap-1">
                <span className="text-gray-900 dark:text-slate-50 font-medium flex items-center gap-2">
                  {option.title}
                  {option.value === PoolFinderType.ConcentratedLiquidity && (
                    <StarIcon width={12} height={12} className="text-yellow" />
                  )}
                </span>
                <span className="text-gray-500 dark:text-slate-400 text-slate-600 text-sm">
                  {checked && (
                    <div className="absolute right-3 bg-blue rounded-full p-0.5">
                      <CheckIcon width={12} height={12} />
                    </div>
                  )}
                  {option.subtitle}
                </span>
              </div>
            )}
          </RadioGroup.Option>
        ))}
      </RadioGroup>
    </ContentBlock>
  )
})
