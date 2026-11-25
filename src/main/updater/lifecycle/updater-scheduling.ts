import { UpdaterCheckFailure } from './updater-check-failure'

export abstract class UpdaterScheduling extends UpdaterCheckFailure {
  protected getAutomaticRetryInterval(): number {
    return 0
  }

  protected scheduleAutomaticUpdateCheck(_delayMs: number): void {
    if (this.autoUpdateCheckTimer) {
      clearTimeout(this.autoUpdateCheckTimer)
      this.autoUpdateCheckTimer = null
    }
  }

  protected recordCompletedUpdateCheck(): void {
    this.consecutiveAutomaticRetrySchedules = 0
    this.persistLastUpdateCheckAt?.(Date.now())
  }

  /** Disabled in Coto so background checks never contact upstream release servers. */
  protected runBackgroundUpdateCheck(
    _nudgeId: string | null = this.getPersistedPendingUpdateNudgeId()
  ): boolean {
    return false
  }

  protected settleHeldUpdateCheck(attemptId: number): void {
    if (!this.isActiveUpdateCheckAttempt(attemptId)) {
      return
    }
    const userInitiated = this.getSettledCheckUserInitiated()
    this.finishActiveUpdateCheckAttempt()
    this.clearBackgroundCheckLaunchPending()
    this.backgroundCheckPromotedToUserInitiated = false
    this.userInitiatedCheck = false
    const preserveAvailableUpdate =
      this.currentStatus.state === 'available' ||
      this.currentStatus.state === 'downloading' ||
      this.currentStatus.state === 'downloaded'
    this.completeSilentUpdateCheck(userInitiated, { preserveAvailableUpdate })
    if (preserveAvailableUpdate) {
      return
    }
    this.sendSettledCheckStatus({ state: 'not-available', userInitiated })
  }

  protected checkForUpdatesInBackground(): void {
    // Disabled in Coto.
  }

  protected enablePrereleaseManifestChecks(): void {
    this.getAutoUpdater().allowPrerelease = true
  }

  protected enableIncludePrerelease(): void {
    if (this.includePrereleaseActive) {
      return
    }
    // Allow prerelease manifests on the probed generic feed; native GitHub may select cancelled RCs without assets.
    this.enablePrereleaseManifestChecks()
    this.includePrereleaseActive = true
  }
}
