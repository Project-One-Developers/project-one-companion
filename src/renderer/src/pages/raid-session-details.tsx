import * as Select from '@radix-ui/react-select'
import { Separator } from '@radix-ui/react-separator'
import { Button } from '@renderer/components/ui/button'
import { Input } from '@renderer/components/ui/input'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { fetchRaidSession } from '@renderer/lib/tanstack-query/raid'
import { Item } from '@shared/types/types'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Edit, Plus, Users } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const mockLoot: Item[] = []

export const RaidSessionDetailsPage = () => {
    const { raidSessionId } = useParams<{ raidSessionId: string }>()
    const navigate = useNavigate()
    // const queryClient = useQueryClient()
    // const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null)
    const [lootItem, setLootItem] = useState('')
    const [assignCharacter, setAssignCharacter] = useState('')

    const {
        data: raidSession,
        isLoading,
        isError
    } = useQuery({
        queryKey: [queryKeys.players, raidSessionId],
        queryFn: () => fetchRaidSession(raidSessionId),
        enabled: !!raidSessionId
    })

    const handleAddLootItem = () => {
        if (lootItem) {
            //insertLootItemMutation.mutate({ raidSessionId, item: lootItem })
            setLootItem('')
        }
    }

    const handleAssignItem = () => {
        if (assignCharacter && lootItem) {
            setAssignCharacter('')
            setLootItem('')
        }
    }

    const handleUpdateRoster = (newRoster: string) => {
        console.log(newRoster)
        //updateRosterMutation.mutate({ raidSessionId, roster: newRoster })
    }

    if (isLoading) return <div className="text-center p-8">Loading raid session details...</div>
    if (isError)
        return (
            <div className="text-center p-8 text-red-500">Error loading raid session details.</div>
        )
    if (!raidSession) return null

    return (
        <div className=" text-gray-100 min-h-screen p-8">
            <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <h1 className="text-3xl font-bold mb-6">{raidSession.name}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <section className="bg-gray-800 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                        <Users className="mr-2" /> Roster
                    </h2>
                    <ul className="space-y-2 mb-4">
                        {raidSession.roster.map((character) => (
                            <li key={character.id} className="bg-gray-700 p-2 rounded">
                                {character.name}
                            </li>
                        ))}
                    </ul>
                    <Button onClick={() => handleUpdateRoster('Update')}>
                        <Edit className="mr-2 h-4 w-4" /> Edit Roster
                    </Button>
                </section>

                <section className="bg-gray-800 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4">Looted Items</h2>
                    <ul className="space-y-2 mb-4">
                        {mockLoot.map((item, index) => (
                            <li key={index} className="bg-gray-700 p-2 rounded">
                                {item.name} - Assigned to: Unassigned
                            </li>
                        ))}
                    </ul>
                    <div className="flex space-x-2">
                        <Input
                            type="text"
                            value={lootItem}
                            placeholder="Add item"
                            onChange={(e) => setLootItem(e.target.value)}
                        />
                        <Button onClick={handleAddLootItem}>
                            <Plus className="mr-2 h-4 w-4" /> Add Loot
                        </Button>
                    </div>
                </section>

                <section className="bg-gray-800 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4">Assign Loot</h2>
                    <div className="space-y-4">
                        <Input
                            type="text"
                            value={lootItem}
                            placeholder="Item"
                            onChange={(e) => setLootItem(e.target.value)}
                        />
                        <Select.Root value={assignCharacter} onValueChange={setAssignCharacter}>
                            <Select.Trigger className="w-full">
                                <Select.Value placeholder="Select character" />
                            </Select.Trigger>
                            <Select.Content>
                                {raidSession.roster.map((character) => (
                                    <Select.Item key={character.id} value={character.id}>
                                        {character.name}
                                    </Select.Item>
                                ))}
                            </Select.Content>
                        </Select.Root>
                        <Button onClick={handleAssignItem} className="w-full">
                            Assign Item
                        </Button>
                    </div>
                </section>

                <section className="bg-gray-800 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4">Recap</h2>
                    <p>Total items looted: {mockLoot.length}</p>
                    <Separator className="my-2" />
                    <p>Assigned items: 0</p>
                    <p>Unassigned items: 0</p>
                </section>
            </div>
        </div>
    )
}
