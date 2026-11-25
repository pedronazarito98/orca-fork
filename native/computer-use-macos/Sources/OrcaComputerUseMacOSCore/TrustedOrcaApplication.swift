/// Bundle ids of the apps whose computer-use sidecar may drive this helper.
public enum TrustedOrcaApplication {
    public static func isTrusted(bundleId: String) -> Bool {
        // Why: `pnpm dev` launches as `com.coto.app.dev` and per-worktree wrapper apps use
        // `com.coto.app.dev.<name>`; the sidecar peer check must authorize both (#26498).
        bundleId == "com.coto.app" ||
            bundleId == "com.coto.app.dev" ||
            bundleId.hasPrefix("com.coto.app.dev.") ||
            bundleId == "com.github.Electron"
    }
}
