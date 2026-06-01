'use client'

import { motion } from 'framer-motion'
import { listVariants, listItemVariants } from '@/lib/motion'

interface StarterChipsProps {
  onSelect: (message: string) => void
}

const CHIPS = [
  'Tell me about Messmate',
  "What's Sayan's tech stack?",
  'Explain the realtime architecture',
  'Is Sayan available?',
  'Show me his best project',
  'What AI work has Sayan done?',
]

export function StarterChips({ onSelect }: StarterChipsProps) {
  return (
    <div style={{ padding: '24px 20px' }}>
      <div
        className="font-mono uppercase"
        style={{
          fontSize: 10, color: 'var(--os-text-3)',
          letterSpacing: '0.1em', marginBottom: 16, textAlign: 'center',
        }}
      >
        Suggested Questions
      </div>

      <motion.div
        variants={listVariants}
        initial="hidden"
        animate="visible"
        style={{
          display: 'flex', flexWrap: 'wrap',
          gap: 8, justifyContent: 'center',
        }}
      >
        {CHIPS.map(chip => (
          <motion.button
            key={chip}
            variants={listItemVariants}
            onClick={() => onSelect(chip)}
            whileHover={{
              borderColor: 'var(--os-cyan)',
              color: 'var(--os-text)',
              transition: { duration: 0.12 },
            }}
            whileTap={{ scale: 0.97 }}
            style={{
              background:   'var(--os-surface-2)',
              border:       '1px solid var(--os-border)',
              borderRadius: 20,
              padding:      '7px 14px',
              fontSize:     12,
              color:        'var(--os-text-2)',
              cursor:       'pointer',
              transition:   'all 0.15s',
            }}
          >
            {chip}
          </motion.button>
        ))}
      </motion.div>
    </div>
  )
}