import { zodResolver } from '@hookform/resolvers/zod'
import { queryClient } from '@renderer/lib/tanstack-query/client'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { addPlayer, editPlayer } from '@renderer/lib/tanstack-query/players'
import { newPlayerSchema } from '@shared/schemas/characters.schemas'
import { NewPlayer, Player } from '@shared/types/types'
import { useMutation } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { type JSX } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from './hooks/use-toast'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'

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
    if (isEditing) {
        console.log(`Editing player with ID: ${existingPlayer.id}`)
    }

    const addMutation = useMutation({
        mutationFn: addPlayer,
        onSuccess: (_, arg) => {
            queryClient.invalidateQueries({ queryKey: [queryKeys.players] })
            form.reset()
            setOpen(false)
            toast({
                title: 'Player added',
                description: `The player ${arg} has been successfully added.`
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
                queryKey: [queryKeys.raidSession, arg.id]
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

    const form = useForm<NewPlayer>({
        resolver: zodResolver(newPlayerSchema),
        defaultValues: {
            name: ''
        }
    })

    function onSubmit(values: NewPlayer): void {
        if (isEditing) {
            editMutation.mutate({ id: existingPlayer.id, ...values })
        } else {
            addMutation.mutate(values)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>New player</DialogTitle>
                    <DialogDescription>
                        Enter only the player&apos;s nickname. Characters played should be added
                        later and must be named as they are in the game.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            disabled={addMutation.isPending || editMutation.isPending}
                            type="submit"
                        >
                            {addMutation.isPending || editMutation.isPending ? (
                                <Loader2 className="animate-spin" />
                            ) : (
                                'Confirm'
                            )}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
