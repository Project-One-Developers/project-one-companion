import { formatUnixTimestampToRelativeDays, getDpsHumanReadable } from '@renderer/lib/utils'
import { Droptimizer, DroptimizerGearItem, Item } from '@shared/types/types'
import { ArrowRight } from 'lucide-react'
import { WowItemIcon } from './ui/wowitem-icon'
import { WowSpecIcon } from './ui/wowspec-icon'

type DroptimizersUpgradeForItemProps = {
    item: Item
    droptimizers: Droptimizer[]
    showUpgradeItem?: boolean
}

export const DroptimizersUpgradeForItem = ({
    item,
    droptimizers,
    showUpgradeItem = false
}: DroptimizersUpgradeForItemProps) => {
    const itemDroptimizerUpgrades = droptimizers
        .flatMap((dropt) =>
            (dropt.upgrades ?? []).map((upgrade) => ({
                ...upgrade,
                droptimizer: {
                    url: dropt.url,
                    charInfo: dropt.charInfo,
                    simInfo: dropt.simInfo,
                    itemsEquipped: dropt.itemsEquipped
                }
            }))
        )
        .filter((upgrade) => upgrade.item.id === item.id)
        .sort((a, b) => b.dps - a.dps)

    if (!showUpgradeItem) {
        return (
            <div className="flex flex-row items-center gap-x-2">
                {itemDroptimizerUpgrades.map((upgrade) => (
                    <div key={`${upgrade.id}`} className="flex flex-col items-center">
                        <WowSpecIcon
                            specId={upgrade.droptimizer.charInfo.specId}
                            className="object-cover object-top rounded-md full h-5 w-5 border border-background"
                            title={
                                upgrade.droptimizer.charInfo.name +
                                ' - ' +
                                formatUnixTimestampToRelativeDays(upgrade.droptimizer.simInfo.date)
                            }
                        />
                        <p className="text-bold text-[11px]">{getDpsHumanReadable(upgrade.dps)}</p>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center gap-x-4">
            {itemDroptimizerUpgrades.map((upgrade) => {
                const equippedItem: DroptimizerGearItem | undefined =
                    upgrade.droptimizer.itemsEquipped[upgrade.slot]

                return (
                    <div key={`${upgrade.id}`} className="flex flex-row items-center gap-x-2">
                        <div className="flex flex-col items-center">
                            <WowSpecIcon
                                specId={upgrade.droptimizer.charInfo.specId}
                                className="rounded-md full h-8 w-8 border border-background"
                                title={
                                    upgrade.droptimizer.charInfo.name +
                                    ' - ' +
                                    formatUnixTimestampToRelativeDays(
                                        upgrade.droptimizer.simInfo.date
                                    )
                                }
                            />
                            <p className="text-bold text-[11px]">
                                {getDpsHumanReadable(upgrade.dps)}
                            </p>
                        </div>
                        <div className="flex flex-col items-center -mt-4">
                            <ArrowRight className="h-4 w-4 text-gray-400" />
                        </div>
                        <div className="flex flex-col items-center">
                            {equippedItem && (
                                <>
                                    <WowItemIcon
                                        item={equippedItem.id}
                                        iconOnly={true}
                                        ilvl={equippedItem.itemLevel}
                                        bonusString={equippedItem.bonus_id ?? undefined}
                                        enchantString={equippedItem.enchant_id ?? undefined}
                                        gemsString={equippedItem.gem_id ?? undefined}
                                        className="rounded-md full h-8 w-8 border border-background"
                                    />
                                    <p className="text-bold text-[11px]">
                                        {equippedItem.itemLevel}
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
