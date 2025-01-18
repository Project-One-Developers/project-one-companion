import { zodResolver } from '@hookform/resolvers/zod'
import { queryClient } from '@renderer/lib/tanstack-query/client'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { addCharacter } from '@renderer/lib/tanstack-query/players'
import { REALMS, ROLES, ROLES_CLASSES_MAP } from '@shared/consts/wow.consts'
import { newCharacterSchema } from '@shared/schemas/characters.schemas'
import type { NewCharacter, Player } from '@shared/types/types'
import { useMutation } from '@tanstack/react-query'
import { Loader2, PlusIcon } from 'lucide-react'
import { useState, type JSX } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from './hooks/use-toast'
import { Button } from './ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from './ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'

export function CharacterForm({ player }: { player: Player }): JSX.Element {
    const [open, setOpen] = useState(false)

    const { mutate, isPending } = useMutation({
        mutationFn: addCharacter,
        onSuccess: (_, arg) => {
            queryClient.invalidateQueries({ queryKey: [queryKeys.players] })
            form.reset()
            setOpen(false)
            toast({
                title: 'Character Added',
                description: `The character ${arg.name} for player ${player.name} has been successfully added.`
            })
        },
        onError: (error) => {
            toast({
                title: 'Error',
                description: `Unable to add the character. Error: ${error.message}`
            })
        }
    })

    const form = useForm<NewCharacter>({
        resolver: zodResolver(newCharacterSchema),
        defaultValues: {
            name: '',
            realm: 'pozzo-delleternità',
            class: 'Death Knight',
            role: 'DPS',
            playerName: player.name
        }
    })

    const selectedRole = form.watch('role')
    const filteredClasses = ROLES_CLASSES_MAP[selectedRole] || []

    function onSubmit(values: NewCharacter): void {
        mutate(values)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <PlusIcon className="w-5 h-5 cursor-pointer" />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>New character for {player.name}</DialogTitle>
                    <DialogDescription>
                        Enter the correct character name as it appears in-game
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
                        <FormField
                            control={form.control}
                            name="realm"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Realm</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a server" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {REALMS.EU.map((r) => (
                                                    <SelectItem key={r.slug} value={r.slug}>
                                                        {r.name}
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
                                    <FormLabel>Role</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a role" />
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
                        <FormField
                            control={form.control}
                            name="class"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Class</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a class" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {filteredClasses.map((c) => (
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
                        <Button disabled={isPending} type="submit">
                            {isPending ? <Loader2 className="animate-spin" /> : 'Add'}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
