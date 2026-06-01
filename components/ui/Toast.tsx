'use client'

import { useOSStore } from '@/stores/os.store'
import { AnimatePresence, motion } from 'framer-motion'

export function Toast() {
  const toastMessage = useOSStore(s => s.toastMessage)

  return (
    <AnimatePresence>
      {toastMessage && (
        <motion.div
          key="toast"
          initial={{ opacity: 0, x: -20, scale: 0.94 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -12, scale: 0.97 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position:       'fixed',
            top:            36,          // just below the 28px menu bar
            left:           12,
            zIndex:         99999,
            background:     'rgba(18, 18, 26, 0.94)',
            border:         '1px solid rgba(79,195,247,0.25)',
            borderRadius:   10,
            padding:        '9px 16px',
            fontSize:       12,
            color:          'var(--os-text)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            boxShadow:      '0 4px 24px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
            whiteSpace:     'nowrap',
            maxWidth:       320,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 6, height: 6, borderRadius: '50%',
                background: 'var(--os-cyan)',
                boxShadow:  '0 0 6px var(--os-cyan)',
                flexShrink: 0,
                animation:  'pulse 1.4s ease-in-out infinite',
              }}
            />
            {toastMessage}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}