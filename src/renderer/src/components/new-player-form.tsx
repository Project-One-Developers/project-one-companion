import { zodResolver } from '@hookform/resolvers/zod'
import { cn } from '@renderer/lib/utils'
import { CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from 'cmdk'
import { Check, ChevronsUpDown, Command } from 'lucide-react'
import { Form, useForm } from 'react-hook-form'
import { CLASSES, ROLES } from '../../../../shared/consts/wow.consts'
import { newCharacterSchema } from '../../../../shared/schemas/characters.schemas'
import { NewCharacter } from '../../../../shared/types/types'
import { useToast } from './hooks/use-toast'
import { Button } from './ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'

export default function NewPlayerForm(): JSX.Element {
    // TODO: readd default values?
    const form = useForm<NewCharacter>({
        resolver: zodResolver(newCharacterSchema)
    })

    async function onSubmit(values: NewCharacter): Promise<void> {
        const player = await window.api.addCharacter(values)

        player
            ? toast({
                  title: 'Aggiunta player',
                  description: `Il pg ${values.characterName} del player ${player.playerName} è stato aggiunto con successo.`
              })
            : toast({
                  title: 'Errore',
                  description: `Non è stato possibile aggiungere il player.`
              })
        form.reset()
    }

    const { toast } = useToast()

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 ">
                <FormField
                    control={form.control}
                    name="playerName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nome player</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="characterName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nome pg</FormLabel>
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
                        <FormItem className="flex flex-col">
                            <FormLabel>Classe</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className={cn(
                                                'w-[200px] justify-between',
                                                !field.value && 'text-muted-foreground'
                                            )}
                                        >
                                            {field.value
                                                ? CLASSES.find((c) => c === field.value)
                                                : 'Seleziona classe'}
                                            <ChevronsUpDown className="opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-[200px] p-0">
                                    <Command>
                                        <CommandInput
                                            placeholder="Scegli una classe"
                                            className="h-9"
                                        />
                                        <CommandList>
                                            <CommandEmpty>Nessuna classe trovata.</CommandEmpty>
                                            <CommandGroup>
                                                {CLASSES.map((c) => (
                                                    <CommandItem
                                                        value={c}
                                                        key={c}
                                                        onSelect={() => {
                                                            form.setValue('class', c)
                                                        }}
                                                    >
                                                        {c}
                                                        <Check
                                                            className={cn(
                                                                'ml-auto',
                                                                c === field.value
                                                                    ? 'opacity-100'
                                                                    : 'opacity-0'
                                                            )}
                                                        />
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Ruolo</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className={cn(
                                                'w-[200px] justify-between',
                                                !field.value && 'text-muted-foreground'
                                            )}
                                        >
                                            {field.value
                                                ? ROLES.find((c) => c === field.value)
                                                : 'Seleziona ruolo'}
                                            <ChevronsUpDown className="opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-[200px] p-0">
                                    <Command>
                                        <CommandInput
                                            placeholder="Scegli un ruolo"
                                            className="h-9"
                                        />
                                        <CommandList>
                                            <CommandEmpty>Nessun ruolo trovato.</CommandEmpty>
                                            <CommandGroup>
                                                {ROLES.map((c) => (
                                                    <CommandItem
                                                        value={c}
                                                        key={c}
                                                        onSelect={() => {
                                                            form.setValue('role', c)
                                                        }}
                                                    >
                                                        {c}
                                                        <Check
                                                            className={cn(
                                                                'ml-auto',
                                                                c === field.value
                                                                    ? 'opacity-100'
                                                                    : 'opacity-0'
                                                            )}
                                                        />
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="disabled:bg-gray-500">
                    Submit
                </Button>
            </form>
        </Form>
    )
}
