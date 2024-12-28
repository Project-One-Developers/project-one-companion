import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { app, BrowserWindow, shell } from 'electron'
import fs from 'fs'
import path, { join } from 'path'
import { z } from 'zod'
import icon from '../../resources/icon.png?asset'
import { allHandlers } from './handlers'
import { registerHandlers } from './handlers/handlers.utils'

const DEFAULT_WIDTH = 1920
const DEFAULT_HEIGHT = 1080

const MIN_WIDTH = 1024
const MIN_HEIGHT = 900

const boundsSchema = z.object({
    width: z.number().int().min(MIN_WIDTH).default(DEFAULT_WIDTH),
    height: z.number().int().min(MIN_HEIGHT).default(DEFAULT_HEIGHT),
    x: z.number().int().optional(),
    y: z.number().int().optional()
})

const configPath = path.join(app.getPath('userData'), 'projectone-companion-config.json')

function loadWindowSettings(): z.infer<typeof boundsSchema> {
    try {
        return boundsSchema.parse(JSON.parse(fs.readFileSync(configPath, 'utf-8')))
    } catch (error) {
        return { width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT }
    }
}

function saveWindowSettings(bounds: Electron.Rectangle): void {
    fs.writeFileSync(configPath, JSON.stringify(bounds))
}

function createWindow(): void {
    const windowSettings = loadWindowSettings()

    const mainWindow = new BrowserWindow({
        width: windowSettings.width,
        height: windowSettings.height,
        minWidth: MIN_WIDTH,
        minHeight: MIN_HEIGHT,
        x: windowSettings.x,
        y: windowSettings.y,
        show: false,
        autoHideMenuBar: true,
        ...(process.platform === 'linux' ? { icon } : {}),
        webPreferences: {
            preload: join(__dirname, '../preload/index.js'),
            sandbox: false
        }
    })

    mainWindow.on('ready-to-show', () => {
        mainWindow.show()
    })

    mainWindow.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url)
        return { action: 'deny' }
    })

    // HMR for renderer base on electron-vite cli.
    // Load the remote URL for development or the local html file for production.
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    } else {
        mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
    }

    mainWindow.on('close', () => {
        saveWindowSettings(mainWindow.getBounds())
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    // Set app user model id for windows
    electronApp.setAppUserModelId('com.electron')

    // Default open or close DevTools by F12 in development
    // and ignore CommandOrControl + R in production.
    // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
    app.on('browser-window-created', (_, window) => {
        optimizer.watchWindowShortcuts(window)
    })

    registerHandlers(allHandlers)

    createWindow()

    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
