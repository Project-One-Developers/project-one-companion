import { ElectronAPI } from '@electron-toolkit/preload'
import { api } from '../preload'

declare global {
    interface Window {
        electron: ElectronAPI
        api: typeof api
        // coming from wowhead tooltip.js
        $WowheadPower: {
            refreshLinks: () => void
        }
    }
}
