/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly MAIN_VITE_DATABASE_URL: string
    readonly VITE_APPID: string
    readonly VITE_TITLE: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
