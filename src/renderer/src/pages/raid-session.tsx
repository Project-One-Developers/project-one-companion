import SessionDeleteDialog from '@renderer/components/session-delete-dialog'
import RaidSessionDialog from '@renderer/components/session-dialog'
import SessionLootNewDialog from '@renderer/components/session-loot-new-dialog'
import { Button } from '@renderer/components/ui/button'
import { Separator } from '@renderer/components/ui/separator'
import { WowClassIcon } from '@renderer/components/ui/wowclass-icon'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { fetchRaidSession } from '@renderer/lib/tanstack-query/raid'
import { Item } from '@shared/types/types'
import { useQuery } from '@tanstack/react-query'
import {
    ArrowLeft,
    Calendar,
    Edit,
    Heart,
    LoaderCircle,
    PlusIcon,
    Shield,
    Sword,
    Swords,
    Trash2
} from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const mockLoot: Item[] = []

export const RaidSessionPage = () => {
    const { raidSessionId } = useParams<{ raidSessionId: string }>()
    const navigate = useNavigate()

    // dialog
    const [isAddLootDialogOpen, setIsAddLootDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    const { data: raidSession, isLoading } = useQuery({
        queryKey: [queryKeys.raidSession, raidSessionId],
        queryFn: () => fetchRaidSession(raidSessionId),
        enabled: !!raidSessionId
    })

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
            <div className="bg-muted rounded-lg p-6 mb-2 shadow-lg flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold mb-2 text-blue-400">{raidSession.name}</h1>
                    <div className="flex items-center text-gray-400">
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>{new Date(raidSession.raidDate * 1000).toLocaleString()}</span>
                    </div>
                </div>
                <div className="flex space-x-2">
                    {/* Edit Session */}
                    <Button
                        variant="secondary"
                        className="hover:bg-blue-700"
                        onClick={() => {
                            setIsEditDialogOpen(true)
                        }}
                    >
                        <Edit className="mr-2 h-4 w-4" /> Edit Session
                    </Button>
                    <RaidSessionDialog
                        isOpen={isEditDialogOpen}
                        setOpen={setIsEditDialogOpen}
                        existingSession={raidSession}
                    />
                    {/* Delete Session */}
                    <Button
                        variant="destructive"
                        className="hover:bg-red-700"
                        onClick={() => {
                            setIsDeleteDialogOpen(true)
                        }}
                    >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                    <SessionDeleteDialog
                        isOpen={isDeleteDialogOpen}
                        setOpen={setIsDeleteDialogOpen}
                        raidSession={raidSession}
                    />
                </div>
            </div>

            {/* Roster Panel */}
            <div className="bg-muted p-6 rounded-lg shadow-md">
                {/* Tanks and Healers */}
                <div className="flex mb-4">
                    {/* Tanks */}
                    <div className="flex-1">
                        <div className="flex items-center mb-2">
                            <Shield className="mr-2 h-5 w-5 text-blue-400" />
                            <h3 className="text-lg font-semibold">Tanks</h3>
                        </div>
                        <div className="flex ">
                            {raidSession.roster
                                .filter((character) => character.role === 'Tank')
                                .sort((a, b) => a.class.localeCompare(b.class))
                                .map((character) => (
                                    <div
                                        key={character.id}
                                        className="flex flex-col items-center rounded-lg cursor-pointer transition-transform hover:scale-110"
                                    >
                                        <WowClassIcon
                                            wowClassName={character.class}
                                            className="h-10 w-10 border-2 border-background rounded-lg"
                                        />
                                        <span className="text-xs mt-1">{character.name}</span>
                                    </div>
                                ))}
                        </div>
                    </div>

                    {/* Vertical Separator */}
                    {/* <Separator orientation="vertical" className="mx-4 bg-gray-600" /> */}

                    {/* Healers */}
                    <div className="flex-1">
                        <div className="flex items-center mb-2">
                            <Heart className="mr-2 h-5 w-5 text-green-400" />
                            <h3 className="text-lg font-semibold">Healers</h3>
                        </div>
                        <div className="flex flex-wrap gap-1">
                            {raidSession.roster
                                .filter((character) => character.role === 'Healer')
                                .sort((a, b) => a.class.localeCompare(b.class))
                                .map((character) => (
                                    <div
                                        key={character.id}
                                        className="flex flex-col items-center rounded-lg cursor-pointer transition-transform hover:scale-110"
                                    >
                                        <WowClassIcon
                                            wowClassName={character.class}
                                            className="h-10 w-10 border-2 border-background rounded-lg"
                                        />
                                        <span className="text-xs mt-1">{character.name}</span>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>

                <Separator className="my-4 bg-gray-600" />

                {/* DPS */}
                <div>
                    <div className="flex items-center mb-2">
                        <Swords className="mr-2 h-5 w-5 text-red-400" />
                        <h3 className="text-lg font-semibold">DPS</h3>
                    </div>
                    <div className="flex flex-wrap gap-1">
                        {raidSession.roster
                            .filter((character) => character.role === 'DPS')
                            .sort((a, b) => a.class.localeCompare(b.class))
                            .map((character) => (
                                <div
                                    key={character.id}
                                    className="flex flex-col items-center rounded-lg cursor-pointer transition-transform hover:scale-110"
                                >
                                    <WowClassIcon
                                        wowClassName={character.class}
                                        className="h-10 w-10 border-2 border-background rounded-lg"
                                    />
                                    <span className="text-xs mt-1">{character.name}</span>
                                </div>
                            ))}
                    </div>
                </div>
            </div>

            {/* Looted items Panel */}
            <div className="bg-muted p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold flex items-center text-yellow-400">
                        <Sword className="mr-2" /> Looted Items
                    </h2>
                    <Button
                        variant="outline"
                        className="bg-primary text-background hover:bg-primary/80"
                        onClick={() => setIsAddLootDialogOpen(true)}
                    >
                        <PlusIcon className="mr-2 h-4 w-4" /> Add Loot
                    </Button>
                </div>
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
            </div>

            <SessionLootNewDialog
                isOpen={isAddLootDialogOpen}
                setOpen={setIsAddLootDialogOpen}
                raidSession={raidSession}
            />
        </div>
    )
}
