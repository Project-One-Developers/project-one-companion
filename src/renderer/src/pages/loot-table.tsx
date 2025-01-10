import { WowItemIcon } from '@renderer/components/ui/wowitem-icon'
import { WowSpecIcon } from '@renderer/components/ui/wowspec-icon'
import { fetchDroptimizers } from '@renderer/lib/tanstack-query/droptimizers'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { fetchRaidLootTable } from '@renderer/lib/tanstack-query/raid'
import { encounterIcon } from '@renderer/lib/wow-icon'
import { Boss, Droptimizer, WowRaidDifficulty } from '@shared/types/types'
import { useQuery } from '@tanstack/react-query'
import { LoaderCircle } from 'lucide-react'

import type { JSX } from "react";

export default function LootTable(): JSX.Element {
    const currentRaid = 1273
    const droptimizerRes = useQuery({
        queryKey: [queryKeys.droptimizers],
        queryFn: fetchDroptimizers
    })
    const itemRes = useQuery({
        queryKey: [queryKeys.raidLootTable, currentRaid],
        queryFn: () => fetchRaidLootTable(currentRaid)
    })

    const droptimizers: Droptimizer[] = droptimizerRes.data?.droptimizers ?? []
    const droptimizersIsLoading = droptimizerRes.isLoading
    const encounterList: Boss[] = itemRes.data ?? []
    const raidItemsIsLoading = itemRes.isLoading
    const diff: WowRaidDifficulty = 'Heroic'

    // Helper function to find upgrades for an item
    const getDroptimizersWithItemUpgrade = (itemId: number): Droptimizer[] => {
        return droptimizers.filter(
            (droptimizer) =>
                droptimizer.upgrades != null &&
                droptimizer.upgrades.findIndex((up) => up.itemId === itemId) > -1
        )
    }

    return (
        <>
            {raidItemsIsLoading ? (
                <div className="flex flex-col items-center w-full justify-center mt-10 mb-10">
                    <LoaderCircle className="animate-spin text-5xl" />
                </div>
            ) : (
                <div className="w-dvw h-dvh overflow-y-auto flex flex-col gap-y-8 items-center p-8 relative">
                    <div className="grid grid-cols-3 w-full items-center">
                        <div></div>
                        <h1 className="mx-auto text-3xl font-bold">Raid Loot Table</h1>
                        <div></div>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-4">
                        {encounterList.map((boss) => (
                            <div
                                key={boss.id}
                                className="flex flex-col bg-muted rounded-lg overflow-hidden"
                            >
                                {/* Boss Panel Header */}
                                <div className="flex flex-col gap-y-2">
                                    <img
                                        src={encounterIcon.get(boss.id)}
                                        alt={`${boss.name} icon`}
                                        className="w-full h-32 object-scale-down"
                                    />
                                    <h2 className="text-center text-xs font-bold ">{boss.name}</h2>
                                </div>

                                {droptimizersIsLoading ? (
                                    <div className="flex flex-col items-center w-full justify-center mt-10 mb-10">
                                        <LoaderCircle className="animate-spin text-5xl" />
                                    </div>
                                ) : (
                                    <div className="p-6">
                                        {boss.items.map((item) => {
                                            const droptimizers = getDroptimizersWithItemUpgrade(
                                                item.id
                                            )
                                            return (
                                                <div
                                                    className="flex flex-row gap-x-8 justify-between"
                                                    key={item.id}
                                                >
                                                    <div className="items-center">
                                                        <WowItemIcon
                                                            item={item}
                                                            iconOnly={false}
                                                            raidDiff={diff}
                                                            className="mt-2"
                                                            iconClassName="object-cover object-top rounded-full h-10 w-10 border border-background"
                                                        />
                                                    </div>
                                                    <div className="flex flex-row items-center  gap-x-2">
                                                        {droptimizers.map((dropt) => (
                                                            <div key={item.id + '-' + dropt.url}>
                                                                <div className="flex flex-col items-center space-x-3">
                                                                    <WowSpecIcon
                                                                        specId={
                                                                            dropt.charInfo.specId
                                                                        }
                                                                        className="object-cover object-top rounded-md full h-5 w-5 border border-background"
                                                                    />
                                                                    {/* <h2 className="text-xs">
                                                                        {dropt.charInfo.name}
                                                                    </h2> */}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    )
}
