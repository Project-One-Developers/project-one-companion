import { Item, WowRaidDifficulty } from '@shared/types/types'

export const WowItemIcon = ({
    item,
    iconOnly,
    iconClassName,
    raidDiff = 'Heroic',
    className
}: {
    item: Item
    iconOnly: boolean
    iconClassName: string
    raidDiff: WowRaidDifficulty
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
