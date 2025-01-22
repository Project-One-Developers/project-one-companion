import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { getLootsBySession } from '@renderer/lib/tanstack-query/loots'
import { LootWithItem } from '@shared/types/types'
import { useQuery } from '@tanstack/react-query'
import { LoaderCircle } from 'lucide-react'
import { WowItemIcon } from './ui/wowitem-icon'

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
        queryFn: () => getLootsBySession(raidSessionId)
    })

    const loots = lootsQuery.data ?? []

    if (lootsQuery.isLoading) {
        return (
            <div className="flex flex-col items-center w-full justify-center mt-10 mb-10">
                <LoaderCircle className="animate-spin text-5xl" />
            </div>
        )
    }

    // Group loots by boss ID and then by difficulty
    const groupedLoots: GroupedLoots = loots.reduce((acc, loot) => {
        if (!acc[loot.item.bossId]) {
            acc[loot.item.bossId] = {}
        }
        if (!acc[loot.item.bossId][loot.raidDifficulty]) {
            acc[loot.item.bossId][loot.raidDifficulty] = []
        }
        acc[loot.item.bossId][loot.raidDifficulty].push(loot)
        return acc
    }, {} as GroupedLoots)

    // Get all unique difficulties
    const allDifficulties = Array.from(new Set(loots.map((loot) => loot.raidDifficulty)))

    return (
        <div className="mb-4 ">
            {Object.keys(groupedLoots).length > 0 ? (
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="">
                            <th className="p-2 text-left">Boss ID</th>
                            {allDifficulties.map((difficulty) => (
                                <th key={difficulty} className="p-2 text-left">
                                    {difficulty}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(groupedLoots).map(([bossId, difficulties]) => (
                            <tr key={bossId} className="border-t">
                                <td className="p-2 font-semibold">{bossId}</td>
                                {allDifficulties.map((difficulty) => (
                                    <td key={difficulty} className="p-2">
                                        <div className="flex flex-wrap gap-1">
                                            {difficulties[difficulty]?.map((loot, index) => (
                                                <WowItemIcon
                                                    key={index}
                                                    item={loot.item}
                                                    iconOnly={true}
                                                    raidDiff={loot.raidDifficulty}
                                                    className="mt-1"
                                                    iconClassName="object-cover object-top rounded-lg h-7 w-7 border border-background"
                                                />
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
