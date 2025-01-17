import * as dotenv from 'dotenv'
import { type Configuration } from 'electron-builder'

dotenv.config()

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
        artifactName: '${productName} installer.${ext}',
        shortcutName: '${productName}',
        uninstallDisplayName: '${productName}',
        createDesktopShortcut: false,
        runAfterFinish: true,
        deleteAppDataOnUninstall: true
    },
    mac: {
        target: 'dmg',
        category: 'public.app-category.utilities',
        entitlementsInherit: 'build/entitlements.mac.plist',
        extendInfo: {
            LSUIElement: 1
        },
        notarize: false
    },
    dmg: {
        artifactName: '${productName}.${ext}',
        // Turn off blockmaps since we don't support automatic updates.
        // https://github.com/electron-userland/electron-builder/issues/2900#issuecomment-730571696
        writeUpdateInfo: false
    },
    linux: {
        target: ['AppImage'],
        maintainer: 'Project One Devs',
        category: 'Utility'
    },
    appImage: {
        artifactName: '${productName}.${ext}'
    },
    deb: {
        artifactName: '${productName}.${ext}'
    },
    npmRebuild: false
} satisfies Configuration

export default config
