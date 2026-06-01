'use client'

import { useEffect, useRef, useState } from 'react'
import { useOSStore } from '@/stores/os.store'
import { sleep, randomBetween } from '@/lib/utils'

type BootLine = {
  type: 'kernel' | 'systemd' | 'info'
  text: string
  ok?: boolean
}

const LINUX_BOOT_LINES: BootLine[] = [
  { type: 'kernel', text: '[    0.000000] Linux version 6.5.0-sayanos (sayan@sayanos) (gcc (Ubuntu 11.4.0-1ubuntu1~22.04) 11.4.0) #1 SMP PREEMPT_DYNAMIC' },
  { type: 'kernel', text: '[    0.000000] Command line: BOOT_IMAGE=/boot/vmlinuz-6.5.0 root=UUID=8b3e2b2a-1234-ro quiet splash vt.handoff=7' },
  { type: 'kernel', text: '[    0.000000] KERNEL supported cpus:' },
  { type: 'kernel', text: '[    0.000000]   Intel GenuineIntel' },
  { type: 'kernel', text: '[    0.000000]   AMD AuthenticAMD' },
  { type: 'kernel', text: '[    0.000000] x86/fpu: Supporting XSAVE feature 0x001: \'x87 floating point registers\'' },
  { type: 'kernel', text: '[    0.000000] x86/fpu: Supporting XSAVE feature 0x002: \'SSE registers\'' },
  { type: 'kernel', text: '[    0.000000] x86/fpu: Supporting XSAVE feature 0x004: \'AVX registers\'' },
  { type: 'kernel', text: '[    0.000000] x86/fpu: Supporting XSAVE feature 0x008: \'MPX bounds registers\'' },
  { type: 'kernel', text: '[    0.000000] x86/fpu: xstate_offset[2]:  576, xstate_sizes[2]:  256' },
  { type: 'kernel', text: '[    0.000000] signal: max sigframe size: 3376' },
  { type: 'kernel', text: '[    0.000000] BIOS-provided physical RAM map:' },
  { type: 'kernel', text: '[    0.000000] BIOS-e820: [mem 0x0000000000000000-0x000000000009fbff] usable' },
  { type: 'kernel', text: '[    0.000000] BIOS-e820: [mem 0x0000000000100000-0x00000000bffeffff] usable' },
  { type: 'kernel', text: '[    0.000000] NX (Execute Disable) protection: active' },
  { type: 'kernel', text: '[    0.000000] SMBIOS 3.3.0 present.' },
  { type: 'kernel', text: '[    0.000000] DMI: SayanOS Engineering Workstation/Mobo, BIOS 1.0.0 06/01/2026' },
  { type: 'kernel', text: '[    0.023412] Memory: 16384K/16777216K available (14336K kernel code, 2398K rwdata, 9024K rodata)' },
  { type: 'kernel', text: '[    0.054321] Dentry cache hash table entries: 2097152 (order: 12, 16777216 bytes)' },
  { type: 'kernel', text: '[    0.103423] Inode-cache hash table entries: 1048576 (order: 11, 8388608 bytes)' },
  { type: 'kernel', text: '[    0.150000] Mount-cache hash table entries: 32768 (order: 6, 262144 bytes)' },
  { type: 'kernel', text: '[    0.201321] Initializing cgroup subsys memory' },
  { type: 'kernel', text: '[    0.223412] Initializing cgroup subsys devices' },
  { type: 'kernel', text: '[    0.254122] Initializing cgroup subsys freezer' },
  { type: 'kernel', text: '[    0.301321] PCI: Using ACPI for IRQ routing' },
  { type: 'kernel', text: '[    0.354112] PCI: pci_cache_line_size set to 64 bytes' },
  { type: 'kernel', text: '[    0.412432] NetLabel: Initializing' },
  { type: 'kernel', text: '[    0.412450] NetLabel:  domain hash size = 128' },
  { type: 'kernel', text: '[    0.412455] NetLabel:  protocols = UNLABELED CIPSOv4 CALIPSO' },
  { type: 'kernel', text: '[    0.512432] clocksource: hpet: mask: 0xffffffff max_cycles: 0xffffffff, 14318180 Hz' },
  { type: 'kernel', text: '[    0.551234] clocksource: Switched to clocksource hpet' },
  { type: 'kernel', text: '[    0.601244] VFS: Disk quotas dquot_6.6.0' },
  { type: 'kernel', text: '[    0.621345] VFS: Dquot-cache hash table entries: 512 (order 0, 4096 bytes)' },
  { type: 'kernel', text: '[    0.654312] systemd[1]: Inserted module \'autofs4\'' },
  { type: 'kernel', text: '[    0.724123] systemd[1]: systemd 249.11-0ubuntu3.9 running in system mode (+PAM +AUDIT +SELINUX +APPARMOR)' },
  { type: 'kernel', text: '[    0.730121] systemd[1]: Detected architecture x86-64.' },
  { type: 'systemd', ok: true, text: 'Set up automount Arbitrary Executable File Formats File System Automount Point.' },
  { type: 'systemd', ok: true, text: 'Created slice system-getty.slice.' },
  { type: 'systemd', ok: true, text: 'Created slice system-modprobe.slice.' },
  { type: 'systemd', ok: true, text: 'Started Dispatch Password Requests to Console Directory Watch.' },
  { type: 'systemd', ok: true, text: 'Started Forward Password Requests to Wall Directory Watch.' },
  { type: 'systemd', ok: true, text: 'Reached target Local File Systems (Pre).' },
  { type: 'systemd', ok: true, text: 'Mounted /sys/kernel/security.' },
  { type: 'systemd', ok: true, text: 'Mounted /dev/mqueue.' },
  { type: 'systemd', ok: true, text: 'Mounted /sys/kernel/debug.' },
  { type: 'systemd', ok: true, text: 'Mounted /sys/kernel/tracing.' },
  { type: 'systemd', ok: true, text: 'Mounted /run/user/1000.' },
  { type: 'systemd', ok: true, text: 'Reached target Local File Systems.' },
  { type: 'systemd', ok: true, text: 'Started Network Time Synchronization.' },
  { type: 'systemd', ok: true, text: 'Started Update UTMP about System Boot/Shutdown.' },
  { type: 'systemd', ok: true, text: 'Started Load AppArmor profiles.' },
  { type: 'systemd', ok: true, text: 'Reached target System Initialization.' },
  { type: 'systemd', ok: true, text: 'Started D-Bus System Message Bus.' },
  { type: 'systemd', ok: true, text: 'Started User Login Management.' },
  { type: 'systemd', ok: true, text: 'Started WPA supplicant.' },
  { type: 'systemd', ok: true, text: 'Started Bluetooth service.' },
  { type: 'systemd', ok: true, text: 'Started SayanOS AI Core Modules.' },
  { type: 'systemd', ok: true, text: 'Started Neural Network Inference Engine (Groq / Whisper).' },
  { type: 'systemd', ok: true, text: 'Started Redis In-Memory Datastore.' },
  { type: 'systemd', ok: true, text: 'Started MongoDB Atlas Connection Pool.' },
  { type: 'systemd', ok: true, text: 'Started Realtime WebSocket Hub.' },
  { type: 'systemd', ok: true, text: 'Started Web3 Crypto Middleware.' },
  { type: 'systemd', ok: true, text: 'Started Docker Application Container Engine.' },
  { type: 'systemd', ok: true, text: 'Reached target Multi-User System.' },
  { type: 'systemd', ok: true, text: 'Reached target Graphical Interface.' },
  { type: 'info', text: ' ' },
  { type: 'info', text: 'Welcome to SayanOS 1.0.0 LTS (GNU/Linux 6.5.0-sayanos x86_64)' },
  { type: 'info', text: ' ' },
  { type: 'info', text: ' * Documentation:  https://github.com/sayan049' },
  { type: 'info', text: ' * Support:        System Admin' },
  { type: 'info', text: ' ' },
  { type: 'info', text: 'Starting X Server...' },
]

export function BootSequence() {
  const setBooted = useOSStore(s => s.setBooted)
  const [stage, setStage] = useState<'grub' | 'kernel'>('grub')
  const [lines, setLines] = useState<BootLine[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const endRef = useRef<HTMLDivElement>(null)
  const skipped = useRef(false)

  const finishBoot = () => {
    if (skipped.current) return
    skipped.current = true
    if (containerRef.current) {
      containerRef.current.style.opacity = '0'
      setTimeout(() => setBooted(), 400)
    } else {
      setBooted()
    }
  }

  // Skip on click or keypress
  useEffect(() => {
    const handler = (e: KeyboardEvent | MouseEvent) => {
      // In GRUB stage, allow enter to skip GRUB instantly
      if (stage === 'grub' && (e instanceof KeyboardEvent && e.key === 'Enter')) {
        setStage('kernel')
      } else if (stage === 'kernel') {
        finishBoot()
      }
    }
    window.addEventListener('keydown', handler)
    window.addEventListener('click', handler)
    return () => {
      window.removeEventListener('keydown', handler)
      window.removeEventListener('click', handler)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage])

  // GRUB timer
  useEffect(() => {
    if (stage === 'grub') {
      const timer = setTimeout(() => {
        if (!skipped.current) setStage('kernel')
      }, 2500)
      return () => clearTimeout(timer)
    } else if (stage === 'kernel') {
      runBoot()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage])

  const runBoot = async () => {
    for (let i = 0; i < LINUX_BOOT_LINES.length; i++) {
      if (skipped.current) break

      setLines(prev => [...prev, LINUX_BOOT_LINES[i]])
      
      // Auto-scroll to bottom like a real console
      if (endRef.current) {
        endRef.current.scrollIntoView()
      }

      // Timing to make it look realistic
      let delay = randomBetween(5, 45)
      if (LINUX_BOOT_LINES[i].text.includes('system mode')) delay = 350 // pause before systemd
      if (LINUX_BOOT_LINES[i].text.includes('Graphical Interface')) delay = 400 // pause at graphical
      if (LINUX_BOOT_LINES[i].text.includes('Starting X Server')) delay = 700 // pause before starting UI

      await sleep(delay)
    }

    if (!skipped.current) {
      await sleep(300)
      finishBoot()
    }
  }

  if (stage === 'grub') {
    return (
      <div className="fixed inset-0" style={{ background: '#000', color: '#ccc', fontFamily: 'monospace' }}>
        <div style={{ padding: '40px', maxWidth: 800, margin: '0 auto', marginTop: '10vh' }}>
          <div style={{ border: '2px solid #ccc', padding: '2px' }}>
            <div style={{ background: '#000', padding: '10px 0', border: '1px solid #ccc' }}>
              <div style={{ textAlign: 'center', marginBottom: 20, color: '#ccc', fontWeight: 'bold' }}>
                GNU GRUB  version 2.06
              </div>
              
              <div style={{ background: '#fff', color: '#000', padding: '4px 16px' }}>
                *SayanOS 1.0.0 LTS
              </div>
              <div style={{ padding: '4px 16px', color: '#ccc' }}>
                Advanced options for SayanOS
              </div>
              <div style={{ padding: '4px 16px', color: '#ccc' }}>
                UEFI Firmware Settings
              </div>
              
              <div style={{ padding: '100px 16px 20px 16px', color: '#ccc', fontSize: '13px' }}>
                Use the ↑ and ↓ keys to select which entry is highlighted.<br/>
                Press enter to boot the selected OS, &apos;e&apos; to edit the commands<br/>
                before booting or &apos;c&apos; for a command-line.<br/><br/>
                The highlighted entry will be executed automatically in 2s.
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 font-mono overflow-hidden"
      style={{
        background: '#000000',
        color: '#c0c0c0',
        fontSize: '13px',
        lineHeight: '1.4',
        padding: '16px 20px',
        transition: 'opacity 0.4s ease-in-out',
        zIndex: 9999,
      }}
    >
      <div className="flex flex-col">
        {lines.map((line, idx) => (
          <div key={idx} className="flex" style={{ wordBreak: 'break-all' }}>
            {line.type === 'systemd' && line.ok !== undefined && (
              <span className="mr-3 whitespace-nowrap">
                [<span style={{ color: line.ok ? '#32cd32' : '#ff0000', fontWeight: 'bold' }}>
                  {line.ok ? '  OK  ' : 'FAILED'}
                </span>]
              </span>
            )}
            <span style={{ 
              color: line.text.includes('SayanOS') && line.type === 'info' ? '#4fc3f7' : 'inherit',
              fontWeight: line.text.includes('SayanOS') && line.type === 'info' ? 'bold' : 'normal',
            }}>
              {line.text}
            </span>
          </div>
        ))}
        <div ref={endRef} style={{ height: 1 }} />
      </div>
    </div>
  )
}