import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { getLootsBySession } from '@renderer/lib/tanstack-query/loots'
import { useQuery } from '@tanstack/react-query'
import { LoaderCircle } from 'lucide-react'
import { WowItemIcon } from './ui/wowitem-icon'

type SessionLootsPanelProps = {
    raidSessionId: string
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

    return (
        <div className="bg-muted p-6 rounded-lg shadow-md">
            <ul className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                {loots.length > 0 ? (
                    loots.map((loot, index) => (
                        // <li
                        //     key={index}
                        //     className="bg-gray-700 p-3 rounded-lg flex justify-between items-center"
                        // >
                        //     <span>{loot.item.name}</span>
                        //     <span className="text-gray-400">Unassigned</span>
                        // </li>

                        <WowItemIcon
                            key={index}
                            item={loot.item}
                            iconOnly={true}
                            raidDiff={loot.raidDifficulty}
                            className="mt-2"
                            iconClassName="object-cover object-top rounded-full h-10 w-10 border border-background"
                        />
                    ))
                ) : (
                    <li className="text-gray-400 text-center py-4">No items looted yet</li>
                )}
            </ul>
        </div>
    )
}
