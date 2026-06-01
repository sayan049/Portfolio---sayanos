'use client'

import {
  useState, useRef, useEffect, useCallback, KeyboardEvent,
} from 'react'
import { useOSStore } from '@/stores/os.store'
import type { AppId } from '@/lib/constants'
import { processCommand, nextId, type TerminalLine } from './commands/index'
import { TerminalHistory, getAutoComplete } from './TerminalEngine'
import { sleep } from '@/lib/utils'

// ── Welcome ASCII banner ────────────────────────────────────────────────────
const WELCOME_LINES: { text: string; type: TerminalLine['type'] }[] = [
  { text: '  ███████╗ █████╗ ██╗   ██╗ █████╗ ███╗   ██╗ ██████╗ ███████╗', type: 'cyan' },
  { text: '  ██╔════╝██╔══██╗╚██╗ ██╔╝██╔══██╗████╗  ██║██╔═══██╗██╔════╝', type: 'cyan' },
  { text: '  ███████╗███████║ ╚████╔╝ ███████║██╔██╗ ██║██║   ██║███████╗', type: 'cyan' },
  { text: '  ╚════██║██╔══██║  ╚██╔╝  ██╔══██║██║╚██╗██║██║   ██║╚════██║', type: 'cyan' },
  { text: '  ███████║██║  ██║   ██║   ██║  ██║██║ ╚████║╚██████╔╝███████║', type: 'cyan' },
  { text: '  ╚══════╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝ ╚══════╝', type: 'cyan' },
  { text: '', type: 'dim' },
  { text: '  Personal Engineering OS  v1.0.0  ·  Built by Sayan Patra', type: 'dim' },
  { text: '  ──────────────────────────────────────────────────────────', type: 'dim' },
  { text: '  Type \'help\' for commands  ·  \'whoami\' to meet the engineer', type: 'output' },
  { text: '', type: 'dim' },
]

const LINE_COLORS: Record<TerminalLine['type'], string> = {
  output:  '#c8d3f5',
  error:   '#ff5370',
  success: '#c3e88d',
  input:   '#ffffff',
  system:  '#4fc3f7',
  cyan:    '#4fc3f7',
  dim:     '#444466',
}

const history = new TerminalHistory()

// ── Live clock ──────────────────────────────────────────────────────────────
function useClock() {
  const [time, setTime] = useState('')
  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  return time
}

// ── Matrix rain canvas ──────────────────────────────────────────────────────
function MatrixRain({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (!active) return
    const canvas = canvasRef.current!
    const ctx    = canvas.getContext('2d')!
    canvas.width  = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    const cols  = Math.floor(canvas.width / 14)
    const drops: number[] = Array(cols).fill(1)
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ﾊﾋｼﾅﾆｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃ'
    let running = true
    const draw = () => {
      if (!running) return
      ctx.fillStyle = 'rgba(11,11,14,0.08)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.font = '13px monospace'
      drops.forEach((y, x) => {
        const char = chars[Math.floor(Math.random() * chars.length)]
        ctx.fillStyle = Math.random() > 0.95 ? '#ffffff' : '#00e676'
        ctx.fillText(char, x * 14, y * 16)
        if (y * 16 > canvas.height && Math.random() > 0.975) drops[x] = 0
        drops[x]++
      })
      requestAnimationFrame(draw)
    }
    draw()
    return () => { running = false }
  }, [active])
  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}
    />
  )
}

export function Terminal() {
  const [lines, setLines]           = useState<TerminalLine[]>([])
  const [input, setInput]           = useState('')
  const [suggestion, setSuggestion] = useState('')
  const [ready, setReady]           = useState(false)
  const [matrixMode, setMatrixMode] = useState(false)
  const bottomRef                   = useRef<HTMLDivElement>(null)
  const inputRef                    = useRef<HTMLInputElement>(null)
  const openApp                     = useOSStore(s => s.openApp)
  const showToast                   = useOSStore(s => s.showToast)
  const clock                       = useClock()

  // ── Typewriter welcome ──────────────────────────────────────────────────
  const runWelcome = useCallback(async (isCancelled: () => boolean, onDone?: () => void) => {
    for (const { text, type } of WELCOME_LINES) {
      if (isCancelled()) return
      const lineId = nextId()
      setLines(prev => [...prev, { id: lineId, type, content: '' }])
      let current = ''
      for (const char of text) {
        if (isCancelled()) return
        await sleep(8)
        current += char
        setLines(prev => prev.map(l => l.id === lineId ? { ...l, content: current } : l))
      }
    }
    onDone?.()
  }, [])

  useEffect(() => {
    let cancelled = false
    runWelcome(() => cancelled, () => { if (!cancelled) { setReady(true); setTimeout(() => inputRef.current?.focus(), 50) } })
    return () => { cancelled = true }
  }, [runWelcome])

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [lines])

  // Autocomplete
  useEffect(() => {
    if (input.trim().length > 1) {
      setSuggestion(getAutoComplete(input)[0] ?? '')
    } else {
      setSuggestion('')
    }
  }, [input])

  const addLines = useCallback((newLines: TerminalLine[]) => {
    setLines(prev => [...prev, ...newLines])
  }, [])

  const submitCommand = useCallback(() => {
    if (!ready) return
    const cmd = input.trim()

    // ── special built-in wow commands ──────────────────────────────────
    if (cmd === 'matrix') {
      setLines(prev => [...prev,
        { id: nextId(), type: 'input', content: cmd },
        { id: nextId(), type: 'cyan', content: 'Entering the Matrix... (type any key to exit)' },
      ])
      setInput(''); setMatrixMode(true); return
    }
    if (cmd === 'ls' || cmd === 'ls -la') {
      setLines(prev => [...prev,
        { id: nextId(), type: 'input', content: cmd },
        { id: nextId(), type: 'dim',    content: 'total 9 apps' },
        { id: nextId(), type: 'output', content: 'drwxr-xr-x  finder        Personal file system' },
        { id: nextId(), type: 'output', content: 'drwxr-xr-x  safari        Web browser with proxy' },
        { id: nextId(), type: 'output', content: 'drwxr-xr-x  terminal      This shell' },
        { id: nextId(), type: 'output', content: 'drwxr-xr-x  projects      GitHub project showcase' },
        { id: nextId(), type: 'output', content: 'drwxr-xr-x  system-monitor Live metrics dashboard' },
        { id: nextId(), type: 'output', content: 'drwxr-xr-x  timeline      Engineering journey' },
        { id: nextId(), type: 'output', content: 'drwxr-xr-x  ai-assistant  Siri-powered AI chat' },
        { id: nextId(), type: 'output', content: 'drwxr-xr-x  contact       Hire/reach form' },
        { id: nextId(), type: 'output', content: '-rw-r--r--  resume.pdf    Sayan Patra Resume 2026' },
        { id: nextId(), type: 'dim',    content: '' },
      ])
      setInput(''); history.push(cmd); return
    }
    if (cmd === 'pwd') {
      setLines(prev => [...prev,
        { id: nextId(), type: 'input',   content: cmd },
        { id: nextId(), type: 'output',  content: '/users/sayan/sayanos/desktop' },
        { id: nextId(), type: 'dim',     content: '' },
      ])
      setInput(''); history.push(cmd); return
    }
    if (cmd === 'date') {
      setLines(prev => [...prev,
        { id: nextId(), type: 'input',   content: cmd },
        { id: nextId(), type: 'output',  content: new Date().toDateString() + ' · ' + new Date().toLocaleTimeString() },
        { id: nextId(), type: 'dim',     content: '' },
      ])
      setInput(''); history.push(cmd); return
    }
    if (cmd === 'uname' || cmd === 'uname -a') {
      setLines(prev => [...prev,
        { id: nextId(), type: 'input',   content: cmd },
        { id: nextId(), type: 'output',  content: 'SayanOS 1.0.0 (Next.js 14) arm64 Built by Sayan Patra, Kolkata 2026' },
        { id: nextId(), type: 'dim',     content: '' },
      ])
      setInput(''); history.push(cmd); return
    }
    if (cmd === 'top' || cmd === 'htop') {
      setLines(prev => [...prev,
        { id: nextId(), type: 'input',   content: cmd },
        { id: nextId(), type: 'cyan',    content: '↳ Opening System Monitor...' },
      ])
      setInput(''); history.push(cmd)
      setTimeout(() => openApp('system-monitor'), 300); return
    }
    if (cmd === 'cat resume') {
      setLines(prev => [...prev,
        { id: nextId(), type: 'input', content: cmd },
        { id: nextId(), type: 'dim',   content: '── resume.pdf ───────────────────────────' },
        { id: nextId(), type: 'cyan',  content: 'SAYAN PATRA · Full-Stack Engineer · AI Systems' },
        { id: nextId(), type: 'output',content: 'B.Tech CSE · MAKAUT 2026 · CGPA 7.63' },
        { id: nextId(), type: 'output',content: 'Founder: Messmate (messmate.co.in)' },
        { id: nextId(), type: 'output',content: 'Builder: Curalink 2.0, AI Interview System' },
        { id: nextId(), type: 'output',content: 'Stack: MERN · TypeScript · Python · PyTorch · RAG' },
        { id: nextId(), type: 'dim',   content: '─────────────────────────────────────────' },
        { id: nextId(), type: 'success',content: '↳ Opening full Resume Viewer...' },
      ])
      setInput(''); history.push(cmd)
      setTimeout(() => openApp('resume'), 600); return
    }
    if (cmd === 'neofetch') {
      setLines(prev => [...prev,
        { id: nextId(), type: 'input', content: cmd },
        { id: nextId(), type: 'cyan',  content: '        :::::::  sayan@sayanos' },
        { id: nextId(), type: 'cyan',  content: '     ::::::::::: ─────────────────────────────' },
        { id: nextId(), type: 'cyan',  content: '   :::::::  :::: OS: SayanOS v1.0.0' },
        { id: nextId(), type: 'cyan',  content: '  :::::::   :::: Host: Personal Portfolio' },
        { id: nextId(), type: 'cyan',  content: '  :::::::  ::::: Shell: SayanShell 1.0' },
        { id: nextId(), type: 'cyan',  content: '  ::::::::::::: Runtime: Next.js 14 / Node.js' },
        { id: nextId(), type: 'cyan',  content: '   ::::::::::::  Stack: MERN · TypeScript · Python' },
        { id: nextId(), type: 'cyan',  content: '     ::::::::    Location: Kolkata, India' },
        { id: nextId(), type: 'cyan',  content: '        :::      Status: AVAILABLE' },
        { id: nextId(), type: 'dim',   content: '' },
        { id: nextId(), type: 'dim',   content: '  ■■■■■■ ■■■■■■ ■■■■■■ ■■■■■■ ■■■■■■ ■■■■■■' },
        { id: nextId(), type: 'dim',   content: '' },
      ])
      setInput(''); history.push(cmd); return
    }
    if (cmd === 'ping sayan') {
      setLines(prev => [...prev,
        { id: nextId(), type: 'input',   content: cmd },
        { id: nextId(), type: 'output',  content: 'PING sayan.patra (sayanpatra017@gmail.com)' },
        { id: nextId(), type: 'success', content: '64 bytes from sayan: icmp_seq=1 ttl=64 time=< 24h' },
        { id: nextId(), type: 'success', content: '64 bytes from sayan: icmp_seq=2 ttl=64 time=< 24h' },
        { id: nextId(), type: 'success', content: '64 bytes from sayan: icmp_seq=3 ttl=64 time=< 24h' },
        { id: nextId(), type: 'dim',     content: '3 packets sent, 3 received, 0% packet loss' },
        { id: nextId(), type: 'dim',     content: '' },
      ])
      setInput(''); history.push(cmd); return
    }
    
    if (cmd === 'sudo rm -rf /') {
      const triggerGlitch = useOSStore.getState().triggerGlitch
      triggerGlitch()
      setLines(prev => [...prev,
        { id: nextId(), type: 'input',   content: cmd },
        { id: nextId(), type: 'error',   content: 'rm: it is dangerous to operate recursively on `/\'' },
        { id: nextId(), type: 'error',   content: 'rm: use --no-preserve-root to override this failsafe' },
        { id: nextId(), type: 'system',  content: '[SYSTEM_ALERT]: FATAL KERNEL PANIC. INITIATING EMERGENCY MEMORY DUMP.' },
        { id: nextId(), type: 'dim',     content: '' },
      ])
      setInput(''); history.push(cmd); return
    }

    if (cmd === 'sudo hire sayan') {
      window.dispatchEvent(new CustomEvent('SYSTEM_HACK'))
      setLines(prev => [...prev,
        { id: nextId(), type: 'input',   content: cmd },
        { id: nextId(), type: 'system',  content: '[SYSTEM] Protocol Omega Initiated.' },
        { id: nextId(), type: 'success', content: '↳ Decrypting Top Secret Dossier...' },
        { id: nextId(), type: 'dim',     content: '' },
      ])
      setInput(''); history.push(cmd); return
    }

    // ── regular commands ────────────────────────────────────────────────
    const inputLine: TerminalLine = { id: nextId(), type: 'input', content: cmd }
    const result = processCommand(cmd, openApp as (id: AppId) => void, showToast)
    history.push(cmd)

    if (result.length === 1 && result[0].content === '__CLEAR__') {
      setLines([])
      setReady(false)
      setInput('')
      setSuggestion('')
      setTimeout(() => {
        runWelcome(() => false, () => { setReady(true); setTimeout(() => inputRef.current?.focus(), 50) })
      }, 80)
      return
    }

    setLines(prev => [...prev, inputLine, ...result])
    setInput('')
    setSuggestion('')
  }, [input, openApp, showToast, ready, runWelcome])

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (matrixMode) { setMatrixMode(false); return }
    switch (e.key) {
      case 'Enter':
        e.preventDefault(); submitCommand(); break
      case 'Tab':
        e.preventDefault(); if (suggestion) setInput(suggestion); break
      case 'ArrowUp':
        e.preventDefault()
        { const up = history.up(); if (up !== null) setInput(up) }
        break
      case 'ArrowDown':
        e.preventDefault()
        { const down = history.down(); if (down !== null) setInput(down) }
        break
      case 'c':
        if (e.ctrlKey) {
          e.preventDefault()
          setLines(prev => [...prev, { id: nextId(), type: 'input', content: input + '^C' }])
          setInput('')
        }
        break
      case 'l':
        if (e.ctrlKey) {
          e.preventDefault()
          setLines([]); setInput('')
        }
        break
    }
  }

  return (
    <div
      className="flex flex-col font-mono"
      style={{ background: '#0B0B0E', fontSize: 13, lineHeight: 1.5, position: 'absolute', inset: 0, overflow: 'hidden' }}
      onClick={() => { if (matrixMode) setMatrixMode(false); else inputRef.current?.focus() }}
    >
      {/* Matrix Rain overlay */}
      <MatrixRain active={matrixMode} />

      {/* Status bar */}
      <div
        style={{
          display:      'flex',
          alignItems:   'center',
          justifyContent: 'space-between',
          padding:      '5px 16px',
          background:   'rgba(0,0,0,0.6)',
          borderBottom: '1px solid rgba(79,195,247,0.12)',
          flexShrink:   0,
          zIndex:       10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: '#4fc3f7', fontSize: 10, fontFamily: 'monospace' }}>
            sayan@sayanos
          </span>
          <span style={{ color: '#444466', fontSize: 10 }}>~/desktop</span>
          <span style={{ background: '#00c853', color: '#000', fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 3, letterSpacing: '0.05em' }}>
            AVAILABLE
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ color: '#444466', fontSize: 10 }}>bash · SayanShell 1.0</span>
          <span style={{ color: '#4fc3f7', fontSize: 10, fontFamily: 'monospace' }}>{clock}</span>
        </div>
      </div>

      {/* Output area */}
      <div
        className="flex-1 overflow-y-auto"
        style={{ padding: '14px 18px', zIndex: 5 }}
      >
        {lines.map(line => (
          <div
            key={line.id}
            style={{
              color:      LINE_COLORS[line.type],
              minHeight:  '1.5em',
              whiteSpace: 'pre',
            }}
          >
            {line.type === 'input' ? (
              <span>
                <span style={{ color: '#4fc3f7', fontWeight: 600 }}>sayan</span>
                <span style={{ color: '#7c3aed' }}>@</span>
                <span style={{ color: '#4fc3f7' }}>sayanos</span>
                <span style={{ color: '#444466' }}> ~ </span>
                <span style={{ color: '#c3e88d' }}>% </span>
                <span style={{ color: '#ffffff' }}>{line.content}</span>
              </span>
            ) : (
              line.content
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Matrix mode message */}
      {matrixMode && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20, pointerEvents: 'none' }}>
          <div style={{ textAlign: 'center', color: '#00e676', fontFamily: 'monospace', textShadow: '0 0 20px #00e676' }}>
            <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>THE MATRIX</div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>Click or press any key to exit</div>
          </div>
        </div>
      )}

      {/* Input row */}
      {ready && !matrixMode && (
        <div
          style={{
            borderTop:  '1px solid rgba(79,195,247,0.12)',
            padding:    '10px 18px',
            display:    'flex',
            alignItems: 'center',
            background: 'rgba(0,0,0,0.4)',
            flexShrink: 0,
            zIndex:     10,
          }}
        >
          <span style={{ whiteSpace: 'nowrap', marginRight: 6 }}>
            <span style={{ color: '#4fc3f7', fontWeight: 600 }}>sayan</span>
            <span style={{ color: '#7c3aed' }}>@</span>
            <span style={{ color: '#4fc3f7' }}>sayanos</span>
            <span style={{ color: '#444466' }}> ~ </span>
            <span style={{ color: '#c3e88d' }}>% </span>
          </span>

          <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center' }}>
            {/* Ghost suggestion */}
            {suggestion && (
              <span
                style={{
                  position:      'absolute',
                  left:          0,
                  color:         'rgba(79,195,247,0.25)',
                  pointerEvents: 'none',
                  whiteSpace:    'pre',
                  fontFamily:    'inherit',
                  fontSize:      'inherit',
                }}
              >
                {suggestion}
              </span>
            )}
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              placeholder={suggestion ? '' : "type 'help' to start..."}
              style={{
                background:  'transparent',
                border:      'none',
                outline:     'none',
                color:       '#ffffff',
                fontFamily:  'inherit',
                fontSize:    'inherit',
                lineHeight:  'inherit',
                width:       '100%',
                caretColor:  '#4fc3f7',
              }}
            />
          </div>
        </div>
      )}

      {/* Quick commands hint bar */}
      {ready && !matrixMode && (
        <div
          style={{
            display:    'flex',
            gap:        8,
            padding:    '5px 18px',
            background: 'rgba(0,0,0,0.5)',
            borderTop:  '1px solid rgba(255,255,255,0.03)',
            flexShrink: 0,
            overflowX:  'auto',
            zIndex:     10,
          }}
        >
          {['help', 'whoami', 'neofetch', 'skills', 'projects', 'matrix', 'ls', 'ping sayan', 'sudo hire sayan'].map(cmd => (
            <button
              key={cmd}
              onClick={e => { e.stopPropagation(); setInput(cmd); setTimeout(() => inputRef.current?.focus(), 0) }}
              style={{
                background:   'rgba(79,195,247,0.07)',
                border:       '1px solid rgba(79,195,247,0.15)',
                borderRadius: 4,
                color:        '#4fc3f7',
                fontSize:     9,
                padding:      '2px 8px',
                cursor:       'pointer',
                whiteSpace:   'nowrap',
                fontFamily:   'monospace',
                transition:   'all 0.12s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(79,195,247,0.18)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(79,195,247,0.07)' }}
            >
              {cmd}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}