import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { getLootsBySession } from '@renderer/lib/tanstack-query/loots'
import { fetchCharacters } from '@renderer/lib/tanstack-query/players'
import { fetchRaidSessions } from '@renderer/lib/tanstack-query/raid'
import { formatUnixTimestampForDisplay } from '@renderer/lib/utils'
import { LootWithItem } from '@shared/types/types'
import { useQuery } from '@tanstack/react-query'
import { Calendar, LoaderCircle, Users } from 'lucide-react'
import { useState } from 'react'

const SLOT_CATEGORIES = [
    'Head',
    'Neck',
    'Shoulder',
    'Back',
    'Chest',
    'Wrist',
    'Hands',
    'Waist',
    'Legs',
    'Feet',
    'Finger',
    'Trinket',
    'MainHand',
    'OffHand'
]

export default function LootAssign() {
    const [selectedSessions, setSelectedSessions] = useState(new Set())
    const [loots, setLoots] = useState<LootWithItem[]>([])
    const [selectedLoot, setSelectedLoot] = useState<LootWithItem | null>(null)

    const raidSessionsQuery = useQuery({
        queryKey: [queryKeys.raidSessionsWithLoots],
        queryFn: fetchRaidSessions
    })

    const charactersQuery = useQuery({
        queryKey: [queryKeys.characters],
        queryFn: fetchCharacters
    })

    if (raidSessionsQuery.isLoading || charactersQuery.isLoading) {
        return (
            <div className="flex flex-col items-center w-full justify-center mt-10 mb-10">
                <LoaderCircle className="animate-spin text-5xl" />
            </div>
        )
    }

    const sessions = raidSessionsQuery.data ?? []
    const characters = charactersQuery.data ?? []

    const toggleSession = async (sessionId) => {
        const newSelectedSessions = new Set(selectedSessions)
        let updatedLoots = [...loots]

        if (newSelectedSessions.has(sessionId)) {
            newSelectedSessions.delete(sessionId)
            updatedLoots = updatedLoots.filter((loot) => loot.raidSessionId !== sessionId)
        } else {
            newSelectedSessions.add(sessionId)
            const newLoots = await getLootsBySession(sessionId)
            updatedLoots = [...updatedLoots, ...newLoots.map((loot) => ({ ...loot, sessionId }))]
        }

        setSelectedSessions(newSelectedSessions)
        setLoots(updatedLoots)
    }

    return (
        <div className="w-dvw h-dvh flex flex-col gap-y-8 p-8 relative">
            {/* Page Header */}
            <div className=" bg-muted rounded-lg p-6 mb-2 shadow-lg flex items-center">
                {sessions.map((session) => (
                    <div
                        key={session.id}
                        className={`bg-muted p-4 rounded-lg shadow-md cursor-pointer hover:bg-gray-700 transition-colors flex-shrink-0 w-64 ${selectedSessions.has(session.id) ? 'border border-primary' : ''}`}
                        onClick={() => toggleSession(session.id)}
                    >
                        <h3 className="text-xl font-bold mb-2">{session.name}</h3>
                        <div className="flex items-center text-gray-400 mb-1">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>{formatUnixTimestampForDisplay(session.raidDate)}</span>
                        </div>
                        <div className="flex items-center text-gray-400">
                            <Users className="w-4 h-4 mr-2" />
                            <span>{session.roster.length} participants</span>
                        </div>
                    </div>
                ))}
            </div>

            {/*  Body */}

            <div className="flex">
                <div className="w-2/3 pr-5">
                    <Tabs defaultValue="Head">
                        <TabsList className="flex space-x-2 overflow-x-auto pb-2">
                            {SLOT_CATEGORIES.map((slot) => (
                                <TabsTrigger
                                    key={slot}
                                    value={slot}
                                    className="flex flex-col items-start gap-1 py-2 hover:bg-muted data-[state=active]:border-b-2 data-[state=active]:border-primary"
                                >
                                    {slot}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                        {SLOT_CATEGORIES.map((slot) => (
                            <TabsContent
                                key={slot}
                                value={slot}
                                className="bg-muted p-4 rounded-lg shadow-md mt-2"
                            >
                                {loots.filter((loot) => loot.item.slot === slot).length > 0 ? (
                                    loots
                                        .filter((loot) => loot.item.slot === slot)
                                        .map((loot, index) => (
                                            <div
                                                key={index}
                                                className="border-b border-gray-700 py-2 cursor-pointer hover:bg-gray-700 p-2 rounded-md"
                                                onClick={() => setSelectedLoot(loot)}
                                            >
                                                {loot.item.name} - {loot.item.id}
                                            </div>
                                        ))
                                ) : (
                                    <p className="text-gray-400">No loot in this category</p>
                                )}
                            </TabsContent>
                        ))}
                    </Tabs>
                </div>
                <div className="w-1/3 bg-muted p-4 rounded-lg">
                    <h3 className="text-xl font-bold mb-4">Assign Loot</h3>
                    {selectedLoot ? (
                        <>
                            <p className="text-lg font-semibold mb-2">{selectedLoot.item.name}</p>
                            <div className="flex flex-wrap gap-4">
                                {characters.map((character) => (
                                    <div
                                        key={character.id}
                                        className="cursor-pointer p-4 bg-gray-800 rounded-lg hover:bg-gray-700"
                                    >
                                        {character.name}
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <p className="text-gray-400">Select an item to assign</p>
                    )}
                </div>
            </div>
        </div>
    )
}
