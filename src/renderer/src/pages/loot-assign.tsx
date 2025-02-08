import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs'
import LootsEligibleChars from '@renderer/components/loots-eligible-chars'
import { WowClassIcon } from '@renderer/components/ui/wowclass-icon'
import { WowItemIcon } from '@renderer/components/ui/wowitem-icon'
import { fetchLatestDroptimizers } from '@renderer/lib/tanstack-query/droptimizers'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { getLootsBySessions } from '@renderer/lib/tanstack-query/loots'
import { fetchCharacters } from '@renderer/lib/tanstack-query/players'
import { fetchRaidSessions } from '@renderer/lib/tanstack-query/raid'
import { formatUnixTimestampForDisplay } from '@renderer/lib/utils'
import { LootWithItem } from '@shared/types/types'
import { useQuery } from '@tanstack/react-query'
import { Calendar, LoaderCircle, Users } from 'lucide-react'
import { useEffect, useState } from 'react'

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
    const [selectedSessions, setSelectedSessions] = useState<Set<string>>(new Set())
    const [selectedLoot, setSelectedLoot] = useState<LootWithItem | null>(null)

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

    useEffect(() => {
        // update selected loot when loots are fetched / refetched
        if (selectedLoot && lootsQuery.data) {
            const updatedLoot = lootsQuery.data.find((loot) => loot.id === selectedLoot.id)
            setSelectedLoot(updatedLoot ?? null)
        }
    }, [lootsQuery.data, selectedLoot])

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

    const toggleSession = async (sessionId) => {
        const newSelectedSessions = new Set(selectedSessions)

        if (newSelectedSessions.has(sessionId)) {
            newSelectedSessions.delete(sessionId)
        } else {
            newSelectedSessions.add(sessionId)
        }

        setSelectedSessions(newSelectedSessions)
    }

    const getCharacterDetails = (characterId) => {
        return characters.find((c) => c.id === characterId)
    }

    const renderLoots = (slot) => {
        const filteredLoots = loots.filter((loot) => loot.item.slot === slot)
        if (filteredLoots.length === 0) {
            return <p className="text-gray-400">No loot in this category</p>
        }

        return filteredLoots.map((loot, index) => {
            const characterDetails = getCharacterDetails(loot.assignedCharacterId)
            const isSelected = selectedLoot && selectedLoot.id === loot.id
            return (
                <div
                    key={index}
                    className={`flex flex-row justify-between border-b border-gray-700 py-2 cursor-pointer hover:bg-gray-700 p-2 rounded-md ${isSelected ? 'bg-gray-700' : ''}`}
                    onClick={(e) => {
                        e.preventDefault()
                        setSelectedLoot(loot)
                    }}
                >
                    <WowItemIcon
                        key={index}
                        item={loot.item}
                        iconOnly={false}
                        raidDiff={loot.raidDifficulty}
                        bonusString={loot.bonusString}
                        socketBanner={loot.socket}
                        tierBanner={true}
                        iconClassName="object-cover object-top rounded-lg h-7 w-7 border border-background"
                    />

                    {/* Assign to */}
                    {characterDetails && (
                        <div className="flex flex-row space-x-4 items-center ">
                            <p className="text-sm -mr-2">{characterDetails.name}</p>
                            <WowClassIcon
                                wowClassName={characterDetails.class}
                                charname={characterDetails.name}
                                className="h-8 w-8 border-2 border-background rounded-lg"
                            />
                        </div>
                    )}
                </div>
            )
        })
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
                {selectedSessions && selectedSessions.size > 0 ? (
                    <>
                        <div className="flex flex-col pr-5">
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
                                        {renderLoots(slot)}
                                    </TabsContent>
                                ))}
                            </Tabs>
                        </div>
                        {/* Eligible Chars Panel */}
                        <div className="flex flex-col w-full bg-muted p-4 rounded-lg">
                            <LootsEligibleChars
                                roster={characters}
                                droptimizers={droptimizers}
                                selectedLoot={selectedLoot}
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
