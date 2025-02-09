import LootsEligibleChars from '@renderer/components/loots-eligible-chars'
import LootsTabs from '@renderer/components/loots-tab'
import SessionCard from '@renderer/components/session-card'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { getLootsBySessions } from '@renderer/lib/tanstack-query/loots'
import { fetchRaidSessions } from '@renderer/lib/tanstack-query/raid'
import { LootWithItemAndAssigned } from '@shared/types/types'
import { useQuery } from '@tanstack/react-query'
import { LoaderCircle } from 'lucide-react'
import { useState } from 'react'

export default function LootAssign() {
    const [selectedSessions, setSelectedSessions] = useState<Set<string>>(new Set())
    const [selectedLoot, setSelectedLoot] = useState<LootWithItemAndAssigned | null>(null)

    const raidSessionsQuery = useQuery({
        queryKey: [queryKeys.raidSessionsWithLoots],
        queryFn: fetchRaidSessions
    })

    const lootsQuery = useQuery({
        queryKey: [queryKeys.lootsBySession, Array.from(selectedSessions)],
        queryFn: () => getLootsBySessions(Array.from(selectedSessions)),
        enabled: selectedSessions && selectedSessions.size > 0
    })

    if (raidSessionsQuery.isLoading || lootsQuery.isLoading) {
        return (
            <div className="flex flex-col items-center w-full justify-center mt-10 mb-10">
                <LoaderCircle className="animate-spin text-5xl" />
            </div>
        )
    }

    const sessions = raidSessionsQuery.data ?? []
    const loots = lootsQuery.data ?? []

    const toggleSession = (sessionId: string) => {
        const newSelectedSessions = new Set(selectedSessions)

        if (newSelectedSessions.has(sessionId)) {
            newSelectedSessions.delete(sessionId)
        } else {
            newSelectedSessions.add(sessionId)
        }

        setSelectedSessions(newSelectedSessions)
        setSelectedLoot(null)
    }

    return (
        <div className="w-dvw h-dvh flex flex-col gap-y-8 p-8 relative">
            {/* Page Header */}
            <div className=" bg-muted rounded-lg p-6 mb-2 shadow-lg flex items-center">
                {sessions.map((session) => (
                    <div key={session.id} onClick={() => toggleSession(session.id)}>
                        <SessionCard
                            session={session}
                            className={` ${selectedSessions.has(session.id) ? 'border border-primary' : ''}`}
                        />
                    </div>
                ))}
            </div>

            <div className="flex">
                {selectedSessions && selectedSessions.size > 0 ? (
                    <>
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
                    </>
                ) : (
                    <div className="flex flex-col w-full bg-muted p-4 rounded-lg">
                        <p className="text-gray-400">Select a session to start browsing loots</p>
                    </div>
                )}
            </div>
        </div>
    )
}
