import { fetchItem } from '@renderer/lib/tanstack-query/items'
import { Item, WowRaidDifficulty } from '@shared/types/types'
import { useQuery } from '@tanstack/react-query'
import { LoaderCircle } from 'lucide-react'

export const WowItemIcon = ({
    item,
    iconOnly,
    catalystBanner = false,
    socketBanner = false,
    tierBanner = false,
    raidDiff = 'Heroic',
    ilvl,
    bonusString,
    className,
    iconClassName
}: {
    item: Item | number
    iconOnly: boolean
    catalystBanner?: boolean
    socketBanner?: boolean
    tierBanner?: boolean
    raidDiff?: WowRaidDifficulty
    ilvl?: number
    bonusString?: string
    className?: string
    iconClassName?: string
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
    if (!itemData) return null

    const getIlvl = () => {
        if (ilvl !== undefined) return ilvl
        switch (raidDiff) {
            case 'Heroic':
                return itemData.ilvlHeroic
            case 'Mythic':
                return itemData.ilvlMythic
            case 'Normal':
                return itemData.ilvlNormal
            default:
                return itemData.ilvlHeroic
        }
    }

    const currentIlvl = getIlvl()
    const hrefString = `${itemData.wowheadUrl}&ilvl=${currentIlvl}${bonusString ? `&bonus=${bonusString}` : ''}`

    return (
        <a className="" href={hrefString} rel="noreferrer" target="_blank">
            <div className={`flex items-center ${className}`}>
                <div className="relative inline-block">
                    <img src={itemData.iconUrl} alt="" className={`${iconClassName} block`} />
                    {catalystBanner && (
                        <div className="absolute top-0 right-1 bg-red-600 text-white text-[7px] font-bold px-2 rounded-b-sm border border-background">
                            CAT
                        </div>
                    )}
                    {tierBanner && itemData.tier && (
                        <div className="absolute -bottom-1 left-0 right-0 h-[1px] bg-red-600"></div>
                    )}
                    {socketBanner && (
                        <div className="absolute bottom-0 right-0">
                            <img
                                className="w-3 h-3 border"
                                src="https://www.raidbots.com/frontend/c6217d2ee6dd7647cbfa.png"
                            />
                        </div>
                    )}
                </div>
                {!iconOnly && (
                    <div id="item-info" className="flex flex-col ml-3">
                        <p className="font-black text-xs">{itemData.name}</p>
                        <div className="flex">
                            {itemData.slot && itemData.slot !== 'Trinket' && (
                                <p className="text-xs mr-1">{itemData.slot}</p>
                            )}
                            <p className="text-xs">
                                {itemData.itemSubclass} • {currentIlvl}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </a>
    )
}
