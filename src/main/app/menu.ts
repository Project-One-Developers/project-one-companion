import { Menu, app, type MenuItemConstructorOptions } from 'electron'

const isDev = !app.isPackaged
const isMac = process.platform === 'darwin'

const appName = import.meta.env.VITE_TITLE

const menuMac: Array<MenuItemConstructorOptions> = [
    {
        role: 'appMenu',
        label: appName,
        submenu: [
            { role: 'about', label: `About ${appName}` },
            { type: 'separator' },
            { role: 'hide', label: `Hide ${appName}` },
            { role: 'hideOthers', label: 'Hide Others' },
            { role: 'unhide', label: 'Show All' },
            { type: 'separator' },
            { role: 'quit', label: `Quit ${appName}` }
        ]
    },
    {
        role: 'fileMenu',
        label: 'File',
        submenu: [{ role: 'close', label: 'Close Window' }]
    },
    {
        role: 'editMenu',
        label: 'Edit',
        submenu: [
            { role: 'undo', label: 'Undo' },
            { role: 'redo', label: 'Redo' },
            { type: 'separator' },
            { role: 'cut', label: 'Cut' },
            { role: 'copy', label: 'Copy' },
            { role: 'paste', label: 'Paste' },
            { type: 'separator' }
        ]
    },
    {
        label: 'View',
        role: 'viewMenu',
        submenu: [
            { role: 'reload', label: 'Reload', visible: isDev, enabled: isDev },
            {
                role: 'forceReload',
                label: 'Force Reload',
                visible: isDev,
                enabled: isDev
            },
            {
                role: 'toggleDevTools',
                label: 'Toggle Developer Tools',
                visible: isDev,
                enabled: isDev
            },
            { role: 'resetZoom', label: 'Actual Size' },
            { role: 'zoomIn', label: 'Zoom In' },
            { role: 'zoomOut', label: 'Zoom Out' }
        ]
    },
    {
        label: 'Window',
        role: 'windowMenu',
        submenu: [
            { role: 'minimize', label: 'Minimize' },
            { role: 'zoom', label: 'Zoom' },
            { type: 'separator' },
            { role: 'front', label: 'Bring All to Front' }
        ]
    }
]

const menuWindows: Array<MenuItemConstructorOptions> = [
    {
        role: 'fileMenu',
        label: 'File',
        submenu: [{ role: 'quit', label: `Quit ${appName}` }]
    },
    {
        role: 'editMenu',
        label: 'Edit',
        submenu: [
            { role: 'undo', label: 'Undo' },
            { role: 'redo', label: 'Redo' },
            { type: 'separator' },
            { role: 'cut', label: 'Cut' },
            { role: 'copy', label: 'Copy' },
            { role: 'paste', label: 'Paste' },
            { type: 'separator' }
        ]
    },
    {
        label: 'View',
        role: 'viewMenu',
        submenu: [
            { role: 'reload', label: 'Reload', visible: isDev, enabled: isDev },
            {
                role: 'forceReload',
                label: 'Force Reload',
                visible: isDev,
                enabled: isDev
            },
            {
                role: 'toggleDevTools',
                label: 'Toggle Developer Tools',
                visible: isDev,
                enabled: isDev
            },
            { role: 'resetZoom', label: 'Reset Zoom' },
            { role: 'zoomIn', label: 'Zoom In' },
            { role: 'zoomOut', label: 'Zoom Out' }
        ]
    },
    {
        label: 'Window',
        role: 'windowMenu',
        submenu: [
            { role: 'minimize', label: 'Minimize' },
            { role: 'zoom', label: 'Maximize' },
            { type: 'separator' },
            { role: 'close', label: 'Close Window' }
        ]
    }
]

export const menu = Menu.buildFromTemplate(isMac ? menuMac : menuWindows)
