import CharacterDeleteDialog from '@renderer/components/character-delete-dialog'
import CharacterDialog from '@renderer/components/character-dialog'
import { CharGameInfoPanel } from '@renderer/components/character-game-info-panel'
import { Button } from '@renderer/components/ui/button'
import { WowCharacterLink } from '@renderer/components/ui/wowcharacter-links'
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
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    const characterQuery = useQuery({
        queryKey: [queryKeys.character, characterId],
        queryFn: () => fetchCharacter(characterId),
        enabled: !!characterId
    })

    if (!characterQuery.data) return null
    if (characterQuery.isLoading) {
        return (
            <div className="flex flex-col items-center w-full justify-center mt-10 mb-10">
                <LoaderCircle className="animate-spin text-5xl" />
            </div>
        )
    }

    const character = characterQuery.data

    return (
        <div className="w-dvw h-dvh overflow-y-auto flex flex-col gap-y-8 p-8 relative">
            {/* Page Header with integrated back button */}
            <div className="bg-muted rounded-lg p-6 mb-2 shadow-lg flex justify-between items-center">
                <div className="flex items-center gap-4">
                    {/* Back button integrated into header */}
                    <Button
                        variant="ghost"
                        onClick={() => navigate(-1)}
                        className="hover:bg-gray-800 p-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <div className="flex flex-row space-x-4">
                            <WowClassIcon
                                wowClassName={character.class}
                                charname={character.name}
                                className="h-10 w-10 border-2 border-background rounded-lg"
                            />
                            <h1 className="text-3xl font-bold mb-2">{character.name}</h1>
                        </div>
                        <div className="flex flex-row mt-2 gap-1">
                            <WowCharacterLink character={character} site="warcraftlogs" />
                            <WowCharacterLink character={character} site="raiderio" />
                            <WowCharacterLink character={character} site="armory" />
                        </div>
                    </div>
                </div>
                <div className="flex space-x-2">
                    {/* Edit and Delete buttons remain the same */}
                    <Button
                        variant="secondary"
                        className="hover:bg-blue-700"
                        onClick={() => {
                            setIsEditDialogOpen(true)
                        }}
                    >
                        <Edit className="mr-2 h-4 w-4" /> Edit
                    </Button>
                    <CharacterDialog
                        isOpen={isEditDialogOpen}
                        setOpen={setIsEditDialogOpen}
                        mode="edit"
                        player={character.player}
                        existingCharacter={character}
                    />
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

            {/* Body content */}
            <CharGameInfoPanel character={character} />
        </div>
    )
}
