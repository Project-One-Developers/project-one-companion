import { isInCurrentWowWeek } from '@shared/libs/date/date-utils'
import { Droptimizer } from '@shared/types/types'
import { WowGearIcon } from './ui/wowgear-icon'
import { useMemo } from 'react'

type CurrentGreatVaultPanelProps = {
    droptimizer: Droptimizer | null
}

export const CurrentGreatVaultPanel = ({ droptimizer }: CurrentGreatVaultPanelProps) => {

    // Memoize the data calculations to prevent unnecessary re-renders
    const { weeklyChests, hasData } = useMemo(() => {
        const weeklyChests = droptimizer?.weeklyChest
        const isValidWeek = droptimizer && weeklyChests && isInCurrentWowWeek(droptimizer.simInfo.date)
        const hasData = isValidWeek && weeklyChests && weeklyChests.length > 0
        return { weeklyChests, hasData }
    }, [droptimizer])

    return (
        <div className="flex flex-col p-6 bg-muted rounded-lg relative">
            <div className="flex flex-wrap gap-2">
                {hasData && weeklyChests ? (
                    weeklyChests.map(gear => (
                        <WowGearIcon
                            key={gear.item.id} // todo: what happends if same item in vault?
                            gearItem={gear}
                        />
                    ))
                ) : (
                    <div className="text-sm text-muted-foreground">No great vault info for this week</div>
                )}
            </div>
        </div>
    )
}
