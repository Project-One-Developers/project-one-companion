import * as Dialog from '@radix-ui/react-dialog'
import { toast } from '@renderer/components/hooks/use-toast'
import SessionForm from '@renderer/components/session-form'
import { Button } from '@renderer/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@renderer/components/ui/dropdown-menu'
import { WowClassIcon } from '@renderer/components/ui/wowclass-icon'
import { queryClient } from '@renderer/lib/tanstack-query/client'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import {
    addRaidSessionLootsRcLoot,
    deleteRaidSession,
    editRaidSession,
    fetchRaidSession
} from '@renderer/lib/tanstack-query/raid'
import { ROLE_PRIORITIES } from '@shared/consts/wow.consts'
import { Item, NewRaidSession } from '@shared/types/types'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
    ArrowLeft,
    Calendar,
    ChevronDown,
    Edit,
    LoaderCircle,
    Sword,
    Trash2,
    Users
} from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const mockLoot: Item[] = []

export const RaidSessionDetailsPage = () => {
    const { raidSessionId } = useParams<{ raidSessionId: string }>()
    const navigate = useNavigate()
    const [lootItem, setLootItem] = useState('')
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const { data: raidSession, isLoading } = useQuery({
        queryKey: [queryKeys.raidSession, raidSessionId],
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

    const { mutate: mutateEditSession } = useMutation({
        mutationFn: editRaidSession,
        onSuccess: (_, arg) => {
            queryClient.invalidateQueries({ queryKey: [queryKeys.raidSession, raidSessionId] })
            setIsDialogOpen(false)
            toast({
                title: 'Raid Session edited',
                description: `Raid session ${arg.name} edited successfully`
            })
        },
        onError: (error) => {
            toast({
                title: 'Error',
                description: `Unable to edit the raid session. Error: ${error.message}`
            })
        }
    })

    const handleEditSession = (editedSession: NewRaidSession) => {
        if (raidSessionId) {
            mutateEditSession({ id: raidSessionId, ...editedSession })
        }
    }

    const { mutate: mutateDeleteSession } = useMutation({
        mutationFn: deleteRaidSession,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKeys.raidSessions] })
            navigate(`/raid-session`)
        },
        onError: (error) => {
            toast({
                title: 'Error',
                description: `Unable to delete the raid session. Error: ${error.message}`
            })
        }
    })

    const handleDeleteSession = (sessionId: string) => {
        console.log(`Deleting session with ID: ${sessionId}`)
        if (raidSessionId) {
            mutateDeleteSession(sessionId)
        }
    }

    const handleUpdateRoster = (newRoster: string) => {
        console.log(newRoster)
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center w-full justify-center mt-10 mb-10">
                <LoaderCircle className="animate-spin text-5xl" />
            </div>
        )
    }

    if (!raidSession) return null

    return (
        <div className="w-dvw h-dvh overflow-y-auto flex flex-col gap-y-8 p-8 relative">
            {/* Back to Raid Sessions */}
            <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 hover:bg-gray-800">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>

            {/* Page Header */}
            <div className="bg-muted rounded-lg p-6 mb-8 shadow-lg flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold mb-2 text-blue-400">{raidSession.name}</h1>
                    <div className="flex items-center text-gray-400">
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>{new Date(raidSession.raidDate * 1000).toLocaleString()}</span>
                    </div>
                </div>
                <div className="flex space-x-2">
                    <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <Dialog.Trigger asChild>
                            <Button variant="secondary" className="hover:bg-blue-700">
                                <Edit className="mr-2 h-4 w-4" /> Edit Session
                            </Button>
                        </Dialog.Trigger>
                        <Dialog.Portal>
                            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
                            <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 p-6 rounded-lg shadow-xl">
                                <Dialog.Title className="text-2xl font-bold mb-4">
                                    Edit Session
                                </Dialog.Title>
                                <SessionForm
                                    existingSession={raidSession}
                                    onSubmit={handleEditSession}
                                />
                            </Dialog.Content>
                        </Dialog.Portal>
                    </Dialog.Root>
                    <Button
                        variant="destructive"
                        onClick={() => handleDeleteSession(raidSession.id)}
                        className="hover:bg-red-700"
                    >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete Session
                    </Button>
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
                                    className={`cursor-pointer p-2 rounded ${
                                        !lootItem.trim()
                                            ? 'opacity-50 cursor-not-allowed bg-gray-700'
                                            : 'hover:bg-gray-700'
                                    }`}
                                    // TODO: check if string is some sort of csv input? just a basic check
                                    onSelect={() => lootItem.trim() && handleAddLootItem('import')}
                                    disabled={!lootItem.trim()}
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
            </div>
        </div>
    )
}
