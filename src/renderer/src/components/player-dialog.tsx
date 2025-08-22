import { queryClient } from '@renderer/lib/tanstack-query/client'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { addPlayer, editPlayer } from '@renderer/lib/tanstack-query/players'
import type { NewPlayer, Player } from '@shared/types/types'
import { useMutation } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useState, useEffect, type JSX } from 'react'
import { toast } from './hooks/use-toast'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'

type PlayerDialogProps = {
    isOpen: boolean
    setOpen: (open: boolean) => void
    existingPlayer?: Player
}

export default function PlayerDialog({
    isOpen,
    setOpen,
    existingPlayer
}: PlayerDialogProps): JSX.Element {
    const isEditing = existingPlayer != null

    // Form state
    const [playerName, setPlayerName] = useState('')
    const [nameError, setNameError] = useState('')

    // Initialize form data when dialog opens or player changes
    useEffect(() => {
        if (isEditing && existingPlayer) {
            setPlayerName(existingPlayer.name)
        } else {
            setPlayerName('')
        }
        setNameError('')
    }, [isEditing, existingPlayer, isOpen])

    if (isEditing) {
        console.log(`Editing player with ID: ${existingPlayer.id}`)
    }

    const addMutation = useMutation({
        mutationFn: addPlayer,
        onSuccess: (_, arg) => {
            queryClient.invalidateQueries({ queryKey: [queryKeys.playersSummary] })
            resetForm()
            setOpen(false)
            toast({
                title: 'Player added',
                description: `The player ${arg.name} has been successfully added.`
            })
        },
        onError: error => {
            toast({
                title: 'Error',
                description: `Unable to add the player. Error: ${error.message}`
            })
        }
    })

    const editMutation = useMutation({
        mutationFn: editPlayer,
        onSuccess: (_, arg) => {
            queryClient.invalidateQueries({
                queryKey: [queryKeys.playersSummary]
            })
            setOpen(false)
            toast({
                title: 'Player edited',
                description: `Player ${arg.name} edited successfully`
            })
        },
        onError: error => {
            toast({
                title: 'Error',
                description: `Unable to edit the player. Error: ${error.message}`
            })
        }
    })

    const resetForm = () => {
        setPlayerName('')
        setNameError('')
    }

    const validateForm = (): boolean => {
        const trimmedName = playerName.trim()

        if (!trimmedName) {
            setNameError('Name is required')
            return false
        }

        setNameError('')
        return true
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        const playerData: NewPlayer = {
            name: playerName.trim()
        }

        if (isEditing && existingPlayer) {
            editMutation.mutate({ id: existingPlayer.id, ...playerData })
        } else {
            addMutation.mutate(playerData)
        }
    }

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPlayerName(e.target.value)
        // Clear error when user starts typing
        if (nameError) {
            setNameError('')
        }
    }

    const isLoading = addMutation.isPending || editMutation.isPending

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Edit' : 'New'} player</DialogTitle>
                    <DialogDescription>
                        Enter only the player&apos;s nickname. Characters played should be added
                        later and must be named as they are in the game.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={playerName}
                            onChange={handleNameChange}
                            className={nameError ? 'border-red-500' : ''}
                            placeholder="Enter player name"
                        />
                        {nameError && <p className="text-sm text-red-500">{nameError}</p>}
                    </div>

                    <Button disabled={isLoading} type="submit">
                        {isLoading ? <Loader2 className="animate-spin" /> : 'Confirm'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
