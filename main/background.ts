import { app, ipcMain } from "electron";
import serve from "electron-serve";
import path from "path";
import { createWindow } from "./helpers";
import storage from "./storage";
import { registerAllHandlers } from "./handlers";

const isProd = process.env.NODE_ENV === "production";

if (isProd) {
    serve({ directory: "app" });
} else {
    app.setPath("userData", `${app.getPath("userData")} (development)`);
}

(async () => {
    await app.whenReady();

    registerAllHandlers()

    const mainWindow = createWindow("main", {
        width: 1000,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
        },
    });

    if (isProd) {
        await mainWindow.loadURL("app://./home");
    } else {
        const port = process.argv[2];
        await mainWindow.loadURL(`http://localhost:${port}/home`);
        mainWindow.webContents.openDevTools();
    }
})();

app.on("window-all-closed", () => {
    app.quit();
});

ipcMain.handle("get-player", async (event, args) => {
    return await storage.getPlayerByName(args);
});

ipcMain.handle("add-character", async (event, args) => {
    return await storage.addCharacter(args);
});
