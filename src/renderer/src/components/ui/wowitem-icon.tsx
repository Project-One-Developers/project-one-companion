import { fetchItem } from '@renderer/lib/tanstack-query/items'
import { cn } from '@renderer/lib/utils'
import { Item, ItemTrack, WowRaidDifficulty } from '@shared/types/types'
import { useQuery } from '@tanstack/react-query'
import { LoaderCircle } from 'lucide-react'

export const WowItemIcon = ({
    item,
    iconOnly,
    catalystBanner = false,
    tierBanner = false,
    raidDiff,
    ilvl,
    itemTrack,
    className,
    iconClassName,
    showSlot = true,
    showSubclass = true,
    showIlvl = true
}: {
    item: Item | number
    iconOnly: boolean
    catalystBanner?: boolean
    socketBanner?: boolean
    tierBanner?: boolean
    raidDiff?: WowRaidDifficulty
    ilvl?: number
    itemTrack?: ItemTrack
    className?: string
    iconClassName?: string
    showSlot?: boolean
    showSubclass?: boolean
    showIlvl?: boolean
}) => {
    const { data: itemData, isLoading } = useQuery({
        queryKey: ['item', item],
        queryFn: () => (typeof item === 'number' ? fetchItem(item) : Promise.resolve(item as Item)),
        enabled: !!item
    })

    if (isLoading) {
        return (
            <div className="flex flex-col items-center w-full justify-center mt-10 mb-10">
                <LoaderCircle className="animate-spin text-5xl" />
            </div>
        )
    }
    if (!itemData) {
        if (typeof item === 'number') {
            return (
                <a
                    className=""
                    href={`https://www.wowhead.com/item=${item}`}
                    rel="noreferrer"
                    target="_blank"
                >
                    ${item as number}
                </a>
            )
        } else {
            return null
        }
    }

    const getIlvl = () => {
        if (ilvl !== undefined) return ilvl
        if (itemTrack !== undefined) return itemTrack.itemLevel
        switch (raidDiff) {
            case 'Heroic':
                return itemData.ilvlHeroic
            case 'Mythic':
                return itemData.ilvlMythic
            case 'Normal':
                return itemData.ilvlNormal
            default:
                return itemData.ilvlBase
        }
    }

    const currentIlvl = getIlvl()
    const hrefString = `${itemData.wowheadUrl}&ilvl=${currentIlvl}}`

    return (
        <a className="" href={hrefString} rel="noreferrer" target="_blank">
            <div className={cn(`flex items-center`, className)}>
                <div className="relative inline-block">
                    <img
                        src={itemData.iconUrl}
                        alt=""
                        className={cn(
                            'object-cover object-top rounded-full h-10 w-10 border border-background block',
                            iconClassName
                        )}
                    />
                    {catalystBanner && (
                        <div className="absolute top-0 right-1 bg-red-600 text-white text-[7px] font-bold px-2 rounded-b-sm border border-background">
                            CAT
                        </div>
                    )}
                    {tierBanner && (itemData.tierset || itemData.token) && (
                        <div className="absolute -bottom-1 left-0 right-0 h-[1px] bg-red-600"></div>
                    )}
                </div>
                {!iconOnly && (
                    <div id="item-info" className="flex flex-col ml-3">
                        <p className="font-black text-xs">{itemData.name}</p>
                        <div className="flex">
                            {showSlot && itemData.slot && itemData.slot !== 'Trinket' && (
                                <p className="text-xs mr-1">{itemData.slot}</p>
                            )}
                            {(showSubclass || showIlvl) && ( // Only render if either subclass or ilvl is visible
                                <p className="text-xs">
                                    {showSubclass && itemData.itemSubclass}{' '}
                                    {/* Conditionally render subclass */}
                                    {showSubclass && showIlvl && ' • '}{' '}
                                    {/* Add separator if both are visible */}
                                    {showIlvl && currentIlvl} {/* Conditionally render ilvl */}
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </a>
    )
}
