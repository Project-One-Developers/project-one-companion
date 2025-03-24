import { formatWowEquippedSlotKey } from '@shared/libs/items/item-slot-utils'
import { Droptimizer } from '@shared/types/types'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { WowGearIcon } from './ui/wowgear-icon'

export default function DroptimizerData({ droptimizer }: { droptimizer: Droptimizer }) {
    return (
        <div className="w-full flex flex-col gap-y-4">
            <p className="mt-6 font-bold">Equipped gear</p>
            <div className="w-full">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {droptimizer.itemsEquipped.map(gearItem => {
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
                            {droptimizer.itemsEquipped.map(gearItem => {
                                const tiesetInSlot = droptimizer.tiersetInfo.some(
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
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
