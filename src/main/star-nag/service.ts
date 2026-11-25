import { ipcMain } from 'electron'
import type { Store } from '../persistence/loading-store/store'
import type { StatsCollector } from '../stats/collector'
import type { AgentValueMomentPreparation } from './agent-value-moment'

export class StarNagService {
  constructor(_store: Store, _stats: StatsCollector) {}

  start(): void {}

  stop(): void {}

  registerIpcHandlers(): void {
    ipcMain.handle('star-nag:dismiss', () => undefined)
    ipcMain.handle('star-nag:later', () => undefined)
    ipcMain.handle('star-nag:complete', () => undefined)
    ipcMain.handle('star-nag:disable', () => undefined)
    ipcMain.handle('star-nag:openWeb', () => undefined)
    ipcMain.handle('star-nag:starOrca', () => Promise.resolve(false))
    ipcMain.handle('star-nag:forceShow', () => undefined)
    ipcMain.handle('star-nag:agentValueMoment', (): Promise<AgentValueMomentPreparation> =>
      Promise.resolve({ status: 'skipped' })
    )
    ipcMain.handle('star-nag:showAgentValueMoment', () => undefined)
    ipcMain.handle('star-nag:onboardingCompleted', () => Promise.resolve())
  }
}
