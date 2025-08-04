import { WowItemEquippedSlotKey } from '@shared/types/types'
import { ReactNode } from 'react'

interface CharacterPaperdollProps {
    renderGearSlot: (
        slotKey: WowItemEquippedSlotKey,
        options?: { rightSide?: boolean }
    ) => ReactNode
}

export default function CharacterPaperdoll({ renderGearSlot }: CharacterPaperdollProps) {
    return (
        <div className="relative max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                {/* Left Side */}
                <div className="flex flex-col gap-6 items-start">
                    {renderGearSlot('head')}
                    {renderGearSlot('neck')}
                    {renderGearSlot('shoulder')}
                    {renderGearSlot('back')}
                    {renderGearSlot('chest')}
                    {renderGearSlot('wrist')}
                </div>

                {/* Right Side */}
                <div className="flex flex-col gap-6 items-end">
                    {renderGearSlot('hands', { rightSide: true })}
                    {renderGearSlot('waist', { rightSide: true })}
                    {renderGearSlot('legs', { rightSide: true })}
                    {renderGearSlot('feet', { rightSide: true })}
                    {renderGearSlot('finger1', { rightSide: true })}
                    {renderGearSlot('finger2', { rightSide: true })}
                </div>
            </div>

            {/* Bottom Row - Weapons */}
            <div className="flex justify-center items-start gap-12">
                {renderGearSlot('main_hand')}
                {renderGearSlot('off_hand')}
                {renderGearSlot('trinket1')}
                {renderGearSlot('trinket2')}
            </div>
        </div>
    )
}
