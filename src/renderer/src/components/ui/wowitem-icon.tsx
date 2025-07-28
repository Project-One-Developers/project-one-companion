import { fetchItem } from '@renderer/lib/tanstack-query/items'
import { cn } from '@renderer/lib/utils'
import { isHealerItem, isTankItem } from '@shared/libs/spec-parser/spec-utils'
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
    showIlvl = true,
    showRoleIcons = false
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
    showRoleIcons?: boolean
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

    // role badges
    let healerItem: boolean | undefined
    let tankItem: boolean | undefined
    if (showRoleIcons) {
        healerItem = isHealerItem(itemData)
        tankItem = isTankItem(itemData)
    }

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
                    {healerItem && (
                        <div className="absolute -top-1 -left-1 w-4 h-4 bg-yellow-500 rounded-sm flex items-center justify-center">
                            <svg
                                className="w-3 h-3 text-yellow-900"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 2a1.5 1.5 0 011.5 1.5v4h4a1.5 1.5 0 110 3h-4v4a1.5 1.5 0 11-3 0v-4h-4a1.5 1.5 0 110-3h4v-4A1.5 1.5 0 0110 2z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                    )}
                    {tankItem && (
                        <div className="absolute -top-1 -left-1 w-4 h-4 bg-yellow-500 rounded-sm flex items-center justify-center">
                            <svg
                                className="w-3 h-3 text-yellow-900"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
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
