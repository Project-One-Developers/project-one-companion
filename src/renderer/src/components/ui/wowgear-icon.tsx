import { gearhasSocket, gearTertiary } from '@shared/libs/items/item-bonus-utils'
import { GearItem } from '@shared/types/types'

type WowGearIconProps = {
    item: GearItem
    showTierBanner?: boolean
    showItemTrackDiff?: boolean
    className?: string
    iconClassName?: string
}

export const WowGearIcon = ({
    item: gear,
    showTierBanner = false,
    showItemTrackDiff = true,
    className,
    iconClassName
}: WowGearIconProps) => {
    const hasSocket = gearhasSocket(gear.bonusIds)
    const hasSpecials = hasSocket || gearTertiary(gear.bonusIds)
    const iconUrl = `https://wow.zamimg.com/images/wow/icons/large/${gear.item.iconName}.jpg`

    // todo: avoid setting explicit ilvl if bonus id is present
    const hrefString = `https://www.wowhead.com/item=${gear.item.id}&ilvl=${gear.itemLevel}${gear.bonusIds ? `&bonus=${gear.bonusIds.join(':')}` : ''}${gear.enchantIds ? `&ench=${gear.enchantIds.join(':')}` : ''}${gear.gemIds ? `&gems=${gear.gemIds.join(':')}` : ''}`

    return (
        <a className="" href={hrefString} rel="noreferrer" target="_blank">
            <div className={`flex flex-col items-center ${className ?? ''}`}>
                <div className="relative inline-block">
                    <img
                        src={iconUrl}
                        alt=""
                        className={`object-cover object-top rounded-lg h-8 w-8 border border-background ${hasSpecials ? 'border-white' : ''} ${iconClassName} block`}
                    />
                    {showTierBanner && (gear.item.tierset || gear.item.token) && (
                        <div className="absolute -bottom-1 left-0 right-0 h-[1px] bg-red-600"></div>
                    )}
                    {hasSocket && (
                        <div className="absolute bottom-0 right-0">
                            <img
                                className="w-3 h-3 border"
                                src="https://www.raidbots.com/frontend/c6217d2ee6dd7647cbfa.png"
                            />
                        </div>
                    )}
                </div>
                <p className="flex text-bold text-[11px]">
                    {gear.itemLevel}
                    {showItemTrackDiff ? gear.itemTrack?.name.charAt(0) : ''}
                </p>
            </div>
        </a>
    )
}
