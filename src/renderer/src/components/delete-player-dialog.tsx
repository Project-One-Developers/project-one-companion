import { queryClient } from '@renderer/lib/tanstack-query/client'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { deletePlayer } from '@renderer/lib/tanstack-query/players'
import { useMutation } from '@tanstack/react-query'
import { Loader2, Trash } from 'lucide-react'
import { useState } from 'react'
import { Player } from 'shared/types/types'
import { toast } from './hooks/use-toast'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'

export default function DeletePlayerDialog({ player }: { player: Player }): JSX.Element {
    const [open, setOpen] = useState(false)
    const { mutate, isPending } = useMutation({
        mutationFn: async () => deletePlayer(player.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKeys.players] })
            setOpen(false)
            toast({
                title: 'Cancellazione player',
                description: `Il player ${player.playerName} è stato cancellato con successo.`
            })
        }
    })
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Trash />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Cancellare player {player.playerName}</DialogTitle>
                </DialogHeader>
                <Button disabled={isPending} onClick={() => mutate()}>
                    {isPending ? <Loader2 className="animate-spin" /> : 'Conferma'}
                </Button>
            </DialogContent>
        </Dialog>
    )
}
