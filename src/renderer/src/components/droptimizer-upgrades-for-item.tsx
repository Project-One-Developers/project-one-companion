import { formatUnixTimestampToRelativeDays, getDpsHumanReadable } from '@renderer/lib/utils'
import { Droptimizer, Item } from '@shared/types/types'
import { WowSpecIcon } from './ui/wowspec-icon'

type DroptimizersUpgradeForItemProps = {
    item: Item
    droptimizers: Droptimizer[]
}

export const DroptimizersUpgradeForItem = ({
    item,
    droptimizers
}: DroptimizersUpgradeForItemProps) => {
    const itemDroptimizerUpgrades = droptimizers
        .flatMap((dropt) =>
            (dropt.upgrades ?? []).map((upgrade) => ({
                ...upgrade,
                droptimizer: {
                    url: dropt.url,
                    charInfo: dropt.charInfo,
                    simInfo: dropt.simInfo
                }
            }))
        )
        .filter((upgrade) => upgrade.item.id === item.id)
        .sort((a, b) => b.dps - a.dps)
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
