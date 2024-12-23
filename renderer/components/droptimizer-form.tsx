import { newDroptimizerSchema } from "@/lib/schemas";
import { addDroptimizer } from "@/lib/storage/droptimizer/droptimizer.storage";
import { Droptimizer, NewDroptimizer } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "./hooks/use-toast";
import { Button } from "./ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";

export default function NewDroptimizerForm() {
    const form = useForm<NewDroptimizer>({
        resolver: zodResolver(newDroptimizerSchema),
        defaultValues: {
            url: "",
        },
    });

    const { toast } = useToast();

    async function parseReport(url: string): Promise<Droptimizer> {
        const responseCsv = await fetch(`${url}/data.csv`);
        const responseJson = await fetch(`${url}/data.json`);
        const csvData = await responseCsv.text();
        const jsonData = await responseJson.json();

        let tmpData = csvData.split("\n").map((row) => ({
            name: row.split(",")[0],
            dmg: row.split(",")[1],
        }));
        tmpData = tmpData.slice(1);
        const charName = tmpData[0].name;
        const charBaseDmg = tmpData[0].dmg;

        const parsedData = tmpData
            .slice(1)
            .map((d) => ({
                name: d.name.split("/")[3],
                dmg: Math.round(Number(d.dmg) - Number(charBaseDmg)),
            }))
            .filter((d) => d.dmg > 0);

        const fightStyle = jsonData.sim.options.fight_style;
        const targets = jsonData.sim.options.desired_targets;
        const time = jsonData.sim.options.max_time;
        const difficulty = jsonData.simbot.title
            .split("•")[2]
            .replaceAll(" ", "");

        const res: Droptimizer = {
            characterName: charName,
            raidDifficulty: difficulty,
            fightInfo: {
                fightstyle: fightStyle,
                duration: time,
                nTargets: targets,
            },
            url: url,
            resultRaw: "",
            date: 0,
        };

        return res;
    }

    async function onSubmit(values: NewDroptimizer) {
        const parsedReport = await parseReport(values.url);
        addDroptimizer(parsedReport);

        toast({
            title: "Aggiunta droptimizer",
            description: `Il droptimizer per il pg ${parsedReport.characterName} è stato aggiunto con successo.`,
        });
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 min-w-[600px]"
            >
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
    );
}
