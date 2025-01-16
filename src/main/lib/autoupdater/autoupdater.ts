import { app, dialog, MessageBoxOptions, shell } from 'electron'
import logger from 'electron-log/main'
import { autoUpdater, UpdateDownloadedEvent, UpdateInfo } from 'electron-updater'

const isMacOS = process.platform === 'darwin'
const isLinux = process.platform === 'linux'
const supportedPlatforms = ['darwin', 'win32', 'linux']
const supportedAutodownloads = ['win32']

export type UpdateOptions = {
    /** How frequently to check for updates, in seconds. Defaults to 60 minutes (`3600`). */
    readonly updateInterval: number
    /** Prompts to apply the update immediately after download. Defaults to `false`. */
    readonly notifyUser: boolean
}

const checkForUpdates = async () => {
    // don't attempt to update during development
    // if (!isProdEnv()) {
    //     logger.log(`[Update] Unpacked app short-circuit triggered`)
    //     return
    // }
    autoUpdater.checkForUpdates()
}

const initUpdater = (opts: UpdateOptions) => {
    // exit early on unsupported platforms, e.g. `linux`
    if (!supportedPlatforms.includes(process?.platform)) {
        logger.log(
            `Electron's autoUpdater does not support the '${process.platform}' platform. Ref: https://www.electronjs.org/docs/latest/api/auto-updater#platform-notices`
        )
        return
    }
    if (!supportedAutodownloads.includes(process?.platform)) {
        // MacOS & Linux -> download in browser
        autoUpdater.autoDownload = false
    }

    autoUpdater.on('error', (err) => {
        logger.log('[Update] An error ocurred')
        logger.log(err)
    })

    autoUpdater.on('checking-for-update', () => {
        logger.log('[Update] Checking for updates...')
    })

    autoUpdater.on('update-available', (event: UpdateInfo) => {
        if (!opts.notifyUser) {
            logger.log('[Update] Update available; downloading...')
        } else {
            // for eg: MacOS & Linux
            logger.log('[Update] Update available. Prompting user to download...')
            const dialogOpts: MessageBoxOptions = {
                type: 'info',
                buttons: ['Download', 'Later'],
                title: 'Update Available',
                message: event.releaseName ?? 'New Update Available',
                detail: 'A new version of Project One Companion is available. Would you like to download it now?'
            }

            dialog.showMessageBox(dialogOpts).then(({ response }) => {
                if (response === 0) {
                    logger.log('[Update] User chose to download the update')
                    if (!autoUpdater.autoDownload) {
                        let fileUrl = ''
                        if (isMacOS) {
                            fileUrl =
                                event.files.find((file) => file.url.includes('.dmg'))?.url ??
                                event.files[0].url
                        } else if (isLinux) {
                            fileUrl =
                                event.files.find((file) => file.url.includes('.AppImage'))?.url ??
                                event.files[0].url
                        } else {
                            fileUrl = event.files[0].url
                        }
                        const url = `https://github.com/zerbiniandrea/projectone-companion/releases/download/v${event.version}/${fileUrl}`
                        // download from browser
                        shell.openExternal(url)
                    } else {
                        // use internal auto-updater
                        autoUpdater.downloadUpdate()
                    }
                } else {
                    logger.log('[Update] User chose to postpone the update')
                }
            })
        }
    })

    autoUpdater.on('download-progress', (event) => {
        logger.log('[Update] Download progress ' + event.percent + '%')
    })

    autoUpdater.on('update-not-available', () => {
        logger.log('[Update] No updates available.')
    })

    if (opts.notifyUser) {
        autoUpdater.on('update-downloaded', (event: UpdateDownloadedEvent) => {
            logger.log('[Update] Update downloaded.', [
                event.releaseNotes,
                event.releaseName,
                event.releaseDate,
                event.releaseNotes
            ])

            const dialogOpts: MessageBoxOptions = {
                type: 'info',
                buttons: ['Restart', 'Later'],
                title: 'Update Available',
                //message: isWindows ? event.releaseNotes : event.releaseName,
                message: event.releaseName ?? '',
                detail: 'A new version of Project One Companion has been downloaded. Restart the application to apply the updates.'
            }

            dialog.showMessageBox(dialogOpts).then(({ response }) => {
                if (response === 0) autoUpdater.quitAndInstall() // 0 = First button
            })
        })
    }

    // mac: ~/Library/Logs/project-one-companion/main.log
    // linux: ~/.config/project-one-companion/logs/main.log
    // win: %USERPROFILE%\AppData\Roaming\project-one-companion\logs\main.log
    logger.transports.file.level = 'info'
    // log.transports.console.format = '{h}:{i}:{s} {text}';w
    autoUpdater.logger = logger
    autoUpdater.fullChangelog = false
    autoUpdater.autoDownload = false
    autoUpdater.allowDowngrade = false
    autoUpdater.autoInstallOnAppQuit = false

    // check for updates right away and keep checking later
    checkForUpdates()
    setInterval(() => checkForUpdates(), opts.updateInterval * 1_000)
}

const getOptions = (): UpdateOptions => {
    const defaults = {
        updateInterval: 60 * 60,
        notifyUser: true
    }
    return defaults
}

export const updateElectronApp = () => {
    const updateOpts = getOptions()

    if (app.isReady()) initUpdater(updateOpts)
    else app.on('ready', () => initUpdater(updateOpts))
}
