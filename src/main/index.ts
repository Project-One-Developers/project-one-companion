/* eslint-disable @typescript-eslint/no-floating-promises */
import { is } from '@electron-toolkit/utils'
import { closeDb } from '@storage/storage.config'
import dotenv from 'dotenv'
import { BrowserWindow, Menu, app, screen, session, shell } from 'electron'
import fs from 'fs'
import os from 'os'
import path, { join } from 'path'
import icon from '../../build/icon.png'
import { menu } from './app/menu'
import { store } from './app/store'
import { allHandlers } from './handlers'
import { checkWowAuditUpdates } from './handlers/characters/characters.handlers'
import { syncDroptimizersFromDiscord } from './handlers/droptimizer/droptimizer.handlers'
import { registerHandlers } from './handlers/handlers.utils'
import { updateElectronApp } from './lib/autoupdater/autoupdater'

async function loadReactDevTools() {
    let reactDevToolsPath = ''
    if (process.platform === 'win32') {
        reactDevToolsPath = path.join(
            os.homedir(),
            '/AppData/Local/Google/Chrome/User Data/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/6.1.0.1_0'
        )
    } else if (process.platform === 'linux') {
        reactDevToolsPath = path.join(
            os.homedir(),
            '/.config/google-chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/6.1.0.1_0'
        )
    } else if (process.platform === 'darwin') {
        reactDevToolsPath = path.join(
            os.homedir(),
            '/Library/Application Support/Google/Chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/6.1.0.1_0'
        )
    }
    if (reactDevToolsPath && fs.existsSync(reactDevToolsPath)) {
        await session.defaultSession.loadExtension(reactDevToolsPath)
    }
}

function createWindow(): void {
    const savedBounds = store.getBounds()
    const screenArea = screen.getDisplayMatching(savedBounds).workArea
    const isWindowNotFitScreen =
        savedBounds.x > screenArea.x + screenArea.width ||
        savedBounds.x < screenArea.x ||
        savedBounds.y < screenArea.y ||
        savedBounds.y > screenArea.y + screenArea.height

    const mainWindow = new BrowserWindow({
        width: savedBounds.width,
        height: savedBounds.height,
        minWidth: 720,
        minHeight: 320,
        show: false,
        autoHideMenuBar: true,
        ...(process.platform === 'linux' ? { icon } : {}),
        webPreferences: {
            preload: join(__dirname, '../preload/index.js'),
            sandbox: false, // Set to false since we're using contextIsolation
            nodeIntegration: false, // Keep this false for security
            contextIsolation: true, // Keep this true for security
            webSecurity: true // Optional but recommended
        }
    })

    mainWindow.setBounds(isWindowNotFitScreen ? store.DEFAULT_BOUNDS : savedBounds)

    mainWindow.on('ready-to-show', () => {
        mainWindow.show()
    })

    mainWindow.on('close', () => {
        const bounds = mainWindow.getBounds()
        store.setBounds(bounds)
    })

    mainWindow.on('minimize', () => {
        if (mainWindow.isMinimized()) {
            mainWindow.minimize()
            if (process.platform === 'darwin') {
                app.dock?.hide()
            }
        }
    })

    // Make all links open with the browser, not with the application
    mainWindow.webContents.setWindowOpenHandler(details => {
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
}

async function initializeP1Companion() {
    // load dotenv environments values
    dotenv.config()

    // check for updates
    updateElectronApp()

    // BE Handlers
    registerHandlers(allHandlers)

    // sync wowaudit and discord droptimizers
    await Promise.all([checkWowAuditUpdates(), syncDroptimizersFromDiscord(12)])
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
    // Set app user model id for windows
    app.setAppUserModelId(import.meta.env.VITE_APPID)

    // Default open or close DevTools by F12 in development
    // and ignore CommandOrControl + R in production.
    // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
    app.on('browser-window-created', (_, window) => {
        //optimizer.watchWindowShortcuts(window)
        window.webContents.on('before-input-event', (event, input) => {
            const key = input.key.toLowerCase()
            if ((input.control || input.meta) && input.shift && key === 'i') {
                event.preventDefault()
                window.webContents.toggleDevTools()
            }
            if (key === 'f5' || (key === 'r' && (input.control || input.meta))) {
                event.preventDefault()
                window.webContents.reload()
            }
            // Ctrl/Command A for selecting all text in inpit
            if (key === 'a' && (input.control || input.meta)) {
                event.preventDefault()
                window.webContents.executeJavaScript(`document.execCommand('selectAll')`)
            }
        })
    })

    createWindow()

    // p1 companion specific startup routine
    await initializeP1Companion()

    if (is.dev) {
        await loadReactDevTools()
    }

    if (process.platform === 'darwin') {
        app.dock?.show()
    }

    app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()

            if (process.platform === 'darwin') {
                void app.dock?.show()
            }
        }
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

app.on('before-quit', event => {
    // Prevent quitting immediately
    event.preventDefault()

    closeDb()
        .then(() => {
            console.log('Database closed successfully')
            app.exit(0)
        })
        .catch(error => {
            console.error('Failed to close database:', error)
            app.exit(1)
        })
})

// https://github.com/electron/electron/issues/32760
if (process.platform === 'linux') {
    app.disableHardwareAcceleration()
}

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
Menu.setApplicationMenu(menu)
