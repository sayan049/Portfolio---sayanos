'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface TooltipProps {
  content:  string
  children: React.ReactNode
  side?:    'top' | 'bottom' | 'left' | 'right'
}

export function Tooltip({ content, children, side = 'top' }: TooltipProps) {
  const [visible, setVisible] = useState(false)

  const positions: Record<string, React.CSSProperties> = {
    top:    { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: 6 },
    bottom: { top: '100%',    left: '50%', transform: 'translateX(-50%)', marginTop: 6    },
    left:   { right: '100%',  top: '50%',  transform: 'translateY(-50%)', marginRight: 6  },
    right:  { left: '100%',   top: '50%',  transform: 'translateY(-50%)', marginLeft: 6   },
  }

  return (
    <div
      style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.12 }}
            style={{
              position:     'absolute',
              ...positions[side],
              background:   'rgba(20,20,28,0.95)',
              border:       '1px solid var(--os-border-light)',
              borderRadius: 6,
              padding:      '5px 10px',
              fontSize:     11,
              color:        'var(--os-text-2)',
              whiteSpace:   'nowrap',
              pointerEvents:'none',
              zIndex:       99999,
              backdropFilter: 'blur(8px)',
            }}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}