import { formatUnixTimestampToRelativeDays, getDpsHumanReadable } from '@renderer/lib/utils'
import { Droptimizer, DroptimizerUpgrade, GearItem } from '@shared/types/types'
import { ArrowRight } from 'lucide-react'
import { WowGearIcon } from './ui/wowgear-icon'
import { WowSpecIcon } from './ui/wowspec-icon'

type DroptimizerUpgradeForItemEquippedProps = {
    upgrade: DroptimizerUpgrade | null // dps gain info
    itemEquipped: GearItem // item that is going to be replaced by the upgrade
    droptimizer: Droptimizer // droptimizer source
}

export const DroptimizerUpgradeForItemEquipped = ({
    upgrade,
    itemEquipped,
    droptimizer
}: DroptimizerUpgradeForItemEquippedProps) => {
    return (
        <div className="flex flex-row item ">
            {/* Spec Dps Gain */}
            <div className="flex flex-col items-center ">
                <WowSpecIcon
                    specId={droptimizer.charInfo.specId}
                    className="rounded-md full h-8 w-8 border border-background"
                    title={
                        droptimizer.charInfo.name +
                        ' - ' +
                        formatUnixTimestampToRelativeDays(droptimizer.simInfo.date)
                    }
                />
                <p className="text-bold text-[11px]">
                    {upgrade ? getDpsHumanReadable(upgrade.dps) : '0'}
                </p>
            </div>
            {/* Arrow */}
            <div className="flex mt-2">
                <ArrowRight className="h-4 w-4 text-gray-400" />
            </div>
            {/* Item upgraded */}
            <div className="flex">{itemEquipped && <WowGearIcon item={itemEquipped} />}</div>
        </div>
    )
}
