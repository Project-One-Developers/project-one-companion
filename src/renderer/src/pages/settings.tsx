import { toast } from '@renderer/components/hooks/use-toast'
import { Button } from '@renderer/components/ui/button'
import { Input } from '@renderer/components/ui/input'
import { queryClient } from '@renderer/lib/tanstack-query/client'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { editSettings, fetchSettings } from '@renderer/lib/tanstack-query/settings'
import { AppSettings } from '@shared/types/types'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Database, ListRestart, LoaderCircle, RefreshCcwDot } from 'lucide-react'
import { type JSX, useEffect, useState } from 'react'

export default function SettingsPage(): JSX.Element {
    const [databaseUrl, setDatabaseUrl] = useState('')
    const [isReloading, setIsReloading] = useState(false)
    const [isResetting, setIsResetting] = useState(false)

    const { data: appSettings, isLoading } = useQuery<AppSettings>({
        queryKey: [queryKeys.appSettings],
        queryFn: fetchSettings
    })

    useEffect(() => {
        if (appSettings?.databaseUrl) {
            setDatabaseUrl(appSettings.databaseUrl)
        }
    }, [appSettings?.databaseUrl])

    const updateMutation = useMutation({
        mutationFn: editSettings,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKeys.appSettings] })
            toast({
                title: 'Config updated',
                description: 'The configuration has been updated successfully.'
            })
        },
        onError: (error) => {
            toast({
                title: 'Update failed',
                description: `Failed to update config: ${error.message}`,
                variant: 'destructive'
            })
        }
    })

    const handleUpdateDatabaseUrl = () => {
        if (databaseUrl) {
            updateMutation.mutate({ databaseUrl })
        }
    }

    const handleReloadItems = async () => {
        setIsReloading(true)
        await window.api
            .upsertJsonData()
            .then(() => {
                toast({
                    title: 'Resources updated',
                    description: 'Data from JSON files has been updated in the database.'
                })
            })
            .catch(() => {
                toast({
                    title: 'Resources not updated',
                    description: `Could not update resources.`
                })
            })
            .finally(() => {
                setIsReloading(false)
            })
    }

    const handleResetSettings = async () => {
        setIsResetting(true)
        await window.api
            .resetAppSettings()
            .then(() => {
                toast({
                    title: 'Settings Reset',
                    description: 'The application settings have been reset to their default values.'
                })
            })
            .catch((error) => {
                toast({
                    title: 'Reset failed',
                    description: `Failed to reset settings: ${error.message}`,
                    variant: 'destructive'
                })
            })
            .finally(() => {
                setIsResetting(false)
            })
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center mt-10 mb-10">
                <LoaderCircle className="animate-spin text-5xl text-white" />
            </div>
        )
    }

    return (
        <div className="w-dvw h-dvh overflow-y-auto flex flex-col gap-y-8 p-8 relative">
            <div className="flex flex-wrap gap-x-4 gap-y-4">
                {/* Database Configuration Panel */}
                <div className="p-4 rounded-lg bg-gray-800">
                    <h2 className="text-xl font-semibold">Database Configuration</h2>
                    <div className="flex flex-col gap-2 mt-4">
                        <Input
                            type="text"
                            value={databaseUrl}
                            onChange={(e) => setDatabaseUrl(e.target.value)}
                            placeholder="postgresql://username:password@server:5432/dbname"
                            className="text-lg p-2 rounded-md bg-gray-700 text-white"
                        />
                        <Button
                            onClick={handleUpdateDatabaseUrl}
                            disabled={updateMutation.isPending}
                            className="flex items-center justify-center gap-x-2 mt-4 bg-blue-600 hover:bg-blue-700"
                        >
                            {updateMutation.isPending ? (
                                <>
                                    <LoaderCircle className="animate-spin" />
                                    <span className="text-white">Updating...</span>
                                </>
                            ) : (
                                <>
                                    <Database className="text-white" />
                                    <span className="text-white">Update Database URL</span>
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Reload Items Panel */}
                <div className="p-4 rounded-lg bg-gray-800 mt-6">
                    <h2 className="text-xl font-semibold">Reload Items Data</h2>
                    <div className="mt-4">
                        <Button
                            disabled={isReloading}
                            onClick={handleReloadItems}
                            className="flex items-center justify-center gap-x-2 mt-4 bg-blue-600 hover:bg-blue-700"
                        >
                            {isReloading ? (
                                <>
                                    <LoaderCircle className="animate-spin" />
                                    <span className="text-white">Reloading...</span>
                                </>
                            ) : (
                                <>
                                    <ListRestart className="text-white" />
                                    <span className="text-white">Reload Items</span>
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Reset to Factory Settings Panel */}
                <div className="p-4 rounded-lg bg-gray-800 mt-6">
                    <h2 className="text-xl font-semibold">Reset to Factory Settings</h2>
                    <div className="mt-4">
                        <Button
                            variant="destructive"
                            disabled={isResetting}
                            onClick={handleResetSettings}
                            className="flex items-center justify-center gap-x-2 w-full"
                        >
                            {isResetting ? (
                                <>
                                    <LoaderCircle className="animate-spin" />
                                    <span>Resetting...</span>
                                </>
                            ) : (
                                <>
                                    <RefreshCcwDot className="text-white" />
                                    <span>Reset to Factory Settings</span>
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
