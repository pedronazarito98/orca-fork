import { cleanCloudServiceOrigin } from '../../shared/network/cloud-service-url'

export function resolveConnectorOrigin(env: NodeJS.ProcessEnv, packaged: boolean): string | null {
  return cleanCloudServiceOrigin(env.ORCA_CONNECTOR_URL, !packaged)
}
