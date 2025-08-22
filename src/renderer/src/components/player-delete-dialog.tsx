import { queryClient } from '@renderer/lib/tanstack-query/client'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { deletePlayer } from '@renderer/lib/tanstack-query/players'
import type { Player } from '@shared/types/types'
import { useMutation } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { type JSX } from 'react'
import { toast } from './hooks/use-toast'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'

type PlayerDeleteDialogProps = {
    isOpen: boolean
    setOpen: (open: boolean) => void
    player: Player
}

export default function PlayerDeleteDialog({
    isOpen,
    setOpen,
    player
}: PlayerDeleteDialogProps): JSX.Element {
    const { mutate, isPending } = useMutation({
        mutationFn: async () => deletePlayer(player.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKeys.playersSummary] })
            setOpen(false)
            toast({
                title: 'Player Deletion',
                description: `The player ${player.name} has been successfully deleted.`
            })
        }
    })
    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Player Deletion</DialogTitle>
                    <DialogDescription>
                        The player {player.name} and their associated characters will be permanently
                        deleted from the database. {player.id}
                    </DialogDescription>
                </DialogHeader>
                <img
                    src="https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExY2w4YzhldHo5OGtnc29raXAzN2k0YnA4am5seWdleDJlZTdwcHlmdSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/4DvP1HK8UviaOuRcCY/giphy.gif"
                    alt="Be Careful"
                    width={400}
                    height={400}
                />
                <Button disabled={isPending} onClick={() => mutate()}>
                    {isPending ? <Loader2 className="animate-spin" /> : 'Confirm'}
                </Button>
            </DialogContent>
        </Dialog>
    )
}
