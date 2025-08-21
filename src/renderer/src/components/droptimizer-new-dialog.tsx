
import * as Tabs from '@radix-ui/react-tabs'
import { queryClient } from '@renderer/lib/tanstack-query/client'
import {
    addDroptimizer,
    cleanupDroptimizerOlderThanHours,
    syncDroptimizersFromDiscord,
    addSimc
} from '@renderer/lib/tanstack-query/droptimizers'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { useMutation } from '@tanstack/react-query'
import clsx from 'clsx'
import { Loader2, PlusIcon, Recycle, RefreshCw, Upload } from 'lucide-react'
import React, { useState, type JSX } from 'react'
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
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/text-area'

export default function DroptimizerNewDialog(): JSX.Element {
    // State
    const [open, setOpen] = useState(false)
    const [hoursValue, setHoursValue] = useState(12)
    const [url, setUrl] = useState('')
    const [simcData, setSimcData] = useState('')

    // Mutation handling
    const manualMutation = useMutation({
        mutationFn: addDroptimizer,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKeys.droptimizers] })
            setUrl('')
            toast({
                title: 'Droptimizer added',
                description: `The droptimizer has been successfully added.`
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

    const cleanupMutation = useMutation({
        mutationFn: cleanupDroptimizerOlderThanHours,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKeys.droptimizers] })
            toast({
                title: 'Cleanup Successful',
                description: 'Droptimizers have been successfully cleaned up'
            })
        },
        onError: (error: Error) => {
            toast({
                title: 'Cleanup Failed',
                description: `Unable to cleanup droptimizers. Error: ${error.message}`,
                variant: 'destructive'
            })
        }
    })

    const simcImportMutation = useMutation({
        mutationFn: addSimc,
        onSuccess: () => {
            setSimcData('')
            toast({
                title: 'SimC Import Successful',
                description: `Successfully imported SimC data.`
            })
        },
        onError: (error: Error) => {
            toast({
                title: 'SimC Import Failed',
                description: `Unable to import SimC data. Error: ${error.message}`,
                variant: 'destructive'
            })
        }
    })

    const handleSyncFromDiscord = () => {
        syncMutation.mutate(hoursValue)
    }

    const handleCleanup = () => {
        cleanupMutation.mutate(hoursValue)
    }

    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!url.trim()) return
        manualMutation.mutate(url)
    }

    const handleSimcSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!simcData.trim()) return
        simcImportMutation.mutate(simcData)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button
                    className={clsx(
                        'w-14 h-14 rounded-full shadow-lg transition-all duration-200 flex items-center justify-center',
                        'bg-primary hover:bg-primary/80 text-primary-foreground'
                    )}
                    title="Add New Droptimizer"
                >
                    <PlusIcon
                        size={24}
                        className="hover:rotate-45 ease-linear transition-transform"
                    />
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>New droptimizer</DialogTitle>
                    <DialogDescription>
                        Add a new droptimizer manually, import from SimC, sync from Discord, or cleanup old entries
                    </DialogDescription>
                </DialogHeader>
                <Tabs.Root defaultValue="sync" className="w-full">
                    <Tabs.List className="flex border-b mb-4">
                        <Tabs.Trigger
                            value="sync"
                            className="px-3 py-2 flex-1 text-center text-sm hover:bg-gray-700 data-[state=active]:border-b-2 data-[state=active]:border-primary"
                        >
                            Sync
                        </Tabs.Trigger>
                        <Tabs.Trigger
                            value="manual"
                            className="px-3 py-2 flex-1 text-center text-sm hover:bg-gray-700 data-[state=active]:border-b-2 data-[state=active]:border-primary"
                        >
                            Manual
                        </Tabs.Trigger>
                        <Tabs.Trigger
                            value="simc"
                            className="px-3 py-2 flex-1 text-center text-sm hover:bg-gray-700 data-[state=active]:border-b-2 data-[state=active]:border-primary"
                        >
                            SimC
                        </Tabs.Trigger>
                        <Tabs.Trigger
                            value="cleanup"
                            className="px-3 py-2 flex-1 text-center text-sm hover:bg-gray-700 data-[state=active]:border-b-2 data-[state=active]:border-primary"
                        >
                            Cleanup
                        </Tabs.Trigger>
                    </Tabs.List>
                    <Tabs.Content value="sync" className="p-4">
                        <div className="flex items-center gap-x-4">
                            <div className="flex-1">
                                <Button
                                    onClick={handleSyncFromDiscord}
                                    className="w-full"
                                    disabled={syncMutation.isPending}
                                >
                                    <div className="flex items-center justify-center w-full">
                                        <div className="flex-none w-6 flex justify-start">
                                            {syncMutation.isPending ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <RefreshCw className="h-4 w-4" />
                                            )}
                                        </div>
                                        <div className="flex-grow text-center">
                                            {syncMutation.isPending ? 'Syncing...' : 'Sync last'}
                                        </div>
                                    </div>
                                </Button>
                            </div>
                            <div className="relative w-24">
                                <Input
                                    type="number"
                                    id="sync-hours-input"
                                    min={1}
                                    value={hoursValue}
                                    onChange={e => setHoursValue(parseInt(e.target.value, 10))}
                                    className="pr-10"
                                />
                                <label
                                    htmlFor="sync-hours-input"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground"
                                >
                                    hrs
                                </label>
                            </div>
                        </div>
                    </Tabs.Content>
                    <Tabs.Content value="manual" className="p-4">
                        <form onSubmit={handleManualSubmit} className="flex flex-col gap-y-4">
                            <div>
                                <Label htmlFor="url-input">Droptimizer URL</Label>
                                <Input
                                    id="url-input"
                                    value={url}
                                    onChange={e => setUrl(e.target.value)}
                                    placeholder="Enter droptimizer URL..."
                                />
                            </div>
                            <Button disabled={manualMutation.isPending} type="submit">
                                {manualMutation.isPending ? <Loader2 className="animate-spin" /> : 'Add'}
                            </Button>
                        </form>
                    </Tabs.Content>
                    <Tabs.Content value="simc" className="p-4">
                        <form onSubmit={handleSimcSubmit} className="flex flex-col gap-y-4">
                            <div>
                                <Label htmlFor="simc-input">SimC Data</Label>
                                <Textarea
                                    id="simc-input"
                                    value={simcData}
                                    onChange={e => setSimcData(e.target.value)}
                                    placeholder="Paste your SimC character data here..."
                                    className="min-h-[200px] resize-vertical"
                                />
                            </div>
                            <Button disabled={simcImportMutation.isPending} type="submit">
                                {simcImportMutation.isPending ? (
                                    <>
                                        <Loader2 className="animate-spin mr-2" />
                                        Importing...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="mr-2 h-4 w-4" />
                                        Import
                                    </>
                                )}
                            </Button>
                        </form>
                    </Tabs.Content>
                    <Tabs.Content value="cleanup" className="p-4">
                        <div className="flex items-center gap-x-4">
                            <div className="flex-1">
                                <Button
                                    onClick={() => handleCleanup()}
                                    disabled={cleanupMutation.isPending}
                                    className="w-full"
                                >
                                    <div className="flex items-center justify-center w-full">
                                        <div className="flex-none w-6 flex justify-start">
                                            {cleanupMutation.isPending ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Recycle className="h-4 w-4" />
                                            )}
                                        </div>
                                        <div className="flex-grow text-center">
                                            {cleanupMutation.isPending
                                                ? 'Cleaning...'
                                                : 'Clean older than'}
                                        </div>
                                    </div>
                                </Button>
                            </div>
                            <div className="relative w-24">
                                <Input
                                    type="number"
                                    id="cleanup-hours-input"
                                    min={1}
                                    value={hoursValue}
                                    onChange={e => setHoursValue(parseInt(e.target.value, 10))}
                                    className="pr-10"
                                />
                                <label
                                    htmlFor="cleanup-hours-input"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground"
                                >
                                    hrs
                                </label>
                            </div>
                        </div>
                    </Tabs.Content>
                </Tabs.Root>
            </DialogContent>
        </Dialog>
    )
}
