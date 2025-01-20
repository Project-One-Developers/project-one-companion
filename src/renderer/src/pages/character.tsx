import CharacterDeleteDialog from '@renderer/components/character-delete-dialog'
import { Button } from '@renderer/components/ui/button'
import { WowClassIcon } from '@renderer/components/ui/wowclass-icon'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { fetchCharacter } from '@renderer/lib/tanstack-query/players'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Edit, LoaderCircle, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export const CharacterPage = () => {
    const { characterId } = useParams<{ characterId: string }>()
    const navigate = useNavigate()

    // dialog
    // const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    const { data: character, isLoading } = useQuery({
        queryKey: [queryKeys.character, characterId],
        queryFn: () => fetchCharacter(characterId),
        enabled: !!characterId
    })

    if (!character) return null

    if (isLoading) {
        return (
            <div className="flex flex-col items-center w-full justify-center mt-10 mb-10">
                <LoaderCircle className="animate-spin text-5xl" />
            </div>
        )
    }

    return (
        <div className="w-dvw h-dvh overflow-y-auto flex flex-col gap-y-8 p-8 relative">
            {/* Back to Roster */}
            <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 hover:bg-gray-800">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>

            {/* Page Header */}
            <div className="bg-muted rounded-lg p-6 mb-2 shadow-lg flex justify-between items-center">
                <div>
                    <div className="flex flex-row space-x-4 ">
                        <WowClassIcon
                            wowClassName={character.class}
                            charname={character.name}
                            className="h-10 w-10 border-2 border-background rounded-lg"
                        />
                        <h1 className="text-3xl font-bold mb-2">{character.name}</h1>
                    </div>
                    <div className="flex flex-row mt-2 gap-1">
                        <img
                            className="cursor-pointer h-5 w-5"
                            src="https://assets.rpglogs.com/img/warcraft/favicon.png?v=2"
                        />
                        <img
                            className="cursor-pointer h-5 w-5"
                            src="https://cdn.raiderio.net/images/mstile-150x150.png"
                        />
                        <img
                            className="cursor-pointer h-5 w-5"
                            src="https://cdn.raiderio.net/assets/img/wow-icon-a718385c1d75ca9edbb3eed0a5546c30.png"
                        />
                    </div>
                </div>
                <div className="flex space-x-2">
                    {/* Edit Session */}
                    <Button
                        variant="secondary"
                        className="hover:bg-blue-700"
                        // onClick={() => {
                        //     setIsEditDialogOpen(true)
                        // }}
                    >
                        <Edit className="mr-2 h-4 w-4" /> Edit
                    </Button>
                    {/* <CharacterDialog
                        isOpen={isEditDialogOpen}
                        setOpen={setIsDeleteDialogOpen}
                        playerName={character.playerName}
                        character={character}
                    /> */}
                    {/* Delete Character */}
                    <Button
                        variant="destructive"
                        className="hover:bg-red-700"
                        onClick={() => {
                            setIsDeleteDialogOpen(true)
                        }}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                    <CharacterDeleteDialog
                        isOpen={isDeleteDialogOpen}
                        setOpen={setIsDeleteDialogOpen}
                        character={character}
                    />
                </div>
            </div>
        </div>
    )
}
