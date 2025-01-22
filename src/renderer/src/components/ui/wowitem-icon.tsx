import { Item, WowRaidDifficulty } from '@shared/types/types'

export const WowItemIcon = ({
    item,
    iconOnly,
    iconClassName,
    catalystBanner = false,
    socketBanner = false,
    tierBanner = false,
    raidDiff = 'Heroic',
    ilvl,
    className
}: {
    item: Item
    iconOnly: boolean
    iconClassName?: string
    catalystBanner?: boolean
    socketBanner?: boolean
    tierBanner?: boolean
    raidDiff?: WowRaidDifficulty
    ilvl?: number
    className: string
}) => {
    if (ilvl === undefined) {
        if (raidDiff === 'Heroic') {
            ilvl = item.ilvlHeroic
        } else if (raidDiff === 'Mythic') {
            ilvl = item.ilvlMythic
        } else if (raidDiff === 'Normal') {
            ilvl = item.ilvlNormal
        }
    }

    return (
        <a
            className=""
            href={`${item.wowheadUrl}&ilvl=${ilvl}`}
            rel="noreferrer"
            // data-wowhead={`item=${item.id}?ilvl=${item.ilvlMythic}`} https://www.raidbots.com/frontend/c6217d2ee6dd7647cbfa.png
            target="_blank"
        >
            <div className={`flex items-center ${className}`}>
                <div className="relative inline-block">
                    <img src={item.iconUrl} alt="" className={`${iconClassName} block`} />
                    {catalystBanner && (
                        <div className="absolute top-0 right-1 bg-red-600 text-white text-[7px] font-bold px-2 rounded-b-sm border border-background">
                            CAT
                        </div>
                    )}
                    {/* {tierBanner && item.tier && (
                       <div className="absolute top-0 right-1 bg-red-600 text-white text-[7px] font-bold px-2 rounded-b-sm border border-background">
                           TIER
                       </div>
                   )} */}
                    {tierBanner && item.tier && (
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
                        <p className="font-black text-xs">{item.name}</p>
                        <div className="flex">
                            {item.slot && item.slot !== 'Trinket' && (
                                <p className="text-xs mr-1">{item.slot}</p>
                            )}
                            <p className="text-xs">{item.itemSubclass}</p>
                        </div>
                    </div>
                )}
            </div>
        </a>
    )
}
