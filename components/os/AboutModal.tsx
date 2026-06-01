'use client'

import { useOSStore } from '@/stores/os.store'
import { motion, AnimatePresence } from 'framer-motion'

export function AboutModal() {
  const isAboutOpen = useOSStore(s => s.isAboutOpen)
  const setAboutOpen = useOSStore(s => s.setAboutOpen)

  return (
    <AnimatePresence>
      {isAboutOpen && (
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999 }}>
          <motion.div
            drag
            dragMomentum={false}
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{
              pointerEvents: 'auto',
              background: 'rgba(28, 28, 36, 0.95)',
              backdropFilter: 'blur(40px) saturate(180%)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 16,
              width: 380,
              boxShadow: '0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05) inset',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '32px 24px',
              color: 'var(--os-text)',
            }}
          >
          {/* Close Button */}
          <button
            onClick={() => setAboutOpen(false)}
            style={{
              position: 'absolute',
              top: 12,
              left: 12,
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: '#ff5f56',
              border: '1px solid #e0443e',
              cursor: 'pointer',
            }}
            title="Close"
          />

          {/* Logo */}
          <div style={{ width: 80, height: 80, marginBottom: 16 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://img.icons8.com/color/120/operating-system.png"
              alt="SayanOS Logo"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>

          <h1 className="font-semibold" style={{ fontSize: 24, marginBottom: 4, letterSpacing: '-0.02em' }}>
            SayanOS
          </h1>
          <p style={{ fontSize: 13, color: 'var(--os-text-3)', marginBottom: 24 }}>
            Version 1.0.0
          </p>

          <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 20 }} />

          <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '8px 12px', fontSize: 12, width: '100%' }}>
            <span style={{ color: 'var(--os-text-3)', textAlign: 'right' }}>Built By</span>
            <span style={{ color: 'var(--os-text)', fontWeight: 500 }}>Sayan Patra</span>

            <span style={{ color: 'var(--os-text-3)', textAlign: 'right' }}>Processor</span>
            <span style={{ color: 'var(--os-text)' }}>Vercel Edge Network</span>

            <span style={{ color: 'var(--os-text-3)', textAlign: 'right' }}>Memory</span>
            <span style={{ color: 'var(--os-text)' }}>Next.js 14 / React 18</span>

            <span style={{ color: 'var(--os-text-3)', textAlign: 'right' }}>Graphics</span>
            <span style={{ color: 'var(--os-text)' }}>Framer Motion · GSAP</span>

            <span style={{ color: 'var(--os-text-3)', textAlign: 'right' }}>Display</span>
            <span style={{ color: 'var(--os-text)' }}>Liquid Retina XDR Display</span>
          </div>

          <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.06)', marginTop: 20, marginBottom: 16 }} />

          <p style={{ fontSize: 10, color: 'var(--os-text-4)', textAlign: 'center', lineHeight: 1.5 }}>
            ™ and © 2026 Sayan Patra.<br/>
            All Rights Reserved.<br/>
            Personal Engineering Portfolio System.
          </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
