import { fetchBosses } from '@renderer/lib/tanstack-query/bosses'
import { queryClient } from '@renderer/lib/tanstack-query/client'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { deleteLootById, getLootsBySessionWithItem } from '@renderer/lib/tanstack-query/loots'
import { CURRENT_RAID_ID } from '@shared/consts/wow.consts'
import { LootWithItem, WowRaidDifficulty } from '@shared/types/types'
import { useMutation, useQuery } from '@tanstack/react-query'
import { LoaderCircle, X } from 'lucide-react'
import { useMemo } from 'react'
import { WowGearIcon } from './ui/wowgear-icon'

type SessionLootsPanelProps = {
    raidSessionId: string
}

type GroupedLoots = {
    [bossId: string]: {
        [difficulty: string]: LootWithItem[]
    }
}

export const SessionLootsPanel = ({ raidSessionId }: SessionLootsPanelProps) => {
    const lootsQuery = useQuery({
        queryKey: [queryKeys.lootsBySession, raidSessionId],
        queryFn: () => getLootsBySessionWithItem(raidSessionId)
    })
    const bossesQuery = useQuery({
        queryKey: [queryKeys.bosses, CURRENT_RAID_ID],
        queryFn: () => fetchBosses(CURRENT_RAID_ID)
    })

    const deleteLootMutation = useMutation({
        mutationFn: (lootId: string) => deleteLootById(lootId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKeys.lootsBySession, raidSessionId] })
        }
    })

    const loots = useMemo<LootWithItem[]>(() => lootsQuery.data ?? [], [lootsQuery.data])

    // Memoize sorted bosses
    const orderedBosses = useMemo(() => {
        if (!bossesQuery.data) return []
        return bossesQuery.data.sort((a, b) => a.order - b.order)
    }, [bossesQuery.data])

    // Memoize grouped loots & total token counts
    const { groupedLoots, allDifficulties, tokenSums } = useMemo(() => {
        const grouped: GroupedLoots = {}
        const difficultyOrder: WowRaidDifficulty[] = ['Mythic', 'Heroic', 'Normal']
        const tokenSums: Record<WowRaidDifficulty, number> = {
            Mythic: 0,
            Heroic: 0,
            Normal: 0,
            LFR: 0
        }

        loots.forEach((loot) => {
            const { bossId } = loot.item
            const difficulty = loot.raidDifficulty

            if (!grouped[bossId]) grouped[bossId] = {}
            if (!grouped[bossId][difficulty]) {
                grouped[bossId][difficulty] = []
            }

            grouped[bossId][difficulty].push(loot)

            if (loot.gearItem.item.token) {
                tokenSums[difficulty] += 1
            }
        })

        const uniqueDifficulties = Array.from(
            new Set(loots.map((loot) => loot.raidDifficulty))
        ).sort((a, b) => difficultyOrder.indexOf(a) - difficultyOrder.indexOf(b))

        return { groupedLoots: grouped, allDifficulties: uniqueDifficulties, tokenSums }
    }, [loots])

    if (lootsQuery.isLoading || bossesQuery.isLoading) {
        return (
            <div className="flex flex-col items-center w-full justify-center mt-10 mb-10">
                <LoaderCircle className="animate-spin text-5xl" />
            </div>
        )
    }

    return (
        <div className="mb-4">
            {Object.keys(groupedLoots).length > 0 ? (
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="p-2 text-left">Boss</th>
                            {allDifficulties.map((difficulty) => (
                                <th key={difficulty} className="p-2 text-left">
                                    {difficulty} ({tokenSums[difficulty]} tokens)
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {orderedBosses.map((boss) => (
                            <tr key={boss.id} className="border-t">
                                <td className="p-2 font-semibold">{boss.name}</td>
                                {allDifficulties.map((difficulty) => (
                                    <td key={difficulty} className="p-2">
                                        <div className="flex flex-row gap-2">
                                            {groupedLoots[boss.id]?.[difficulty]?.map((loot) => (
                                                <div key={loot.id} className="relative group">
                                                    <WowGearIcon
                                                        gearItem={loot.gearItem}
                                                        showTierBanner={true}
                                                        showItemTrackDiff={false}
                                                    />
                                                    <button
                                                        onClick={() =>
                                                            deleteLootMutation.mutate(loot.id)
                                                        }
                                                        className="absolute -top-2 -right-2 hidden group-hover:flex items-center justify-center w-5 h-5 bg-red-500 text-white rounded-full"
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                </div>
                                            )) || <span className="text-gray-400">-</span>}
                                        </div>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="text-gray-400 text-center py-4">No items looted yet</div>
            )}
        </div>
    )
}
