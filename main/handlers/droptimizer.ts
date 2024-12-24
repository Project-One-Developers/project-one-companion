import { NewDroptimizer } from "@/lib/types";
import { ipcMain } from "electron";
import { addDroptimizer } from "main/storage/droptimizer/droptimizer.storage";

export const registerDroptimizerHandlers = () => {
    ipcMain.handle(
        "add-droptimizer",
        async (event, { droptimizer }: { droptimizer: NewDroptimizer }) => {
            return await addDroptimizer(droptimizer);
        },
    );
};
