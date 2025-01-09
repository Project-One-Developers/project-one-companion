import * as DialogPrimitive from '@radix-ui/react-dialog'
import { queryClient } from '@renderer/lib/tanstack-query/client'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import type { Droptimizer } from '@shared/types/types'
import { useMutation } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { toast } from './hooks/use-toast'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'

type DroptimizerDetailDialogProps = {
    droptimizer: Droptimizer
    isOpen: boolean
    setOpen: (open: boolean) => void
}

export default function DroptimizerDetailDialog({
    droptimizer,
    isOpen,
    setOpen
}: DroptimizerDetailDialogProps): JSX.Element {
    //const [open, setOpen] = useState(false)
    const { mutate, isPending } = useMutation({
        mutationFn: async () => console.log('ok'),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKeys.players] })
            setOpen(false)
            toast({
                title: 'Cancellazione droptimizer',
                description: `Il droptimizer ${droptimizer.url} è stato cancellato con successo.`
            })
        }
    })
    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                console.log('Dialog onOpenChange called with:', open)
                setOpen(open)
            }}
        >
            {/* <DialogTrigger className="absolute top-2 right-2 cursor-pointer">
                <X className="w-3" />
            </DialogTrigger> */}
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Droptimizer info</DialogTitle>
                    <DialogDescription>{droptimizer.charInfo.name}</DialogDescription>
                </DialogHeader>
                {/* <img
                    src="https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExY2w4YzhldHo5OGtnc29raXAzN2k0YnA4am5seWdleDJlZTdwcHlmdSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/4DvP1HK8UviaOuRcCY/giphy.gif"
                    alt="Be Careful"
                    width={400}
                    height={400}
                /> */}
                <DialogPrimitive.Close asChild>
                    <button className="IconButton" aria-label="Close">
                        test
                    </button>
                </DialogPrimitive.Close>

                <Button disabled={isPending} onClick={() => mutate()}>
                    {isPending ? <Loader2 className="animate-spin" /> : 'Conferma'}
                </Button>
            </DialogContent>
        </Dialog>
    )
}
