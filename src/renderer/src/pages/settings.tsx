import { toast } from '@renderer/components/hooks/use-toast'
import { Button } from '@renderer/components/ui/button'
import { Input } from '@renderer/components/ui/input'
import { queryClient } from '@renderer/lib/tanstack-query/client'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { editSettings, fetchSettings } from '@renderer/lib/tanstack-query/settings'
import { AppSettings } from '@shared/types/types'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Database, ListRestart, LoaderCircle, RefreshCcwDot } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function SettingsPage() {
    const [databaseUrl, setDatabaseUrl] = useState('')
    const [isReloading, setIsReloading] = useState(false)
    const [isSyncingWowAudit, setIsSyncingWowAudit] = useState(false)
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
                title: 'Config Updated',
                description: 'Settings updated successfully.'
            })
        },
        onError: (error) => {
            toast({
                title: 'Update Failed',
                description: `Failed to update config: ${error.message}`,
                variant: 'destructive'
            })
        }
    })

    const handleUpdateDatabaseUrl = () => {
        if (databaseUrl) updateMutation.mutate({ databaseUrl })
    }

    const handleSyncWowAudit = async () => {
        setIsSyncingWowAudit(true)
        await window.api
            .syncWowAudit()
            .then(() =>
                toast({ title: 'WoWAudit Synced', description: 'Data synced successfully.' })
            )
            .catch(() =>
                toast({
                    title: 'Update Failed',
                    description: 'Could not update resources.',
                    variant: 'destructive'
                })
            )
            .finally(() => setIsSyncingWowAudit(false))
    }

    const handleReloadItems = async () => {
        setIsReloading(true)
        await window.api
            .upsertJsonData()
            .then(() =>
                toast({ title: 'Resources Updated', description: 'Data synced successfully.' })
            )
            .catch(() =>
                toast({
                    title: 'Update Failed',
                    description: 'Could not update resources.',
                    variant: 'destructive'
                })
            )
            .finally(() => setIsReloading(false))
    }

    const handleResetSettings = async () => {
        setIsResetting(true)
        await window.api
            .resetAppSettings()
            .then(() =>
                toast({ title: 'Settings Reset', description: 'Reverted to factory defaults.' })
            )
            .catch((error) =>
                toast({ title: 'Reset Failed', description: error.message, variant: 'destructive' })
            )
            .finally(() => setIsResetting(false))
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <LoaderCircle className="animate-spin text-white w-10 h-10" />
            </div>
        )
    }

    return (
        <div className="w-full h-full p-8 flex flex-col gap-6">
            {/* Database Configuration */}
            <section className="space-y-4">
                <h2 className="text-lg font-semibold">Database Configuration</h2>
                <Input
                    type="text"
                    value={databaseUrl}
                    onChange={(e) => setDatabaseUrl(e.target.value)}
                    placeholder="postgresql://username:password@server:5432/dbname"
                />
                <Button
                    className="w-full"
                    onClick={handleUpdateDatabaseUrl}
                    disabled={updateMutation.isPending}
                >
                    {updateMutation.isPending ? (
                        <LoaderCircle className="animate-spin" />
                    ) : (
                        <Database />
                    )}
                    Update Database URL
                </Button>
            </section>

            {/* Reload Items */}
            <section className="space-y-4">
                <h2 className="text-lg font-semibold">Reload Items Data</h2>
                <Button className="w-full" disabled={isReloading} onClick={handleReloadItems}>
                    {isReloading ? <LoaderCircle className="animate-spin" /> : <ListRestart />}
                    Reload Items
                </Button>
            </section>

            {/* Force wow audit sync */}
            <section className="space-y-4">
                <h2 className="text-lg font-semibold">Sync Characters from WowAudit</h2>
                <Button
                    className="w-full"
                    disabled={isSyncingWowAudit}
                    onClick={handleSyncWowAudit}
                >
                    {isSyncingWowAudit ? (
                        <LoaderCircle className="animate-spin" />
                    ) : (
                        <ListRestart />
                    )}
                    Sync WowAudit
                </Button>
            </section>

            {/* Reset to Factory Settings */}
            <section className="space-y-4">
                <h2 className="text-lg font-semibold">Reset to Factory Settings</h2>
                <Button
                    className="w-full"
                    variant="destructive"
                    disabled={isResetting}
                    onClick={handleResetSettings}
                >
                    {isResetting ? <LoaderCircle className="animate-spin" /> : <RefreshCcwDot />}
                    Reset Settings
                </Button>
            </section>
        </div>
    )
}
