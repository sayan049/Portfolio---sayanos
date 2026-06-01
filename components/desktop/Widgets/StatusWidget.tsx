'use client'

import { useEffect, useState } from 'react'

function useDeveloperStatus() {
  const [status, setStatus] = useState({
    spotify: { playing: true, track: 'Lofi Hip Hop Radio', artist: 'Lofi Girl', color: '#1DB954' },
    github: { lastCommit: '14 mins ago', repo: 'sayanos', color: '#4FC3F7' },
    ide: { active: true, project: 'sayanos', workspace: 'VS Code', color: '#007ACC' }
  })

  // Simulated cycle to look "live"
  useEffect(() => {
    const id = setInterval(() => {
      setStatus(prev => {
        // Toggle spotify occasionally
        const newTrack = Math.random() > 0.8 ? (prev.spotify.track === 'Chill Beats' ? 'Lofi Hip Hop Radio' : 'Chill Beats') : prev.spotify.track;
        const newPlaying = Math.random() > 0.95 ? !prev.spotify.playing : prev.spotify.playing;
        
        // Change github commit occasionally
        let newCommit = prev.github.lastCommit
        if (Math.random() > 0.85) {
          newCommit = 'Just now'
        } else if (prev.github.lastCommit === 'Just now') {
          newCommit = '2 mins ago'
        }
        
        return {
          ...prev,
          spotify: { ...prev.spotify, track: newTrack, playing: newPlaying },
          github: { ...prev.github, lastCommit: newCommit }
        }
      })
    }, 12000)
    return () => clearInterval(id)
  }, [])

  return status
}

export function StatusWidget() {
  const status = useDeveloperStatus()

  return (
    <div
      style={{
        background:          'rgba(20,20,28,0.72)',
        backdropFilter:      'blur(16px)',
        WebkitBackdropFilter:'blur(16px)',
        border:              '1px solid var(--glass-border)',
        borderRadius:        12,
        padding:             '14px 18px',
        minWidth:            180,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
        <div className="status-dot status-dot-pulse" style={{ background: 'var(--os-green)' }} />
        <span className="font-mono uppercase" style={{ fontSize: 10, fontWeight: 600, color: 'var(--os-text-3)', letterSpacing: '0.08em' }}>
          Live Activity
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {/* IDE */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20, borderRadius: 4, background: 'rgba(0, 122, 204, 0.15)', color: status.ide.color }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 16V8l-6-4-6 4v8l6 4 6-4z"/><polyline points="6 8 12 12 18 8"/><line x1="12" y1="12" x2="12" y2="22"/></svg>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--os-text)', lineHeight: 1 }}>{status.ide.workspace}</span>
            <span style={{ fontSize: 10, color: 'var(--os-text-3)', marginTop: 2 }}>Editing {status.ide.project}</span>
          </div>
        </div>
        
        {/* GitHub */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20, borderRadius: 4, background: 'rgba(79, 195, 247, 0.15)', color: status.github.color }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--os-text)', lineHeight: 1 }}>GitHub</span>
            <span style={{ fontSize: 10, color: 'var(--os-text-3)', marginTop: 2 }}>{status.github.repo} • {status.github.lastCommit}</span>
          </div>
        </div>

        {/* Spotify */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20, borderRadius: '50%', background: status.spotify.playing ? 'rgba(29, 185, 84, 0.15)' : 'rgba(255, 255, 255, 0.05)', color: status.spotify.playing ? status.spotify.color : 'var(--os-text-3)' }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill={status.spotify.playing ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--os-text)', lineHeight: 1 }}>{status.spotify.playing ? 'Spotify' : 'Paused'}</span>
            <span style={{ fontSize: 10, color: 'var(--os-text-3)', marginTop: 2 }}>{status.spotify.track}</span>
          </div>
        </div>
      </div>
    </div>
  )
}