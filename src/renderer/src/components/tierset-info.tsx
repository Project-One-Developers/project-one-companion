import { TooltipArrow } from '@radix-ui/react-tooltip'
import { cn } from '@renderer/lib/utils'
import { GearItem } from '@shared/types/types'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'
import { WowGearIcon } from './ui/wowgear-icon'

type TiersetInfoProps = {
    tierset: GearItem[]
    className?: string
}

const TiersetInfo = ({ tierset, className }: TiersetInfoProps) => {
    const tierSlots = ['head', 'shoulder', 'chest', 'hands', 'legs']
    return (
        <div className={cn('flex flex-row gap-1', className)}>
            {tierSlots.map((slot) => {
                const tiersetItem = tierset.find((t) => t.item.slotKey === slot)
                return (
                    <div key={slot} className="flex flex-col items-center space-x-1">
                        <span className="text-[9px] text-gray-500">{slot}</span>
                        {tiersetItem ? (
                            tiersetItem.source === 'bag' ? (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="text-yellow-500">
                                            <WowGearIcon
                                                gearItem={tiersetItem}
                                                showTierBanner={false}
                                            />
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent className="TooltipContent" side="bottom">
                                        Not Equipped
                                        <TooltipArrow className="TooltipArrow" />
                                    </TooltipContent>
                                </Tooltip>
                            ) : (
                                <WowGearIcon gearItem={tiersetItem} showTierBanner={false} />
                            )
                        ) : (
                            <div className="w-8 h-8 bg-gray-700 border border-cyan-400 rounded-md"></div> // Dummy icon
                        )}
                    </div>
                )
            })}
        </div>
    )
}

export default TiersetInfo
