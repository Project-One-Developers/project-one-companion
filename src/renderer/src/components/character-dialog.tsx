import { zodResolver } from '@hookform/resolvers/zod'
import { CheckedState } from '@radix-ui/react-checkbox'
import { queryClient } from '@renderer/lib/tanstack-query/client'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { addCharacter, editCharacter } from '@renderer/lib/tanstack-query/players'
import { REALMS, ROLES, ROLES_CLASSES_MAP } from '@shared/consts/wow.consts'
import { newCharacterSchema } from '@shared/schemas/characters.schemas'
import type { Character, NewCharacter, Player } from '@shared/types/types'
import { useMutation } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { type JSX } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from './hooks/use-toast'
import { Button } from './ui/button'
import { Checkbox } from './ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from './ui/form'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'

type CharacterDialogProps = {
    isOpen: boolean
    setOpen: (open: boolean) => void
    mode: 'add' | 'edit'
    player?: Player
    existingCharacter?: Character
}

export default function CharacterDialog({
    isOpen,
    setOpen,
    mode,
    player,
    existingCharacter
}: CharacterDialogProps): JSX.Element {
    if (mode === 'edit' && !existingCharacter) {
        throw new Error('Cannot edit a character that does not exist')
    }
    if (mode === 'add' && !player) {
        throw new Error('Cannot add a character without a player')
    }

    const addMutation = useMutation({
        mutationFn: addCharacter,
        onSuccess: (_, arg) => {
            queryClient.invalidateQueries({ queryKey: [queryKeys.players] })
            form.reset()
            setOpen(false)
            toast({
                title: 'Character Added',
                description: `The character ${arg.name} has been successfully added.`
            })
        },
        onError: (error) => {
            toast({
                title: 'Error',
                description: `Unable to add the character. Error: ${error.message}`
            })
        }
    })

    const editMutation = useMutation({
        mutationFn: editCharacter,
        onSuccess: (_, arg) => {
            queryClient.invalidateQueries({
                queryKey: [queryKeys.character, arg.id]
            })
            setOpen(false)
            toast({
                title: 'Character edited',
                description: `Character ${arg.name} edited successfully`
            })
        },
        onError: (error) => {
            toast({
                title: 'Error',
                description: `Unable to edit the character. Error: ${error.message}`
            })
        }
    })

    const form = useForm<NewCharacter>({
        resolver: zodResolver(newCharacterSchema),
        defaultValues: {
            name: mode === 'edit' ? existingCharacter?.name : '',
            realm: 'pozzo-delleternità',
            class: 'Death Knight',
            role: 'DPS',
            main: true,
            playerId: player?.id
        }
    })

    const selectedRole = form.watch('role')
    const filteredClasses = ROLES_CLASSES_MAP[selectedRole] || []

    function onSubmit(values: NewCharacter): void {
        if (mode === 'edit' && existingCharacter) {
            editMutation.mutate({ id: existingCharacter.id, ...values })
        } else {
            addMutation.mutate(values)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {mode === 'add' ? 'New' : 'Edit'} character for {player?.name}
                    </DialogTitle>
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
                        <FormField
                            control={form.control}
                            name="main"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value as CheckedState}
                                            onCheckedChange={field.onChange}
                                            className="h-5 w-5"
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>Main Character</FormLabel>
                                        <FormDescription>
                                            Check this if this is the player&apos;s main character.
                                        </FormDescription>
                                    </div>
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
