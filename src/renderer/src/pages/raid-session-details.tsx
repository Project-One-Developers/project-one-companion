import * as Select from '@radix-ui/react-select'
import { Separator } from '@radix-ui/react-separator'
import { toast } from '@renderer/components/hooks/use-toast'
import { Button } from '@renderer/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@renderer/components/ui/dropdown-menu'
import { Input } from '@renderer/components/ui/input'
import { WowClassIcon } from '@renderer/components/ui/wowclass-icon'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { addRaidSessionLootsRcLoot, fetchRaidSession } from '@renderer/lib/tanstack-query/raid'
import { ROLE_PRIORITIES } from '@shared/consts/wow.consts'
import { Item } from '@shared/types/types'
import { useMutation, useQuery } from '@tanstack/react-query'
import { ArrowLeft, Calendar, ChevronDown, Edit, LoaderCircle, Sword, Users } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const mockLoot: Item[] = []

export const RaidSessionDetailsPage = () => {
    const { raidSessionId } = useParams<{ raidSessionId: string }>()
    const navigate = useNavigate()
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

    const { mutate } = useMutation({
        mutationFn: addRaidSessionLootsRcLoot,
        onSuccess: () => {
            //queryClient.invalidateQueries({ queryKey: [queryKeys.raidSessions] })
            //form.reset()
            //setIsDialogOpen(false)
            toast({
                title: 'Loot imported',
                description: `Loots successfully imported from RCLootCouncil`
            })
        },
        onError: (error) => {
            toast({
                title: 'Errore',
                description: `Non è stato possibile creare la raid session. Errore: ${error.message}`
            })
        }
    })

    const handleAddLootItem = (method: string) => {
        switch (method) {
            case 'boss':
                // Logic for selecting from boss
                break
            case 'import':
                // Logic for importing from RCLootCouncil
                console.log('RCIMPORT invoked: ' + raidSessionId + ' - ' + lootItem)
                mutate({ id: raidSessionId, csv: lootItem })
                break
            case 'manual':
                // Logic for manual entry (can use the existing lootItem state)
                if (lootItem) {
                    // Your existing logic for adding an item
                    setLootItem('')
                }
                break
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
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-900">
                <LoaderCircle className="animate-spin text-blue-500 w-16 h-16" />
                <p className="mt-4 text-gray-400">Loading raid session details...</p>
            </div>
        )
    }
    if (isError)
        return (
            <div className="text-center p-8 text-red-500">Error loading raid session details.</div>
        )
    if (!raidSession) return null

    return (
        <div className="w-dvw h-dvh overflow-y-auto flex flex-col gap-y-8 p-8 relative">
            {/* Back to Raid Sessions */}
            <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 hover:bg-gray-800">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>

            {/* Page Header */}
            <div className="bg-muted rounded-lg p-6 mb-8 shadow-lg">
                <h1 className="text-3xl font-bold mb-2 text-blue-400">{raidSession.name}</h1>
                <div className="flex items-center text-gray-400">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>{new Date(raidSession.raidDate * 1000).toLocaleString()}</span>
                </div>
            </div>

            {/* First Row: Roster Panel + Looted Items */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Roster Panel */}
                <section className="bg-muted p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4 flex items-center text-green-400">
                        <Users className="mr-2" /> Roster
                    </h2>
                    <div className="flex flex-wrap gap-4 mb-4">
                        {raidSession.roster
                            .sort(
                                (a, b) =>
                                    ROLE_PRIORITIES[a.role] - ROLE_PRIORITIES[b.role] ||
                                    a.name.localeCompare(b.name)
                            )
                            .map((character) => (
                                <div
                                    key={character.id}
                                    className="flex flex-col min-w-20 items-center rounded-lg cursor-pointer transition-transform hover:scale-125"
                                >
                                    <WowClassIcon
                                        wowClassName={character.class}
                                        className="h-10 w-10 border-2 border-background rounded-lg"
                                    />
                                    <span className="text-xs">{character.name}</span>
                                </div>
                            ))}
                    </div>
                    <Button
                        onClick={() => handleUpdateRoster('Update')}
                        className="w-full bg-green-600 hover:bg-green-700"
                    >
                        <Edit className="mr-2 h-4 w-4" /> Edit Roster
                    </Button>
                </section>

                {/* Looted items Panel */}
                <section className="bg-muted p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4 flex items-center text-yellow-400">
                        <Sword className="mr-2" /> Looted Items
                    </h2>
                    <ul className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                        {mockLoot.length > 0 ? (
                            mockLoot.map((item, index) => (
                                <li
                                    key={index}
                                    className="bg-gray-700 p-3 rounded-lg flex justify-between items-center"
                                >
                                    <span>{item.name}</span>
                                    <span className="text-gray-400">Unassigned</span>
                                </li>
                            ))
                        ) : (
                            <li className="text-gray-400 text-center py-4">No items looted yet</li>
                        )}
                    </ul>
                    <div className="flex space-x-2">
                        <textarea
                            value={lootItem}
                            onChange={(e) => setLootItem(e.target.value)}
                            placeholder="Paste CSV data here"
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-sm text-gray-300 focus:border-blue-500"
                            rows={4}
                        />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="bg-yellow-600 hover:bg-yellow-700">
                                    <Sword className="mr-2 h-4 w-4" /> Add Loot
                                    <ChevronDown className="ml-2 h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-gray-800 p-2 rounded-md shadow-lg">
                                <DropdownMenuItem
                                    className="cursor-pointer p-2 hover:bg-gray-700 rounded"
                                    onSelect={() => handleAddLootItem('boss')}
                                >
                                    Select from Boss
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="cursor-pointer p-2 hover:bg-gray-700 rounded"
                                    onSelect={() => handleAddLootItem('import')}
                                >
                                    Import from RCLootCouncil
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="cursor-pointer p-2 hover:bg-gray-700 rounded"
                                    onSelect={() => handleAddLootItem('manual')}
                                >
                                    Enter Manually
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </section>

                <section className="bg-muted p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4 text-purple-400">Assign Loot</h2>
                    <div className="space-y-4">
                        <Input
                            type="text"
                            value={lootItem}
                            placeholder="Item"
                            onChange={(e) => setLootItem(e.target.value)}
                            className="bg-gray-700 border-gray-600 focus:border-purple-500"
                        />
                        <Select.Root value={assignCharacter} onValueChange={setAssignCharacter}>
                            <Select.Trigger className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:border-purple-500">
                                <Select.Value placeholder="Select character" />
                            </Select.Trigger>
                            <Select.Content className="bg-gray-700 border border-gray-600 rounded-md overflow-hidden">
                                <Select.Viewport className="p-2">
                                    {raidSession.roster.map((character) => (
                                        <Select.Item
                                            key={character.id}
                                            value={character.id}
                                            className="cursor-pointer p-2 rounded hover:bg-gray-600"
                                        >
                                            {character.name}
                                        </Select.Item>
                                    ))}
                                </Select.Viewport>
                            </Select.Content>
                        </Select.Root>
                        <Button
                            onClick={handleAssignItem}
                            className="w-full bg-purple-600 hover:bg-purple-700"
                        >
                            Assign Item
                        </Button>
                    </div>
                </section>

                <section className="bg-muted p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4 text-blue-400">Recap</h2>
                    <p className="mb-2">Total items looted: {mockLoot.length}</p>
                    <Separator className="my-4 bg-gray-700" />
                    <p className="mb-2">Assigned items: 0</p>
                    <p>Unassigned items: {mockLoot.length}</p>
                </section>
            </div>
        </div>
    )
}
