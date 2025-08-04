import { formatWowEquippedSlotKey } from '@shared/libs/items/item-slot-utils'
import { CharacterRaiderio } from '@shared/schemas/raiderio.schemas'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { WowGearIcon } from './ui/wowgear-icon'

export default function RaiderioData({ data }: { data: CharacterRaiderio }) {
    return (
        <div className="w-full flex flex-col gap-y-4">
            <p className="mt-6 font-bold">Equipped gear</p>
            <div className="w-full">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {data.itemsEquipped.map(gearItem => {
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
                            {data.itemsEquipped.map(gearItem => {
                                return (
                                    <TableCell key={gearItem.item.id}>
                                        <WowGearIcon
                                            gearItem={gearItem}
                                            showTierBanner={true}
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
