import { zodResolver } from '@hookform/resolvers/zod'
import { PlusIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { NewCharacter } from 'shared/types/types'
import { z } from 'zod'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'

const newCharacterSchema = z.object({
    id: z.string().uuid(),
    characterName: z.string(),
    class: z.enum([
        'Death Knight',
        'Demon Hunter',
        'Druid',
        'Evoker',
        'Hunter',
        'Mage',
        'Monk',
        'Paladin',
        'Priest',
        'Rogue',
        'Shaman',
        'Warlock',
        'Warrior'
    ]),
    role: z.enum(['Tank', 'Healer', 'DPS'])
})

const CLASSES = [
    'Death Knight',
    'Demon Hunter',
    'Druid',
    'Evoker',
    'Hunter',
    'Mage',
    'Monk',
    'Paladin',
    'Priest',
    'Rogue',
    'Shaman',
    'Warlock',
    'Warrior'
]

const ROLES = ['Tank', 'Healer', 'DPS']

export function CharacterForm({ playerName }: { playerName: string }): JSX.Element {
    const form = useForm<NewCharacter>({
        resolver: zodResolver(newCharacterSchema),
        defaultValues: {
            playerName: playerName,
            characterName: '',
            class: 'Death Knight',
            role: 'Tank'
        }
    })

    function onSubmit(values: NewCharacter): void {
        console.log(values)
        // player
        //     ? toast({
        //           title: 'Aggiunta player',
        //           description: `Il pg ${values.characterName} del player ${player.playerName} è stato aggiunto con successo.`
        //       })
        //     : toast({
        //           title: 'Errore',
        //           description: `Non è stato possibile aggiungere il player.`
        //       })
        // form.reset()
    }

    return (
        <Dialog
            onOpenChange={() => {
                form.reset()
                form.setFocus('characterName')
            }}
        >
            <DialogTrigger asChild>
                <PlusIcon />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Nuovo pg per {playerName}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
                        <FormField
                            control={form.control}
                            name="characterName"
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
                        <FormField
                            control={form.control}
                            name="class"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Classe</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleziona una classe" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {CLASSES.map((c) => (
                                                    <SelectItem key={c} value={c}>
                                                        {c}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ruolo</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleziona un ruolo" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {ROLES.map((r) => (
                                                    <SelectItem key={r} value={r}>
                                                        {r}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Aggiungi</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
