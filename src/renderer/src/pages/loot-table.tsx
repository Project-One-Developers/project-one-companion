import { WowheadLink } from '@renderer/components/ui/wowhead-link'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { fetchRaidLootTable } from '@renderer/lib/tanstack-query/raid'
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
                    <div className="flex flex-wrap gap-x-4 gap-y-4">
                        {data?.map((boss) => (
                            <div
                                key={boss.id}
                                className="flex flex-col justify-between p-6 bg-muted rounded-lg relative"
                            >
                                <h2 className="font-black text-2xl">{boss.name}</h2>
                                <ul>
                                    {boss.items.map((item) => (
                                        <li key={item.id}>
                                            <WowheadLink
                                                target="_blank"
                                                itemId={item.id}
                                                className={'text-xs'}
                                                data-wh-icon-size="medium"
                                                rel="noreferrer"
                                            />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    )
}
