import { TooltipArrow } from '@radix-ui/react-tooltip'
import { classIcon } from '@renderer/lib/wow-icon'
import { WowClassName } from '@shared/types/types'
import React from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip'

interface WowClassIconProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    wowClassName: WowClassName
    charname?: string
}

export const WowClassIcon: React.FC<WowClassIconProps> = ({ wowClassName, charname, ...props }) => {
    const showTooltip = charname && charname.length > 0

    if (!showTooltip) {
        return <img src={classIcon.get(wowClassName)} alt={`Class ${wowClassName}`} {...props} />
    } else {
        return (
            <Tooltip>
                <TooltipTrigger asChild>
                    <img
                        src={classIcon.get(wowClassName)}
                        alt={`Class ${wowClassName}`}
                        {...props}
                    />
                </TooltipTrigger>
                <TooltipContent className="TooltipContent" sideOffset={5}>
                    {charname}
                    <TooltipArrow className="TooltipArrow" />
                </TooltipContent>
            </Tooltip>
        )
    }
}
