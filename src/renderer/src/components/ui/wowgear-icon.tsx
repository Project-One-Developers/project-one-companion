import { GearItem } from '@shared/types/types'

type WowGearIconProps = {
    item: GearItem
    tierBanner?: boolean
    className?: string
    iconClassName?: string
}

export const WowGearIcon = ({
    item: gear,
    tierBanner = false,
    className,
    iconClassName
}: WowGearIconProps) => {
    const hasSocket = false // todo implement
    const iconUrl = `https://wow.zamimg.com/images/wow/icons/large/${gear.item.iconName}.jpg`
    const hrefString = `https://www.wowhead.com/item=${gear.item.id}&ilvl=${gear.itemLevel}${gear.bonusIds ? `&bonus=${gear.bonusIds.join(':')}` : ''}${gear.enchantIds ? `&ench=${gear.enchantIds.join(':')}` : ''}${gear.gemIds ? `&gems=${gear.gemIds.join(':')}` : ''}`

    return (
        <a className="" href={hrefString} rel="noreferrer" target="_blank">
            <div className={`flex flex-col items-center ${className}`}>
                <div className="relative inline-block">
                    <img src={iconUrl} alt="" className={`${iconClassName} block`} />
                    {tierBanner && (gear.item.tierset || gear.item.token) && (
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
                    {gear.itemTrack?.name.charAt(0)}
                </p>
            </div>
        </a>
    )
}
