import react from '@vitejs/plugin-react'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import { rmSync } from 'node:fs'
import { resolve } from 'node:path'

if (process.env.NODE_ENV === 'production') {
    rmSync('out', { recursive: true, force: true })
    rmSync('dist', { recursive: true, force: true })
}

export default defineConfig({
    main: {
        plugins: [externalizeDepsPlugin()],
        resolve: {
            alias: {
                '@shared': resolve(__dirname, 'shared'),
                '@storage': resolve(__dirname, 'src/main/lib/storage'),
                '@utils': resolve(__dirname, 'src/main/lib/utils')
            }
        }
    },
    preload: {
        plugins: [externalizeDepsPlugin()],
        build: {
            rollupOptions: {
                output: {
                    format: 'cjs',
                    entryFileNames: 'index.js'
                }
            }
        }
    },
    renderer: {
        build: {
            rollupOptions: {
                input: {
                    main: resolve('src/renderer/index.html')
                }
            }
        },
        resolve: {
            alias: {
                '@renderer': resolve('src/renderer/src'),
                '@shared': resolve('shared'),
                '@resources': resolve('resources')
            }
        },
        plugins: [react()]
    }
})
