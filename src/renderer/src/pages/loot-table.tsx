import { WowItemIcon } from '@renderer/components/ui/wowitem-icon'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { fetchRaidLootTable } from '@renderer/lib/tanstack-query/raid'
import { encounterIcon } from '@renderer/lib/wow-icon'
import { useQuery } from '@tanstack/react-query'
import { LoaderCircle } from 'lucide-react'

export default function LootTable(): JSX.Element {
    const currentRaid = 1273
    const { data, isLoading } = useQuery({
        queryKey: [queryKeys.raidLootTable, currentRaid],
        queryFn: () => fetchRaidLootTable(currentRaid)
    })
    return (
        <>
            {isLoading ? (
                <div className="flex flex-col items-center w-full justify-center mt-10 mb-10">
                    <LoaderCircle className="animate-spin text-5xl" />
                </div>
            ) : (
                <div className="w-dvw h-dvh overflow-y-auto flex flex-col gap-y-8 items-center p-8 relative">
                    <div className="grid grid-cols-3 w-full items-center">
                        <div></div>
                        <h1 className="mx-auto text-3xl font-bold">Raid Loot Table</h1>
                        <div></div>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                        {data?.map((boss) => (
                            <div
                                key={boss.id}
                                className="flex flex-col justify-between bg-muted rounded-lg overflow-hidden"
                            >
                                <div className="flex flex-col gap-y-2">
                                    <img
                                        src={encounterIcon.get(boss.id)}
                                        alt={`${boss.name} icon`}
                                        className="w-full h-32 object-scale-down"
                                    />
                                    <h2 className="text-center text-xs font-bold ">{boss.name}</h2>
                                </div>

                                <div className="p-6">
                                    <ul>
                                        {boss.items.map((item) => (
                                            <li key={item.id}>
                                                <WowItemIcon
                                                    item={item}
                                                    iconOnly={false}
                                                    className="mt-2"
                                                    iconClassName={
                                                        'object-cover object-top rounded-full h-10 w-10 border border-background'
                                                    }
                                                />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    )
}
