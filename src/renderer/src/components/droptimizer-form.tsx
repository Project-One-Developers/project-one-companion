import { zodResolver } from '@hookform/resolvers/zod'
import { raidbotsURLSchema } from '@shared/schemas/simulations.schemas'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useToast } from './hooks/use-toast'
import { Button } from './ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'

import type { JSX } from 'react'

const formSchema = z.object({
    url: raidbotsURLSchema
})
type FormValues = z.infer<typeof formSchema>

export default function NewDroptimizerForm(): JSX.Element {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            url: ''
        }
    })

    const { toast } = useToast()

    async function onSubmit(values: FormValues): Promise<void> {
        const droptimizer = await window.api.addDroptimizer(values.url)

        if (droptimizer) {
            toast({
                title: 'Aggiunta droptimizer',
                description: `Il droptimizer per il pg ${droptimizer.characterName} è stato aggiunto con successo.`
            })
        } else {
            toast({
                title: 'Errore',
                description: `Non è stato possibile aggiungere il droptimizer.`
            })
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 min-w-[600px]">
                <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Droptimizer URL</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="disabled:bg-gray-500">
                    Submit
                </Button>
            </form>
        </Form>
    )
}
