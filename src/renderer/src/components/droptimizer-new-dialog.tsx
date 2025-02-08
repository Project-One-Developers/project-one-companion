import { zodResolver } from '@hookform/resolvers/zod'
import * as Tabs from '@radix-ui/react-tabs'
import { queryClient } from '@renderer/lib/tanstack-query/client'
import {
    addDroptimizer,
    syncDroptimizersFromDiscord
} from '@renderer/lib/tanstack-query/droptimizers'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { raidbotsURLSchema } from '@shared/schemas/simulations.schemas'
import { useMutation } from '@tanstack/react-query'
import clsx from 'clsx'
import { Loader2, PlusIcon, RefreshCw } from 'lucide-react'
import { useState, type JSX } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
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

// Types and schemas
const formSchema = z.object({
    url: raidbotsURLSchema
})
type FormValues = z.infer<typeof formSchema>

// Component
export default function DroptimizerNewDialog(): JSX.Element {
    // State
    const [open, setOpen] = useState(false)

    // Form setup
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            url: ''
        }
    })

    // Mutation handling
    const manualMutation = useMutation({
        mutationFn: addDroptimizer,
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: [queryKeys.droptimizers] })
            form.reset()
            //setOpen(false)
            toast({
                title: 'Droptimizer added',
                description: `The droptimizer for character ${response.charInfo.name} has been successfully added.`
            })
        },
        onError: (error: Error) => {
            toast({
                title: 'Error',
                description: `Unable to add the droptimizer. Error: ${error.message}`
            })
        }
    })

    const syncMutation = useMutation({
        mutationFn: syncDroptimizersFromDiscord,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKeys.droptimizers] })
            toast({
                title: 'Sync Successful',
                description: 'Droptimizers have been successfully synced from Discord.'
            })
        },
        onError: (error: Error) => {
            toast({
                title: 'Sync Failed',
                description: `Unable to sync droptimizers from Discord. Error: ${error.message}`,
                variant: 'destructive'
            })
        }
    })

    const handleSyncFromDiscord = () => {
        syncMutation.mutate()
    }

    function onSubmit(values: FormValues): void {
        manualMutation.mutate(values.url)
    }

    const FormContent = (): JSX.Element => (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
                <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Droptimizer URL</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button disabled={manualMutation.isPending} type="submit">
                    {manualMutation.isPending ? <Loader2 className="animate-spin" /> : 'Add'}
                </Button>
            </form>
        </Form>
    )

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className="rounded-full bg-primary text-background hover:bg-primary/80 w-10 h-10 flex items-center justify-center cursor-pointer">
                    <PlusIcon
                        className={clsx('w-5 h-5 hover:rotate-45 ease-linear transition-transform')}
                    />
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>New droptimizer</DialogTitle>
                    <DialogDescription>
                        Add a new droptimizer manually or sync from Discord
                    </DialogDescription>
                </DialogHeader>
                <Tabs.Root defaultValue="manual" className="w-full">
                    <Tabs.List className="flex border-b mb-4">
                        <Tabs.Trigger
                            value="manual"
                            className="px-4 py-2 flex-1 text-center hover:bg-gray-100 data-[state=active]:border-b-2 data-[state=active]:border-primary"
                        >
                            Manual Entry
                        </Tabs.Trigger>
                        <Tabs.Trigger
                            value="sync"
                            className="px-4 py-2 flex-1 text-center hover:bg-gray-100 data-[state=active]:border-b-2 data-[state=active]:border-primary"
                        >
                            Sync from Discord
                        </Tabs.Trigger>
                    </Tabs.List>
                    <Tabs.Content value="manual" className="p-4">
                        <FormContent />
                    </Tabs.Content>
                    <Tabs.Content value="sync" className="p-4">
                        <Button
                            onClick={handleSyncFromDiscord}
                            className="w-full"
                            disabled={syncMutation.isPending}
                        >
                            {syncMutation.isPending ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <RefreshCw className="mr-2 h-4 w-4" />
                            )}
                            {syncMutation.isPending ? 'Syncing...' : 'Sync from Discord'}
                        </Button>
                    </Tabs.Content>
                </Tabs.Root>
            </DialogContent>
        </Dialog>
    )
}
