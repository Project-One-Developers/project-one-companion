import { currentWowWeek, unixTimestampToWowWeek } from '@renderer/lib/utils'
import { Droptimizer } from '@shared/types/types'
import { WowItemIcon } from './ui/wowitem-icon'

type CurrentGreatVaultPanelProps = {
    droptimizer: Droptimizer | null
}

export const CurrentGreatVaultPanel = ({ droptimizer }: CurrentGreatVaultPanelProps) => {
    const weeklyChests = droptimizer?.weeklyChest
    const isValidWeek =
        droptimizer &&
        weeklyChests &&
        currentWowWeek() === unixTimestampToWowWeek(droptimizer.simInfo.date)

    return (
        <div className="flex flex-col p-6 bg-muted rounded-lg relative w-[310px]">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <p className="text-lg font-semibold">Current Great Vault</p>
            </div>

            {/* Chest Items */}
            <div className="flex flex-wrap gap-2">
                {isValidWeek ? (
                    weeklyChests.map((wc) => (
                        <WowItemIcon
                            key={wc.id}
                            item={wc.id}
                            iconOnly={false}
                            bonusString={wc.bonusString}
                            ilvl={wc.itemLevel}
                            iconClassName="object-cover object-top rounded-lg h-8 w-8 border border-background"
                        />
                    ))
                ) : (
                    <div>No great vault info for this week</div>
                )}
            </div>
        </div>
    )
}
