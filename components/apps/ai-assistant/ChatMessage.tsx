'use client'

import { motion } from 'framer-motion'

export interface Message {
  id:        string
  role:      'user' | 'assistant'
  content:   string
  streaming?: boolean
}

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      style={{
        display:       'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        marginBottom:  12,
      }}
    >
      <div
        style={{
          maxWidth:     '78%',
          padding:      '10px 14px',
          borderRadius: 10,
          fontSize:     13,
          lineHeight:   1.6,
          color:        'var(--os-text)',
          background:   isUser
            ? 'var(--os-cyan-dim)'
            : 'var(--os-surface-2)',
          border:       isUser
            ? '1px solid rgba(79, 195, 247, 0.2)'
            : '1px solid var(--os-border)',
        }}
      >
        {/* Role label */}
        <div
          className="font-mono uppercase"
          style={{
            fontSize:      9,
            letterSpacing: '0.08em',
            color:         isUser ? 'var(--os-cyan)' : 'var(--os-text-3)',
            marginBottom:  6,
            fontWeight:    600,
          }}
        >
          {isUser ? 'YOU' : 'SAYAN-AI'}
        </div>

        {/* Content */}
        <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {message.content.split(/(https?:\/\/[^\s]+[^<.,:;"')\]\s])/g).map((part, i) => {
            if (part.match(/^https?:\/\//)) {
              return (
                <a
                  key={i}
                  href={part}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: 'var(--os-cyan)',
                    textDecoration: 'underline',
                    textUnderlineOffset: 2,
                    fontWeight: 500,
                  }}
                >
                  {part}
                </a>
              )
            }
            return <span key={i}>{part}</span>
          })}
          {message.streaming && (
            <span
              className="terminal-cursor"
              style={{ display: 'inline-block', width: 6, height: 12, marginLeft: 2, background: 'var(--os-text)' }}
            />
          )}
        </div>
      </div>
    </motion.div>
  )
}