import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import { CLASSES, ROLES } from "@/lib/classes";
import { useToast } from "@/components/hooks/use-toast";

const newPlayerSchema = z.object({
    playerName: z.string().min(1),
    characterName: z.string().min(1),
    playerClass: z.string().min(1),
    playerRole: z.string().min(1),
});

export default function NewPlayerForm() {
    const form = useForm<z.infer<typeof newPlayerSchema>>({
        resolver: zodResolver(newPlayerSchema),
        defaultValues: {
            playerName: "",
            characterName: "",
            playerClass: "",
            playerRole: "",
        },
    });

    function onSubmit(values: z.infer<typeof newPlayerSchema>) {
        const players =
            JSON.parse(window.localStorage.getItem("players")) || [];
        players.push({
            name: values.playerName,
            class: values.playerClass,
            role: values.playerRole,
            character: values.characterName,
        });
        window.localStorage.setItem("players", JSON.stringify(players));
        toast({
            title: "Aggiunta player",
            description: `Il pg ${values.characterName} del player ${values.playerName} è stato aggiunto con successo.`,
        });
        form.reset();
    }

    const { toast } = useToast();

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
                    name="playerClass"
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
                                                "w-[200px] justify-between",
                                                !field.value &&
                                                    "text-muted-foreground",
                                            )}
                                        >
                                            {field.value
                                                ? CLASSES.find(
                                                      (c) => c === field.value,
                                                  )
                                                : "Seleziona classe"}
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
                                            <CommandEmpty>
                                                Nessuna classe trovata.
                                            </CommandEmpty>
                                            <CommandGroup>
                                                {CLASSES.map((c) => (
                                                    <CommandItem
                                                        value={c}
                                                        key={c}
                                                        onSelect={() => {
                                                            form.setValue(
                                                                "playerClass",
                                                                c,
                                                            );
                                                        }}
                                                    >
                                                        {c}
                                                        <Check
                                                            className={cn(
                                                                "ml-auto",
                                                                c ===
                                                                    field.value
                                                                    ? "opacity-100"
                                                                    : "opacity-0",
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
                    name="playerRole"
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
                                                "w-[200px] justify-between",
                                                !field.value &&
                                                    "text-muted-foreground",
                                            )}
                                        >
                                            {field.value
                                                ? ROLES.find(
                                                      (c) => c === field.value,
                                                  )
                                                : "Seleziona ruolo"}
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
                                            <CommandEmpty>
                                                Nessun ruolo trovato.
                                            </CommandEmpty>
                                            <CommandGroup>
                                                {ROLES.map((c) => (
                                                    <CommandItem
                                                        value={c}
                                                        key={c}
                                                        onSelect={() => {
                                                            form.setValue(
                                                                "playerRole",
                                                                c,
                                                            );
                                                        }}
                                                    >
                                                        {c}
                                                        <Check
                                                            className={cn(
                                                                "ml-auto",
                                                                c ===
                                                                    field.value
                                                                    ? "opacity-100"
                                                                    : "opacity-0",
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
    );
}
