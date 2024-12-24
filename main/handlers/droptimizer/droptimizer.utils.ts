import { z } from "zod";
import { csvDataSchema, jsonDataSchema } from "./droptimizer.schemas";

export const fetchRaidbotsData = async (
    url: string,
): Promise<{ csvData: string; jsonData: any }> => {
    const [responseCsv, responseJson] = await Promise.all([
        fetch(`${url}/data.csv`),
        fetch(`${url}/data.json`),
    ]);

    if (!responseCsv.ok || !responseJson.ok) {
        const errors = [];
        if (!responseCsv.ok) {
            errors.push(
                `Failed to fetch CSV data: ${responseCsv.status} ${responseCsv.statusText}`,
            );
        }
        if (!responseJson.ok) {
            errors.push(
                `Failed to fetch JSON data: ${responseJson.status} ${responseJson.statusText}`,
            );
        }
        throw new Error(errors.join("\n"));
    }

    const [csvData, jsonData] = await Promise.all([
        responseCsv.text(),
        responseJson.json(),
    ]);

    return { csvData, jsonData };
};

export const parseRaidbotsData = (
    csvData: string,
    jsonData: any,
): {
    parsedCsv: z.infer<typeof csvDataSchema>;
    parsedJson: z.infer<typeof jsonDataSchema>;
} => {
    const parsedCsv = csvDataSchema.parse(csvData);
    const parsedJson = jsonDataSchema.parse(jsonData);

    return { parsedCsv, parsedJson };
};
