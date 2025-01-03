import 'dotenv/config'
import { type Configuration } from 'electron-builder'

const config = {
    appId: `${process.env.VITE_APPID}`,
    productName: `${process.env.VITE_TITLE}`,
    directories: {
        buildResources: 'build'
    },
    files: [
        '!**/.vscode/*',
        '!src/*',
        '!electron.vite.config.{js,ts,mjs,cjs}',
        '!{.eslintignore,.eslintrc.cjs,eslint.config.js,.prettierignore,.prettierrc.yaml,dev-app-update.yml,CHANGELOG.md,README.md}',
        '!{.env,.env.*,.npmrc,pnpm-lock.yaml}',
        '!{tsconfig.json,tsconfig.node.json,tsconfig.web.json}'
    ],
    asarUnpack: ['resources/**'],
    win: {
        executableName: `${process.env.VITE_TITLE}`
    },
    nsis: {
        artifactName: 'Install ${productName}.${ext}',
        shortcutName: '${productName}',
        uninstallDisplayName: '${productName}',
        createDesktopShortcut: 'always',
        runAfterFinish: true,
        deleteAppDataOnUninstall: true
    },
    mac: {
        target: 'dmg',
        entitlementsInherit: 'build/entitlements.mac.plist',
        extendInfo: [
            {
                NSCameraUsageDescription: "Application requests access to the device's camera."
            },
            {
                NSMicrophoneUsageDescription:
                    "Application requests access to the device's microphone."
            },
            {
                NSDocumentsFolderUsageDescription:
                    "Application requests access to the user's Documents folder."
            },
            {
                NSDownloadsFolderUsageDescription:
                    "Application requests access to the user's Downloads folder."
            }
        ],
        notarize: false
    },
    dmg: {
        artifactName: '${productName}.${ext}'
    },
    linux: {
        target: ['AppImage', 'snap', 'deb'],
        maintainer: 'Florencea Bear',
        category: 'Utility'
    },
    appImage: {
        artifactName: '${productName}.${ext}'
    },
    npmRebuild: false
    //   publish: {
    //     provider: "generic",
    //     url: "https://example.com/auto-updates",
    //   },
} satisfies Configuration

export default config
