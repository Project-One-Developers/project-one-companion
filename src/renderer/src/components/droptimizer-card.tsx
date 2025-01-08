import { getDpsHumanReadable, unitTimestampToRelativeDays } from '@renderer/lib/utils'
import { Droptimizer, Item } from '@shared/types/types'
import { WowheadLink } from './ui/wowhead-link'
import { WowItemIcon } from './ui/wowitem-icon'
import { WowSpecIcon } from './ui/wowspec-icon'

type DroptimizerCardProps = {
    droptimizer: Droptimizer
    raidItems: Item[]
}

export const DroptimizerCard = ({
    droptimizer: dropt,
    raidItems: raidItems
}: DroptimizerCardProps) => {
    return (
        <div className="flex flex-col justify-between p-6 bg-muted h-[230px] w-[310px] rounded-lg relative">
            {/* Character Info */}
            <div className="flex items-center space-x-3">
                <WowSpecIcon
                    specId={dropt.charInfo.specId}
                    className="object-cover object-top rounded-md full h-10 w-10 border border-background"
                />
                <h2 className="font-black">{dropt.charInfo.name}</h2>
            </div>

            {/* Droptimizer Info */}
            <div className="text-xs  mt-3">
                <p>
                    <strong>Raid Difficulty:</strong> {dropt.raidInfo.difficulty}
                </p>
                <p>
                    <strong>Fight Style:</strong> {dropt.simInfo.fightstyle} (
                    {dropt.simInfo.nTargets}) {dropt.simInfo.duration} sec
                </p>
                <p title={new Date(dropt.simInfo.date * 1000).toLocaleString()}>
                    <strong>Date: </strong>
                    {unitTimestampToRelativeDays(dropt.simInfo.date)}
                </p>
                <p>
                    <strong>Upgrades:</strong> {dropt.upgrades?.length}
                </p>
            </div>

            {/* Upgrades */}
            {dropt.upgrades ? (
                <div className="flex items-center gap-3 mt-1">
                    {dropt.upgrades
                        .sort((a, b) => b.dps - a.dps)
                        .slice(0, 6)
                        .map((upgrade) => {
                            const foundItem = raidItems.find((item) => item.id === upgrade.itemId)
                            return (
                                <div className="-mr-4 relative group" key={upgrade.itemId}>
                                    {foundItem ? (
                                        <WowItemIcon
                                            item={foundItem}
                                            iconOnly={true}
                                            raidDiff="Heroic"
                                            catalystBanner={upgrade.catalyzedItemId !== null}
                                            className="mt-2"
                                            iconClassName="object-cover object-top rounded-full h-10 w-10 border border-background"
                                        />
                                    ) : (
                                        <WowheadLink
                                            itemId={upgrade.itemId}
                                            specId={dropt.charInfo.specId}
                                            iconOnly={true}
                                            className="border-red-50 h-30 w-10"
                                            data-wh-icon-size="medium"
                                        />
                                    )}
                                    <p className="text-xs text-center">
                                        <strong>{getDpsHumanReadable(upgrade.dps)}</strong>
                                    </p>
                                </div>
                            )
                        })}
                </div>
            ) : (
                <p className="text-sm text-gray-600">No upgrades available.</p>
            )}
        </div>
    )
}
