import LootsEligibleChars from '@renderer/components/loots-eligible-chars'
import LootsTabs from '@renderer/components/loots-tab'
import LootsTradeHelperDialog from '@renderer/components/loots-trade-helper'
import SessionCard from '@renderer/components/session-card'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@renderer/components/ui/dropdown-menu'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { getLootsWithAssignedBySessions } from '@renderer/lib/tanstack-query/loots'
import { fetchRaidSessions } from '@renderer/lib/tanstack-query/raid'
import { LootWithAssigned } from '@shared/types/types'
import { useQuery } from '@tanstack/react-query'
import { LoaderCircle, MoreVertical } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

export default function LootAssign() {
    const [selectedSessions, setSelectedSessions] = useState<Set<string>>(new Set())
    const [selectedLoot, setSelectedLoot] = useState<LootWithAssigned | null>(null)
    // dialog
    const [lootHelperDialogOpen, setLootHelperDialogOpen] = useState(false)

    const raidSessionsQuery = useQuery({
        queryKey: [queryKeys.raidSessionsWithLoots],
        queryFn: fetchRaidSessions
    })

    const lootsQuery = useQuery({
        queryKey: [queryKeys.lootsBySession, Array.from(selectedSessions)],
        queryFn: () => getLootsWithAssignedBySessions(Array.from(selectedSessions)),
        enabled: selectedSessions.size > 0,
        refetchInterval: 10000 // Refetch every 10 seconds - TODO: update with server side events
    })

    // Update selectedLoot.assignedCharacterId if changed in backend
    useEffect(() => {
        if (!selectedLoot || !lootsQuery.data) return

        // Find the latest version of the selected loot
        const updatedLoot = lootsQuery.data.find((loot) => loot.id === selectedLoot.id)
        if (!updatedLoot) {
            setSelectedLoot(null)
        } else if (updatedLoot.assignedCharacterId !== selectedLoot.assignedCharacterId) {
            setSelectedLoot(updatedLoot) // Update state with the latest data
        }
    }, [lootsQuery.data, selectedLoot])

    const sortedSessions = useMemo(
        () =>
            raidSessionsQuery.data
                ? [...raidSessionsQuery.data].sort((a, b) => b.raidDate - a.raidDate)
                : [],
        [raidSessionsQuery.data]
    )

    const loots = useMemo(() => lootsQuery.data ?? [], [lootsQuery.data])

    if (raidSessionsQuery.isLoading || lootsQuery.isLoading) {
        return (
            <div className="flex flex-col items-center w-full justify-center mt-10 mb-10">
                <LoaderCircle className="animate-spin text-5xl" />
            </div>
        )
    }

    const toggleSession = (sessionId: string) => {
        const newSelectedSessions = new Set(selectedSessions)
        if (newSelectedSessions.has(sessionId)) {
            newSelectedSessions.delete(sessionId)
        } else {
            newSelectedSessions.add(sessionId)
        }
        setSelectedSessions(newSelectedSessions)
    }

    return (
        <div className="w-dvw h-dvh flex flex-col gap-y-8 p-8 relative">
            {/* Page Header */}
            <div className="flex bg-muted rounded-lg p-6 mb-2 shadow-lg items-center relative">
                {sortedSessions.map((session) => (
                    <div key={session.id} onClick={() => toggleSession(session.id)}>
                        <SessionCard
                            session={session}
                            className={` ${selectedSessions.has(session.id) ? 'border border-primary' : ''}`}
                        />
                    </div>
                ))}
                <div className="absolute top-4 right-6">
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            className="p-2 rounded hover:bg-gray-700"
                            aria-label="More options"
                        >
                            <MoreVertical className="h-5 w-5" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => setLootHelperDialogOpen(true)}
                            >
                                Display Trade Helper
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <LootsTradeHelperDialog
                    isOpen={lootHelperDialogOpen}
                    setOpen={setLootHelperDialogOpen}
                    loots={loots}
                />
            </div>

            {selectedSessions.size > 0 ? (
                <div className="flex w-full">
                    <div className="flex flex-col pr-5">
                        <LootsTabs
                            loots={loots}
                            selectedLoot={selectedLoot}
                            setSelectedLoot={setSelectedLoot}
                        />
                    </div>
                    <div className="flex flex-col w-full bg-muted p-4 rounded-lg">
                        {selectedLoot ? (
                            <LootsEligibleChars
                                allLoots={loots}
                                selectedLoot={selectedLoot}
                                setSelectedLoot={setSelectedLoot}
                            />
                        ) : (
                            <p className="text-gray-400">Select a loot to start assigning</p>
                        )}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col w-full bg-muted p-4 rounded-lg">
                    <p className="text-gray-400">Select a session to start browsing loots</p>
                </div>
            )}
        </div>
    )
}
