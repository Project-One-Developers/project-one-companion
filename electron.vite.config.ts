import react from '@vitejs/plugin-react'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import path, { resolve } from 'path'
import tailwindcss from 'tailwindcss'

export default defineConfig({
    main: {
        plugins: [externalizeDepsPlugin()]
    },
    preload: {
        plugins: [externalizeDepsPlugin()]
    },
    renderer: {
        // TODO: is this needed?
        css: {
            postcss: {
                plugins: [tailwindcss()]
            }
        },
        resolve: {
            alias: {
                '@renderer': resolve('src/renderer/src'),
                shared: path.resolve(__dirname, '/shared')
            }
        },
        plugins: [react()]
    }
})
