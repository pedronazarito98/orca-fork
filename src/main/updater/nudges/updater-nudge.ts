import { UpdaterBuildSelection } from '../releases/updater-build-selection'

export abstract class UpdaterNudge extends UpdaterBuildSelection {
  protected async checkForUpdateNudge(): Promise<void> {
    // Disabled in Coto to prevent outbound update nudge checks to orca.dev.
  }

  protected scheduleUpdateNudgeCheck(): void {
    if (this.nudgeCheckTimer) {
      clearTimeout(this.nudgeCheckTimer)
      this.nudgeCheckTimer = null
    }
  }

  protected dismissNudge(): void {
    const pendingId = this.activeUpdateNudgeId ?? this._getPendingUpdateNudgeId?.() ?? null
    if (pendingId) {
      this._setDismissedUpdateNudgeId?.(pendingId)
      this.clearPendingUpdateNudge()
    }
  }

  /** Abandon only an unacted local/pinned update and restore the release feed. */
  protected dismissAvailableUpdate(): void {
    if (this.activeUpdateSource === 'release' && !this.isPinnedBuildActive) {
      return
    }
    if (this.localBuildSelectionInProgress || this.pinnedBuildSelectionInProgress) {
      return
    }
    // Downloading/downloaded cards still own the pinned feed and downgrade permission.
    if (this.currentStatus.state !== 'available') {
      return
    }
    this.clearAvailableUpdateContext()
    this.restoreReleaseUpdateSource()
    // Clear available status or Retry could download the abandoned version from the restored feed.
    this.sendStatus({ state: 'idle' })
  }
}
