import { Droptimizer, NewDroptimizer } from "@/lib/types";
import { addDroptimizer } from "main/lib/storage/droptimizer/droptimizer.storage";
import { fetchRaidbotsData, parseRaidbotsData } from "./droptimizer.utils";

export const addDroptimizerHandler = async (
    url: string,
): Promise<Droptimizer | null> => {
    console.log("Adding droptimizer from url", url);

    const { csvData, jsonData } = await fetchRaidbotsData(url);

    const { parsedCsv, parsedJson } = parseRaidbotsData(csvData, jsonData);

    // todo: salvare anche gli upgrades
    const droptimizer: NewDroptimizer = {
        characterName: parsedCsv.characterName,
        raidDifficulty: parsedJson.difficulty,
        fightInfo: {
            fightstyle: parsedJson.fightStyle,
            duration: parsedJson.duration,
            nTargets: parsedJson.targets,
        },
        url,
        resultRaw: csvData,
        date: parsedJson.date,
    };

    return await addDroptimizer(droptimizer);
};
