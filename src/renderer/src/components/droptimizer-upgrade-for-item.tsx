import { TooltipArrow } from '@radix-ui/react-tooltip'
import { getDpsHumanReadable } from '@renderer/lib/utils'
import { formatUnixTimestampToRelativeDays } from '@shared/libs/date/date-utils'
import { ArrowRight } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'
import { WowGearIcon } from './ui/wowgear-icon'
import { WowSpecIcon } from './ui/wowspec-icon'

type DroptimizerUpgradeForItemEquippedProps = {
    upgrade: { dps: number } | null
    itemEquipped: any // Replace with the correct type
    droptimizer: {
        url: string
        charInfo: { specId: number; name: string }
        simInfo: { date: number }
    }
}

export const DroptimizerUpgradeForItemEquipped = ({
    upgrade,
    itemEquipped,
    droptimizer
}: DroptimizerUpgradeForItemEquippedProps) => {
    // Check if the droptimizer data is older than 7 days
    const isOutdated =
        new Date().getTime() - new Date(droptimizer.simInfo.date * 1000).getTime() >
        7 * 24 * 60 * 60 * 1000

    const droptDate = formatUnixTimestampToRelativeDays(droptimizer.simInfo.date)

    return (
        <div className="flex flex-row items-center space-x-2 p-1 hover:bg-gray-750 rounded-md cursor-pointer transition-all duration-200">
            {/* Spec Dps Gain */}
            <div
                className="flex flex-col items-center relative"
                onClick={() => window.open(droptimizer.url, '_blank', 'noreferrer')}
            >
                <WowSpecIcon
                    specId={droptimizer.charInfo.specId}
                    className="object-cover object-top rounded-lg h-8 w-8 border-2 border-background"
                    title={droptDate}
                />

                {/* Outdated Badge */}
                {isOutdated && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full w-4 h-4 flex items-center justify-center">
                                {/* Warning Icon */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-3 w-3"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent className="bg-gray-800 text-gray-200 p-2 rounded-lg">
                            {'Outdated: ' + droptDate}
                            <TooltipArrow className="fill-gray-800" />
                        </TooltipContent>
                    </Tooltip>
                )}
                <div className="flex items-center mt-1">
                    <span className="font-medium text-xs text-blue-300">
                        {upgrade ? getDpsHumanReadable(upgrade.dps) : '0'}
                    </span>
                </div>
            </div>
            {/* Arrow */}
            <div className="flex mb-4">
                <ArrowRight className="h-4 w-4 text-gray-400" />
            </div>
            {/* Item upgraded */}
            <div className="flex">{itemEquipped && <WowGearIcon gearItem={itemEquipped} />}</div>
        </div>
    )
}
