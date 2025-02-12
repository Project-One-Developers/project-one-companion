import { getDpsHumanReadable } from '@renderer/lib/utils'
import type { BossWithItems, Droptimizer, DroptimizerUpgrade } from '@shared/types/types'
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { WowItemIcon } from './ui/wowitem-icon'

import type { JSX } from 'react'

type DroptimizerDetailDialogProps = {
    droptimizer: Droptimizer
    bosses: BossWithItems[]
}

export default function DroptimizerDetailDialog({
    droptimizer,
    bosses
}: DroptimizerDetailDialogProps): JSX.Element {
    const bossMap: Map<BossWithItems, DroptimizerUpgrade[]> = new Map()

    droptimizer.upgrades.forEach((up) => {
        for (let index = 0; index < bosses.length; index++) {
            const boss = bosses[index]
            const bossUpgrade = boss.items.find((i) => i.id === up.item.id)
            if (bossUpgrade) {
                const val = bossMap.get(boss)
                if (val !== undefined) {
                    val.push(up)
                } else {
                    bossMap.set(boss, [up])
                }
            }
        }
    })

    // Sort bosses by order
    const sortedBosses = [...bossMap.keys()].sort((a, b) => a.order - b.order)

    return (
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Droptimizer info</DialogTitle>
                <DialogDescription>
                    <a href={droptimizer.url} rel="noreferrer" target="_blank" className="q3 links">
                        {droptimizer.charInfo.name}
                    </a>
                </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 mt-4">
                {sortedBosses.map((boss) => (
                    <div key={boss.id} className="flex flex-col gap-2">
                        {/* Boss Name Column */}
                        <div className="font-bold text-sm text-gray-700">
                            {boss.order} • {boss.name}
                        </div>
                        {/* Upgrades Column */}
                        <div className="flex flex-wrap gap-2">
                            {bossMap.get(boss)?.map((upgrade) => {
                                const foundItem = boss.items.find((i) => i.id === upgrade.item.id)
                                return (
                                    <div key={upgrade.item.id} className="relative group">
                                        {foundItem ? (
                                            <WowItemIcon
                                                item={foundItem}
                                                iconOnly={true}
                                                ilvl={upgrade.ilvl}
                                                catalystBanner={upgrade.catalyzedItem != null}
                                                className="mt-2"
                                                iconClassName="object-cover object-top rounded-full h-10 w-10 border border-background"
                                            />
                                        ) : (
                                            <a
                                                href={`https://www.wowhead.com/item=${upgrade.item.id}&ilvl=${upgrade.ilvl}`}
                                                rel="noreferrer"
                                                target="_blank"
                                                className="q3 links"
                                            >
                                                <p>{upgrade.item.id}</p>
                                            </a>
                                        )}
                                        <p className="text-xs text-center">
                                            <strong>{getDpsHumanReadable(upgrade.dps)}</strong>
                                        </p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </DialogContent>
    )
}
