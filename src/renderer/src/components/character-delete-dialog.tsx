import { queryClient } from '@renderer/lib/tanstack-query/client'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { deleteCharacter } from '@renderer/lib/tanstack-query/players'
import { Character } from '@shared/types/types'
import { useMutation } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { type JSX } from 'react'
import { useNavigate } from 'react-router'
import { toast } from './hooks/use-toast'
import { Button } from './ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogOverlay,
    DialogPortal,
    DialogTitle
} from './ui/dialog'

type CharacterDeleteDialogProps = {
    isOpen: boolean
    setOpen: (open: boolean) => void
    character: Character
}

export default function CharacterDeleteDialog({
    isOpen,
    setOpen,
    character
}: CharacterDeleteDialogProps): JSX.Element {
    const navigate = useNavigate()

    const deleteMutation = useMutation({
        mutationFn: deleteCharacter,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKeys.charactersSummary] })
            navigate(`/roster`) // go to roster page
        },
        onError: error => {
            toast({
                title: 'Error',
                description: `Unable to delete the character. Error: ${error.message}`
            })
        }
    })

    const handleDeleteSession = () => {
        console.log(`Deleting chracter with ID: ${character.id}`)
        deleteMutation.mutate(character.id)
    }

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogPortal>
                <DialogOverlay />
                <DialogContent>
                    <DialogTitle>Delete Character</DialogTitle>
                    <DialogDescription>
                        The character <strong>{character.name}</strong> and relative data will be
                        permanently deleted from the database
                    </DialogDescription>
                    <Button
                        variant="destructive"
                        disabled={deleteMutation.isPending}
                        onClick={handleDeleteSession}
                    >
                        {deleteMutation.isPending ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            'Confirm'
                        )}
                    </Button>
                </DialogContent>
            </DialogPortal>
        </Dialog>
    )
}
