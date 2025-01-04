import NewDroptimizerForm from '@renderer/components/new-droptimizer-form'
import { fetchDroptimizers } from '@renderer/lib/tanstack-query/droptimizers'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { getDpsHumanReadable, unitTimestampToRelativeDays } from '@renderer/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { LoaderCircle } from 'lucide-react'

export default function RosterPage(): JSX.Element {
    const { data, isLoading } = useQuery({
        queryKey: [queryKeys.droptimizers],
        queryFn: fetchDroptimizers
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
                        <h1 className="mx-auto text-3xl font-bold">Droptimizer</h1>
                        <div className="flex items-center justify-center absolute bottom-6 right-6">
                            <NewDroptimizerForm />
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-4">
                        {data?.droptimizers.map((dropt) => {
                            // const topUpgrade = dropt.upgrades?.sort((a, b) => b.dps - a.dps)[0]
                            return (
                                <div
                                    key={dropt.id}
                                    className="flex flex-col justify-between p-6 bg-muted h-[200px] w-[300px] rounded-lg relative"
                                >
                                    {/* <DeletePlayerDialog player={player} /> */}
                                    <h2 className="font-black text-2xl">{dropt.characterName}</h2>
                                    <div className="text-sm text-gray-600">
                                        <p>
                                            <strong>Raid Difficulty:</strong> {dropt.raidDifficulty}
                                        </p>
                                        <p>
                                            <strong>Fight Style:</strong>{' '}
                                            {dropt.fightInfo.fightstyle}({dropt.fightInfo.nTargets}){' '}
                                            {dropt.fightInfo.duration} sec
                                        </p>
                                        <p title={new Date(dropt.date * 1000).toLocaleString()}>
                                            <strong>Date: </strong>
                                            {unitTimestampToRelativeDays(dropt.date)}
                                        </p>
                                        <p>
                                            <strong>Upgrades:</strong> {dropt.upgrades?.length}
                                        </p>
                                    </div>

                                    {dropt.upgrades ? (
                                        <div className={'flex items-center gap-3 mt-3'}>
                                            {dropt.upgrades.slice(0, 6).map((item) => (
                                                <div
                                                    className="-mr-4 relative group"
                                                    key={item.itemId}
                                                >
                                                    {/* todo: wowhead tooltips? */}
                                                    <img
                                                        height={50}
                                                        width={50}
                                                        src={
                                                            'https://wow.zamimg.com/images/wow/icons/large/inv_nerubian_ring_01_color3.jpg'
                                                        }
                                                        alt={String(item.itemId)}
                                                        className="object-cover !m-0 !p-0 object-top rounded-full h-10 w-10 border group-hover:scale-105 group-hover:z-30 border-background relative transition duration-500"
                                                    />
                                                    <p className="text-xs text-gray-600 text-center">
                                                        <strong>
                                                            {getDpsHumanReadable(item.dps)}
                                                        </strong>
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-600">
                                            No upgrades available.
                                        </p>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </>
    )
}
