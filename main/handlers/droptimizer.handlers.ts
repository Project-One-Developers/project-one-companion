import { Droptimizer, NewDroptimizer } from "@/lib/types";
import { addDroptimizer } from "main/lib/storage/droptimizer/droptimizer.storage";

export const addDroptimizerHandler = async (
    url: string,
): Promise<Droptimizer | null> => {
    console.log("Adding droptimizer from url", url);

    const responseCsv = await fetch(`${url}/data.csv`);
    const responseJson = await fetch(`${url}/data.json`);
    // TODO: check if response is ok

    const csvData = await responseCsv.text();
    const jsonData = await responseJson.json();

    let tmpData = csvData.split("\n").map((row) => ({
        name: row.split(",")[0],
        dmg: row.split(",")[1],
    }));
    tmpData = tmpData.slice(1);
    const charName = tmpData[0].name;
    const charBaseDmg = tmpData[0].dmg;

    const upgrades = tmpData
        .slice(1)
        .map((d) => ({
            itemId: d.name.split("/")[3],
            dmg: Math.round(Number(d.dmg) - Number(charBaseDmg)),
        }))
        .filter((d) => d.dmg > 0);

    const fightStyle = jsonData.sim.options.fight_style;
    const targets = jsonData.sim.options.desired_targets;
    const time = jsonData.sim.options.max_time;
    const difficulty = jsonData.simbot.title.split("•")[2].replaceAll(" ", "");

    const simType = jsonData.simbot.symType;
    if (simType !== "droptimizer") {
        console.log("Problemone");
        console.log(simType);
        // todo: throw err?
    }

    // todo: salvare anche gli upgrades
    const droptimizer: NewDroptimizer = {
        characterName: charName,
        raidDifficulty: difficulty,
        fightInfo: {
            fightstyle: fightStyle,
            duration: time,
            nTargets: targets,
        },
        url,
        resultRaw: jsonData,
        date: jsonData.timestamp,
    };

    return await addDroptimizer(droptimizer);
};
