import { EventEmitter } from 'node:events'
import { afterEach, expect, it, vi } from 'vitest'
import { app, autoUpdater, powerMonitor } from 'electron'
import { UpdaterSetup } from '../lifecycle/updater-setup'

vi.mock('electron', async () => {
  const { EventEmitter } = await import('node:events')
  return {
    app: Object.assign(new EventEmitter(), { isPackaged: true, getVersion: () => '1.4.272' }),
    autoUpdater: new EventEmitter(),
    powerMonitor: new EventEmitter()
  }
})
vi.mock('./shipit-leftover-recovery', () => ({ prepareThisProcessShipItStaging: () => null }))
vi.mock('./macos-shipit-scheduling', () => ({ configureMacShipItScheduling: () => {} }))
vi.mock('../electron-updater-loader', () => ({ loadElectronAutoUpdater: () => jsUpdater }))
vi.mock('../releases/updater-prerelease-feed', () => ({
  fetchNewerReleaseTagsWithReadiness: async () => ({ state: 'ready', tags: [`v${version}`] })
}))
vi.mock('../releases/updater-changelog', () => ({ fetchChangelog: async () => null }))

const version = '1.4.273'
const jsUpdater = Object.assign(new EventEmitter(), {
  setFeedURL: () => {},
  checkForUpdates: async () => {
    jsUpdater.emit('checking-for-update')
    jsUpdater.emit('update-available', { version })
  },
  downloadUpdate: async () => []
})

afterEach(() => {
  vi.clearAllTimers()
  vi.useRealTimers()
  autoUpdater.removeAllListeners()
  app.removeAllListeners()
  powerMonitor.removeAllListeners()
  jsUpdater.removeAllListeners()
})

it.runIf(process.platform === 'darwin')(
  'keeps remote release update checks disabled from the menu',
  async () => {
    vi.useFakeTimers({ now: 0 })
    const updater = new UpdaterSetup()
    updater.setupAutoUpdater(null, { getLastUpdateCheckAt: () => Date.now() })

    updater.checkForUpdatesFromMenu()
    await vi.advanceTimersByTimeAsync(0)
    expect(updater.getUpdateStatus()).toEqual({ state: 'not-available', userInitiated: true })
  }
)
