import React from 'react'
import { WowGearIcon } from './wowgear-icon'

export const createGearSlotMapping = (itemsEquipped: any[]) => {
    return itemsEquipped.reduce(
        (acc, gearItem) => {
            if (gearItem.equippedInSlot) {
                acc[gearItem.equippedInSlot] = gearItem
            }
            return acc
        },
        {} as Record<string, any>
    )
}

interface BaseGearSlotProps {
    equippedItem?: any
    className?: string
    iconClassName?: string
    showTierBanner?: boolean
    rightSide?: boolean
    showExtendedInfo: boolean
    flipExtendedInfo?: boolean
    children?: React.ReactNode // For additional content like "best item" in wow-audit
}

export default function BaseGearSlot({
    equippedItem,
    className = '',
    iconClassName = 'rounded-lg h-16 w-16 border-2 border-background shadow-lg',
    showTierBanner = false,
    showExtendedInfo = false,
    flipExtendedInfo = false,
    children
}: BaseGearSlotProps) {
    return (
        <div className={`flex flex-col items-center gap-2 ${className}`}>
            <div className="relative">
                {equippedItem ? (
                    <WowGearIcon
                        gearItem={equippedItem}
                        showTiersetLine={showTierBanner}
                        showExtendedInfo={showExtendedInfo}
                        flipExtendedInfo={flipExtendedInfo}
                        iconClassName={iconClassName}
                    />
                ) : (
                    <div className="rounded-lg h-16 w-16 border-2 border-dashed border-muted bg-muted/20" />
                )}
            </div>
            {children}
        </div>
    )
}
