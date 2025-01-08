import { Item, WowRaidDifficulty } from '@shared/types/types'

export const WowItemIcon = ({
    item,
    iconOnly,
    iconClassName,
    catalystBanner = false,
    raidDiff = 'Heroic',
    className
}: {
    item: Item
    iconOnly: boolean
    iconClassName: string
    catalystBanner?: boolean
    raidDiff?: WowRaidDifficulty
    className: string
}) => {
    let ilvl
    if (raidDiff === 'Heroic') {
        ilvl = item.ilvlHeroic
    } else if (raidDiff === 'Mythic') {
        ilvl = item.ilvlMythic
    } else if (raidDiff === 'Normal') {
        ilvl = item.ilvlNormal
    }
    return (
        <a
            href={`${item.wowheadUrl}&ilvl=${ilvl}`}
            rel="noreferrer"
            // data-wowhead={`item=${item.id}?ilvl=${item.ilvlMythic}`}
            target="_blank"
        >
            <div className={`flex items-center space-x-3 ${className}`}>
                <img src={item.iconUrl} alt="" className={`${iconClassName}`}></img>
                {catalystBanner && (
                    <div className="absolute top-1 right-1 bg-red-600 text-white text-[7px] font-bold px-2 rounded-b-sm border border-background">
                        CAT
                    </div>
                )}
                {!iconOnly && (
                    <div id="item-info" className="flex flex-col">
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
