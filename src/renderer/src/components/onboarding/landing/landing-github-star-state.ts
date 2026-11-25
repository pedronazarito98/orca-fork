import { useState, type Dispatch, type SetStateAction } from 'react'

export type LandingStarState = 'loading' | 'starred' | 'not-starred' | 'web-fallback' | 'hidden'

export function useLandingOrcaStarState(): [
  LandingStarState,
  Dispatch<SetStateAction<LandingStarState>>
] {
  return useState<LandingStarState>('hidden')
}
