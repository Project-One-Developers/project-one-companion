import { queryClient } from '@renderer/lib/tanstack-query/client'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { deletePlayer } from '@renderer/lib/tanstack-query/players'
import { Player } from '@shared/types/types'
import { useMutation } from '@tanstack/react-query'
import { Loader2, X } from 'lucide-react'
import { useState } from 'react'
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
            <DialogTrigger asChild className="absolute top-2 right-2 cursor-pointer">
                <X className="w-3" />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Cancellazione player</DialogTitle>
                </DialogHeader>
                <p>
                    Il player {player.playerName} e i relativi personaggi verranno definitivamente
                    cancellati dal database.
                </p>
                <img
                    src="https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExY2w4YzhldHo5OGtnc29raXAzN2k0YnA4am5seWdleDJlZTdwcHlmdSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/4DvP1HK8UviaOuRcCY/giphy.gif"
                    alt="Be Careful"
                    width={400}
                    height={400}
                />
                <Button disabled={isPending} onClick={() => mutate()}>
                    {isPending ? <Loader2 className="animate-spin" /> : 'Conferma'}
                </Button>
            </DialogContent>
        </Dialog>
    )
}
