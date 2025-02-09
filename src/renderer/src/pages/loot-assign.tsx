import { toast } from '@renderer/components/hooks/use-toast'
import LootsEligibleChars from '@renderer/components/loots-eligible-chars'
import LootsTabs from '@renderer/components/loots-tab'
import SessionCard from '@renderer/components/session-card'
import { fetchLatestDroptimizers } from '@renderer/lib/tanstack-query/droptimizers'

import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { assignLoot, getLootsBySessions } from '@renderer/lib/tanstack-query/loots'
import { fetchCharacters } from '@renderer/lib/tanstack-query/players'
import { fetchRaidSessions } from '@renderer/lib/tanstack-query/raid'
import { LootWithItem } from '@shared/types/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { LoaderCircle } from 'lucide-react'
import { useCallback, useState } from 'react'

export default function LootAssign() {
    const [selectedSessions, setSelectedSessions] = useState<Set<string>>(new Set())
    const [selectedLoot, setSelectedLoot] = useState<LootWithItem | null>(null)
    const queryClient = useQueryClient()

    const raidSessionsQuery = useQuery({
        queryKey: [queryKeys.raidSessionsWithLoots],
        queryFn: fetchRaidSessions
    })

    const charactersQuery = useQuery({
        queryKey: [queryKeys.characters],
        queryFn: fetchCharacters
    })

    const droptimizerRes = useQuery({
        queryKey: [queryKeys.droptimizers],
        queryFn: fetchLatestDroptimizers
    })

    const lootsQuery = useQuery({
        queryKey: [queryKeys.lootsBySession, Array.from(selectedSessions)],
        queryFn: () => getLootsBySessions(Array.from(selectedSessions)),
        enabled: selectedSessions && selectedSessions.size > 0
    })

    const assignLootMutation = useMutation({
        mutationFn: ({
            charId,
            lootId,
            score
        }: {
            charId: string
            lootId: string
            score?: number
        }) => assignLoot(charId, lootId, score),
        onError: (error) => {
            toast({
                title: 'Error',
                description: `Unable to assign loot. Error: ${error.message}`
            })
            queryClient.invalidateQueries({ queryKey: [queryKeys.lootsBySession] })
        }
    })

    const handleItemAssign = useCallback(
        (charId: string, lootId: string, score: number) => {
            if (selectedLoot) {
                const updatedLoot = { ...selectedLoot, assignedCharacterId: charId }
                setSelectedLoot(updatedLoot)

                assignLootMutation.mutate({ charId, lootId, score })
            }
        },
        [selectedLoot, assignLootMutation]
    )

    if (raidSessionsQuery.isLoading || charactersQuery.isLoading) {
        return (
            <div className="flex flex-col items-center w-full justify-center mt-10 mb-10">
                <LoaderCircle className="animate-spin text-5xl" />
            </div>
        )
    }

    const sessions = raidSessionsQuery.data ?? []
    const characters = charactersQuery.data ?? []
    const droptimizers = droptimizerRes.data ?? []
    const loots = lootsQuery.data ?? []

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
                                roster={characters}
                                selectedLoot={selectedLoot}
                                setSelectedLoot={setSelectedLoot}
                            />
                        </div>
                        <div className="flex flex-col w-full bg-muted p-4 rounded-lg">
                            <LootsEligibleChars
                                roster={characters}
                                droptimizers={droptimizers}
                                selectedLoot={selectedLoot}
                                onItemAssign={handleItemAssign}
                            />
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
