'use client'

import { useOSStore } from '@/stores/os.store'
import { BootSequence } from '@/components/os/BootSequence'
import { HackSequence } from '@/components/os/HackSequence'
import { HireSequence } from '@/components/os/HireSequence'
import { Desktop } from './Desktop'
import { useState } from 'react'

export function OSRoot() {
  const hasBooted = useOSStore(s => s.hasBooted)

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ background: 'var(--os-bg)' }}>
      {!hasBooted ? (
        <BootSequence />
      ) : (
        <>
          <Desktop />
          <HackSequence />
          <HireSequence />
        </>
      )}
    </div>
  )
}