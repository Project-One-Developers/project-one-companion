import { formatWowEquippedSlotKey } from '@shared/libs/items/item-slot-utils'
import { CharacterWowAudit } from '@shared/types/types'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { WowGearIcon } from './ui/wowgear-icon'

export default function WowAuditData({ data: wowAudit }: { data: CharacterWowAudit }) {
    return (
        <div className="w-full flex flex-col gap-y-4">
            <p className="mt-6 font-bold">Equipped gear</p>
            <div className="w-full">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {wowAudit.itemsEquipped.map(gearItem => {
                                return (
                                    <TableHead key={gearItem.item.id}>
                                        {formatWowEquippedSlotKey(gearItem.equippedInSlot!)}
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            {wowAudit.itemsEquipped.map(gearItem => {
                                const tiesetInSlot = wowAudit.tiersetInfo.some(
                                    t => t.item.slotKey === gearItem.item.slotKey
                                )
                                return (
                                    <TableCell key={gearItem.item.id}>
                                        <WowGearIcon
                                            gearItem={gearItem}
                                            showTierBanner={tiesetInSlot}
                                            iconClassName="rounded-lg h-10 w-10 border border-background"
                                        />
                                    </TableCell>
                                )
                            })}
                        </TableRow>
                        <TableRow>
                            {wowAudit.itemsEquipped.map(gearItem => {
                                const slot = gearItem.equippedInSlot!
                                const bestGearInSlot = wowAudit.bestItemsEquipped.find(
                                    b => b.equippedInSlot === slot
                                )
                                if (gearItem === bestGearInSlot) return null
                                else if (
                                    bestGearInSlot &&
                                    bestGearInSlot.item.id !== gearItem.item.id
                                ) {
                                    return (
                                        <TableCell key={gearItem.item.id}>
                                            <WowGearIcon
                                                gearItem={bestGearInSlot}
                                                showTierBanner={false}
                                                iconClassName="rounded-lg h-10 w-10 border border-background"
                                            />
                                        </TableCell>
                                    )
                                } else return <TableCell key={gearItem.item.id} />
                            })}
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
            <p className="mt-6 font-bold">Tier set</p>
            <div className="w-full">
                <div className="flex gap-x-2">
                    {wowAudit.tiersetInfo.map(tierItem => {
                        return (
                            <WowGearIcon
                                key={tierItem.item.id}
                                gearItem={tierItem}
                                showTierBanner={false}
                                iconClassName="rounded-lg h-10 w-10 border border-background"
                            />
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
