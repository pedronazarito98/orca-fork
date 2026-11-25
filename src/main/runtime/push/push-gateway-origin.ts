import { cleanCloudServiceOrigin } from '../../../shared/network/cloud-service-url'

export function resolvePushGatewayOrigin(env: NodeJS.ProcessEnv, packaged: boolean): string | null {
  return cleanCloudServiceOrigin(env.ORCA_PUSH_GATEWAY_URL, !packaged)
}
