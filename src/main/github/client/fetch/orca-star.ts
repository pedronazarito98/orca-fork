import { ghExecFileAsync } from '../../../git/command-runner/hosted-cli/gh-exec-file'
import { acquire, release } from '../../execution/github-operation-slots'
import { runAsDefaultWslCliUserAct } from '../../../git/command-runner/hosted-cli/default-wsl-cli-fallback'
export const ORCA_REPO = 'stablyai/orca'

// Bound optional star prompts more tightly than user work; failures can fall back to the browser.
const STAR_GH_TIMEOUT_MS = 15_000

/** null means the star state could not be determined. */
export function checkOrcaStarred(): Promise<boolean | null> {
  return Promise.resolve(null)
}

export async function starOrca(): Promise<boolean> {
  await acquire()
  try {
    // Starring is always a click, so it may start the stopped distro its gh lives in (E9).
    await runAsDefaultWslCliUserAct(() =>
      ghExecFileAsync(['api', '-X', 'PUT', `user/starred/${ORCA_REPO}`], {
        encoding: 'utf-8',
        timeout: STAR_GH_TIMEOUT_MS
      })
    )
    return true
  } catch {
    return false
  } finally {
    release()
  }
}
