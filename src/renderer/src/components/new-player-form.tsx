import { zodResolver } from '@hookform/resolvers/zod'
import { queryClient } from '@renderer/lib/tanstack-query/client'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { addPlayer } from '@renderer/lib/tanstack-query/players'
import { useMutation } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { NewCharacter } from 'shared/types/types'
import { z } from 'zod'
import { toast } from './hooks/use-toast'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'

const newPlayerName = z.object({
    playerName: z.string().min(1)
})

export default function PlayerForm(): JSX.Element {
    const [open, setOpen] = useState(false)

    const { mutate, isPending } = useMutation({
        mutationFn: addPlayer,
        onSuccess: (_, arg) => {
            queryClient.invalidateQueries({ queryKey: [queryKeys.players] })
            form.reset()
            setOpen(false)
            toast({
                title: 'Aggiunta player',
                description: `Il player ${arg} è stato aggiunto con successo.`
            })
        },
        onError: (error) => {
            toast({
                title: 'Errore',
                description: `Non è stato possibile aggiungere il pg. Errore: ${error.message}`
            })
        }
    })

    const form = useForm<NewCharacter>({
        resolver: zodResolver(newPlayerName),
        defaultValues: {
            playerName: ''
        }
    })

    function onSubmit(values: { playerName: string }): void {
        mutate(values.playerName)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="bg-primary text-background hover:bg-primary/80 rounded-md px-4 py-2">
                    Add player
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Nuovo player</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
                        <FormField
                            control={form.control}
                            name="playerName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button disabled={isPending} type="submit">
                            {isPending ? <Loader2 className="animate-spin" /> : 'Aggiungi'}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
