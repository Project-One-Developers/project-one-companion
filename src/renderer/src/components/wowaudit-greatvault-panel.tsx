import { CheckCircle, XCircle } from 'lucide-react'

type NextWeeklyChestPanelProps = {
    greatVault: {
        slot1: number | null
        slot2: number | null
        slot3: number | null
        slot4: number | null
        slot5: number | null
        slot6: number | null
        slot7: number | null
        slot8: number | null
        slot9: number | null
    } | null
}

export const NextGreatVaultPanel = ({ greatVault }: NextWeeklyChestPanelProps) => {
    if (!greatVault) {
        return (
            <div className="flex flex-col p-6 bg-muted rounded-lg relative w-[310px]">
                <div className="flex justify-between items-center mb-4">
                    <p className="text-lg font-semibold">Next Great Vault</p>
                </div>
                <div>No great vault info</div>
            </div>
        )
    }

    // Group slots into categories
    const categories = [
        { title: 'Raid', rewards: [greatVault.slot1, greatVault.slot2, greatVault.slot3] },
        {
            title: 'Plus',
            rewards: [greatVault.slot4, greatVault.slot5, greatVault.slot6]
        },
        { title: 'World', rewards: [greatVault.slot7, greatVault.slot8, greatVault.slot9] }
    ]

    return (
        <div className="flex flex-col p-6 bg-muted rounded-lg relative w-[310px]">
            <div className="flex justify-between items-center mb-4">
                <p className="text-lg font-semibold">Next Great Vault</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {categories.map(({ title, rewards }, categoryIndex) => (
                    <div key={categoryIndex} className="grid grid-cols-4 items-center">
                        <p className="text-sm font-medium">{title}</p>
                        {rewards.map((item, index) => (
                            <div key={index} className="flex flex-col items-center justify-center ">
                                {item ? (
                                    <CheckCircle className="text-green-500 w-6 h-6" />
                                ) : (
                                    <XCircle className="text-red-500 w-6 h-6" />
                                )}
                                <p className="text-xs font-medium">{item ? item : '-'}</p>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}
