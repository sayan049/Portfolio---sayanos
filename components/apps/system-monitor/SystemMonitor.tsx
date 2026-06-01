'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useOSStore } from '@/stores/os.store'
import { APP_NAMES } from '@/lib/constants'
import { listVariants, listItemVariants } from '@/lib/motion'

export function SystemMonitor() {
  const [uptime, setUptime] = useState('00:00:00')
  const [startTime] = useState(Date.now())
  
  const windows = useOSStore(s => s.windows)
  const activeApps = Object.entries(windows).filter(([_, win]) => win.isOpen)

  const [processStats, setProcessStats] = useState<Record<string, { cpu: number, mem: number }>>({})

  useEffect(() => {
    const id = setInterval(() => {
      const elapsed = Date.now() - startTime
      const s       = Math.floor(elapsed / 1000) % 60
      const m       = Math.floor(elapsed / 60000) % 60
      const h       = Math.floor(elapsed / 3600000)
      setUptime(
        `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
      )
    }, 1000)
    return () => clearInterval(id)
  }, [startTime])

  useEffect(() => {
    // Initial populate and interval for stats
    const updateStats = () => {
      setProcessStats(prev => {
        const next: Record<string, { cpu: number, mem: number }> = {}
        // Always include kernel
        next['kernel_task'] = { cpu: 1.2 + Math.random(), mem: 1024 + Math.random() * 50 }
        next['WindowServer'] = { cpu: 4.5 + Math.random() * 2, mem: 256 + Math.random() * 20 }

        activeApps.forEach(([appId, win]) => {
          let baseCpu = 0.5; let baseMem = 40
          if (appId === 'safari') { baseCpu = 2.4; baseMem = 120 }
          else if (appId === 'projects') { baseCpu = 8.1; baseMem = 280 }
          else if (appId === 'ai-assistant') { baseCpu = 15.5; baseMem = 450 }
          else if (appId === 'system-monitor') { baseCpu = 3.2; baseMem = 85 }
          else if (appId === 'terminal') { baseCpu = 0.2; baseMem = 25 }
          else if (appId === 'timeline') { baseCpu = 1.8; baseMem = 90 }
          
          const randCpu = (Math.random() - 0.5) * (baseCpu * 0.3)
          const randMem = (Math.random() - 0.5) * (baseMem * 0.05)
          const focusMultiplier = win.isFocused ? 1.8 : 1
          
          next[appId] = {
            cpu: Math.max(0.1, (baseCpu + randCpu) * focusMultiplier),
            mem: Math.max(10, baseMem + randMem)
          }
        })
        return next
      })
    }
    updateStats()
    const id = setInterval(updateStats, 2000)
    return () => clearInterval(id)
  }, [activeApps.map(a => a[0]).join(',')]) // Only re-bind if apps open/close

  // Calculate totals
  const totalCpu = Object.values(processStats).reduce((acc, curr) => acc + curr.cpu, 0)
  const totalMem = Object.values(processStats).reduce((acc, curr) => acc + curr.mem, 0)

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div
        style={{
          padding: '16px 24px', borderBottom: '1px solid var(--os-border)',
          flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'rgba(13, 13, 17, 0.5)',
        }}
      >
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--os-text)', marginBottom: 2 }}>
            ACTIVITY MONITOR
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="status-dot status-dot-pulse" />
            <span style={{ fontSize: 12, color: 'var(--os-text-3)' }}>
              Monitoring active SayanOS processes
            </span>
          </div>
        </div>
      </div>

      {/* Content — Process List */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr 1fr', padding: '8px 24px', borderBottom: '1px solid var(--os-border)', background: 'var(--os-surface-2)', fontSize: 11, fontWeight: 600, color: 'var(--os-text-3)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          <span>Process Name</span>
          <span style={{ textAlign: 'right' }}>% CPU</span>
          <span style={{ textAlign: 'right' }}>Memory</span>
          <span style={{ textAlign: 'right' }}>PID</span>
        </div>
        
        <motion.div variants={listVariants} initial="hidden" animate="visible" style={{ flex: 1, padding: '8px 0' }}>
          {/* Always running core processes */}
          {['kernel_task', 'WindowServer'].map((sysProc, idx) => (
            <motion.div key={sysProc} variants={listItemVariants} style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr 1fr', padding: '6px 24px', fontSize: 13, color: 'var(--os-text)', borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--os-text-3)' }} />
                {sysProc}
              </span>
              <span style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{processStats[sysProc]?.cpu.toFixed(1) || '0.0'}</span>
              <span style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{processStats[sysProc]?.mem.toFixed(0) || '0'} MB</span>
              <span style={{ textAlign: 'right', color: 'var(--os-text-3)' }}>{10 + idx}</span>
            </motion.div>
          ))}

          {/* Active OS Apps */}
          {activeApps.map(([appId, win], idx) => (
            <motion.div key={appId} variants={listItemVariants} style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr 1fr', padding: '6px 24px', fontSize: 13, color: win.isFocused ? 'var(--os-cyan)' : 'var(--os-text)', borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: win.isFocused ? 'var(--os-cyan)' : 'var(--os-green)' }} />
                {APP_NAMES[appId as keyof typeof APP_NAMES]} {appId === 'ai-assistant' ? '(Groq Inference Engine)' : ''}
              </span>
              <span style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{processStats[appId]?.cpu.toFixed(1) || '0.0'}</span>
              <span style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{processStats[appId]?.mem.toFixed(0) || '0'} MB</span>
              <span style={{ textAlign: 'right', color: 'var(--os-text-3)' }}>{1230 + idx * 7}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Bottom status bar */}
      <div
        style={{
          padding: '12px 24px', borderTop: '1px solid var(--os-border)', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'rgba(13, 13, 17, 0.95)',
        }}
      >
        <div style={{ display: 'flex', gap: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 10, color: 'var(--os-text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total CPU</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--os-cyan)', fontVariantNumeric: 'tabular-nums' }}>{totalCpu.toFixed(1)}%</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 10, color: 'var(--os-text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Memory Used</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--os-green)', fontVariantNumeric: 'tabular-nums' }}>{(totalMem / 1024).toFixed(2)} GB</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 10, color: 'var(--os-text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Threads</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--os-text)', fontVariantNumeric: 'tabular-nums' }}>{activeApps.length * 4 + 42}</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <span style={{ fontSize: 10, color: 'var(--os-text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>System Uptime</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--os-text)', fontVariantNumeric: 'tabular-nums' }}>{uptime}</span>
        </div>
      </div>
    </div>
  )
}