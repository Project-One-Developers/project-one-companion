import { isInCurrentWowWeek } from '@shared/libs/date/date-utils'
import { Droptimizer } from '@shared/types/types'
import { WowGearIcon } from './ui/wowgear-icon'

type CurrentGreatVaultPanelProps = {
    droptimizer: Droptimizer | null
}

export const CurrentGreatVaultPanel = ({ droptimizer }: CurrentGreatVaultPanelProps) => {
    const weeklyChests = droptimizer?.weeklyChest
    const isValidWeek = droptimizer && weeklyChests && isInCurrentWowWeek(droptimizer.simInfo.date)

    return (
        <div className="flex flex-col p-6 bg-muted rounded-lg relative w-[310px]">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <p className="text-lg font-semibold">Current Great Vault</p>
            </div>

            {/* Chest Items */}
            <div className="flex flex-wrap gap-2">
                {isValidWeek ? (
                    weeklyChests.map(gear => (
                        <WowGearIcon
                            key={gear.item.id} // todo: what happends if same item in vault?
                            gearItem={gear}
                        />
                    ))
                ) : (
                    <div>No great vault info for this week</div>
                )}
            </div>
        </div>
    )
}
