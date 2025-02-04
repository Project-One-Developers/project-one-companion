import { WowItemIcon } from './ui/wowitem-icon'

type CurrentGreatVaultPanelProps = {
    weeklyChests:
        | {
              id: number
              bonusString: string
              itemLevel: number
          }[]
        | null
}

export const CurrentGreatVaultPanel = ({ weeklyChests }: CurrentGreatVaultPanelProps) => {
    return (
        <div className="flex flex-col p-6 bg-muted rounded-lg relative w-[310px]">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <p className="text-lg font-semibold">Current Great Vault</p>
                {/* <img
                    src={weeklyChestIcon}
                    alt="Weekly Chest Icon"
                    className="h-16 w-16 object-contain"
                /> */}
            </div>
            {/* Chest Items */}
            <div className="flex flex-wrap gap-2">
                {!weeklyChests ? <div>No great vault info</div> : null}
                {weeklyChests &&
                    weeklyChests.map((wc) => (
                        <WowItemIcon
                            key={wc.id}
                            item={wc.id}
                            iconOnly={false}
                            bonusString={wc.bonusString}
                            ilvl={wc.itemLevel}
                            iconClassName="object-cover object-top rounded-lg h-8 w-8 border border-background"
                        />
                    ))}
            </div>
        </div>
    )
}
