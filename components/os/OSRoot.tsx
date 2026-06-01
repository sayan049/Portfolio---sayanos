'use client'

import { useOSStore } from '@/stores/os.store'
import { BootSequence } from './BootSequence'
import { Desktop } from './Desktop'

export function OSRoot() {
  const hasBooted = useOSStore(s => s.hasBooted)

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ background: 'var(--os-bg)' }}>
      {!hasBooted ? <BootSequence /> : <Desktop />}
    </div>
  )
}