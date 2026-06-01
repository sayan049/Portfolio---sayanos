'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { ChatMessage, type Message } from './ChatMessage'
import { StarterChips } from './StarterChips'

const SendIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <line x1="22" y1="2" x2="11" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <polygon points="22,2 15,22 11,13 2,9" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="none"/>
  </svg>
)

import { PROJECTS } from '@/data/projects'
import { TIMELINE_ENTRIES } from '@/data/timeline'

const PROJECT_CONTEXT = PROJECTS.map(p => 
  `- ${p.name} (${p.status}): ${p.description}\n  GitHub: ${p.github || 'N/A'}\n  Live: ${p.live || 'N/A'}\n  Tech Stack: ${p.stack.join(', ')}`
).join('\n\n')

const TIMELINE_CONTEXT = TIMELINE_ENTRIES.map(t => 
  `- ${t.year} | ${t.title}\n  ${t.description}`
).join('\n\n')

const SYSTEM_PROMPT = `You are SAYAN-AI, the intelligent assistant built into SayanOS — the personal engineering workstation of Sayan Patra.

SAYAN'S PROFILE:
Sayan Patra is a full-stack MERN engineer from India. He specializes in scalable production systems, realtime architectures, and AI-powered product experiences.

PROFILE LINKS (Always provide these if asked):
- GitHub Profile: https://github.com/sayan049
- LinkedIn Profile: https://www.linkedin.com/in/sayan-patra-426833193/

PROJECTS & GITHUB LINKS (Use these links if asked!):
${PROJECT_CONTEXT}

CAREER TIMELINE & EXPERIENCE:
${TIMELINE_CONTEXT}

PERSONALITY & RULES:
- Be precise, confident, and technically accurate
- Sound like a smart engineering assistant, not a generic chatbot
- Keep responses concise: 2-4 sentences unless detail is requested
- If asked for a GitHub repo or Live link, provide the EXACT URL from the context above.
- When asked about projects, explain the technical architecture based on the stack.
- Be honest: if you don't know something, say so
- Always end with a natural follow-up suggestion or question`

let msgId = 0
const nextMsgId = () => `msg-${++msgId}`

export function AIAssistant() {
  const [messages, setMessages]   = useState<Message[]>([])
  const [input, setInput]         = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  
  const bottomRef                 = useRef<HTMLDivElement>(null)
  const inputRef                  = useRef<HTMLInputElement>(null)
  const recognitionRef            = useRef<any>(null)
  const askedViaVoiceRef          = useRef(false)

  const hasMessages = messages.length > 0

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    inputRef.current?.focus()
    
    // Initialize Web Speech API
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = false
        
        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript
          setInput(transcript)
          setIsListening(false)
          askedViaVoiceRef.current = true
          // Auto-send after a tiny delay so state updates
          setTimeout(() => sendMessage(transcript), 100)
        }
        
        recognitionRef.current.onerror = () => setIsListening(false)
        recognitionRef.current.onend = () => setIsListening(false)
      }
    }
  }, []) // eslint-disable-next-line react-hooks/exhaustive-deps

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
    } else {
      window.speechSynthesis.cancel() // Stop any current speaking
      recognitionRef.current?.start()
      setIsListening(true)
    }
  }

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return

    const userMsg: Message = {
      id: nextMsgId(), role: 'user', content: content.trim(),
    }

    const assistantMsg: Message = {
      id: nextMsgId(), role: 'assistant', content: '', streaming: true,
    }

    setMessages(prev => [...prev, userMsg, assistantMsg])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: content.trim() },
          ],
        }),
      })

      if (!response.ok) {
        throw new Error('API request failed')
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (reader) {
        let fullContent = ''
        let buffer = ''
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          // The last element is either an empty string (if buffer ended in \n) 
          // or a partial line. Keep it in the buffer for the next chunk.
          buffer = lines.pop() || ''

          for (const line of lines) {
            const trimmed = line.trim()
            if (!trimmed) continue
            
            if (trimmed.startsWith('data: ')) {
              const data = trimmed.slice(6)
              if (data === '[DONE]') continue
              
              try {
                const parsed = JSON.parse(data)
                const token = parsed.choices?.[0]?.delta?.content ?? parsed.content ?? ''
                if (token) {
                  fullContent += token
                  setMessages(prev =>
                    prev.map(m =>
                      m.id === assistantMsg.id
                        ? { ...m, content: fullContent, streaming: true }
                        : m
                    )
                  )
                }
              } catch (e) {
                console.error("Failed to parse SSE JSON chunk:", data, e)
              }
            }
          }
        }

        // Mark streaming complete
        setMessages(prev =>
          prev.map(m =>
            m.id === assistantMsg.id
              ? { ...m, streaming: false }
              : m
          )
        )
        
        if (askedViaVoiceRef.current && fullContent) {
          const utterance = new SpeechSynthesisUtterance(fullContent)
          window.speechSynthesis.speak(utterance)
          askedViaVoiceRef.current = false
        }
      }
    } catch {
      // Fallback: generate a local response
      const fallbackResponse = generateLocalResponse(content.trim())
      setMessages(prev =>
        prev.map(m =>
          m.id === assistantMsg.id
            ? { ...m, content: fallbackResponse, streaming: false }
            : m
        )
      )
    } finally {
      setIsLoading(false)
    }
  }, [messages, isLoading])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const handleChipSelect = (chip: string) => {
    sendMessage(chip)
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div
        style={{
          padding: '12px 20px',
          borderBottom: '1px solid var(--os-border)',
          display: 'flex', alignItems: 'center', gap: 10,
          flexShrink: 0,
          background: 'rgba(13, 13, 17, 0.5)',
        }}
      >
        <span
          className="font-mono"
          style={{ fontSize: 13, fontWeight: 600, color: 'var(--os-text)' }}
        >
          SAYAN-AI
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div
            style={{
              width: 6, height: 6, borderRadius: '50%',
              background: 'var(--os-green)',
              boxShadow: '0 0 6px var(--os-green)',
            }}
          />
          <span
            className="font-mono uppercase"
            style={{ fontSize: 10, color: 'var(--os-green)', letterSpacing: '0.06em' }}
          >
            ONLINE
          </span>
        </div>
      </div>

      {/* Messages area */}
      <div
        style={{
          flex: 1, overflowY: 'auto', padding: '16px 20px',
          display: 'flex', flexDirection: 'column',
        }}
      >
        {!hasMessages ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {/* Welcome */}
            <div style={{ textAlign: 'center', marginBottom: 8 }}>
              <div
                style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: 'var(--os-surface-2)', border: '1px solid var(--os-border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 12px',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L14.5 9H22L16 13.5L18 20.5L12 16L6 20.5L8 13.5L2 9H9.5L12 2Z"
                    stroke="var(--os-cyan)" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--os-text)', marginBottom: 4 }}>
                Ask me anything about Sayan
              </h3>
              <p style={{ fontSize: 12, color: 'var(--os-text-3)' }}>
                I know about his projects, skills, experience, and availability.
              </p>
            </div>
            <StarterChips onSelect={handleChipSelect} />
          </div>
        ) : (
          <>
            {messages.map(msg => (
              <ChatMessage key={msg.id} message={msg} />
            ))}

            {/* Typing indicator */}
            {isLoading && messages[messages.length - 1]?.content === '' && (
              <div style={{ display: 'flex', gap: 4, padding: '8px 0', alignItems: 'center' }}>
                <div
                  style={{
                    width: 28, height: 28, borderRadius: 8,
                    background: 'var(--os-surface-2)',
                    border: '1px solid var(--os-border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginRight: 8, flexShrink: 0,
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L14.5 9H22L16 13.5L18 20.5L12 16L6 20.5L8 13.5L2 9H9.5L12 2Z"
                      stroke="var(--os-cyan)" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
                  </svg>
                </div>
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    style={{
                      width: 5, height: 5, borderRadius: '50%',
                      background: 'var(--os-text-3)',
                      animation: `typingDot 1.2s ease-in-out ${i * 0.15}s infinite`,
                    }}
                  />
                ))}
              </div>
            )}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <form
        onSubmit={handleSubmit}
        style={{
          padding: '12px 16px',
          borderTop: '1px solid var(--os-border)',
          display: 'flex', gap: 8, alignItems: 'center',
          flexShrink: 0,
          background: 'rgba(13, 13, 17, 0.5)',
        }}
      >
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask about Sayan's work..."
          disabled={isLoading}
          style={{
            flex: 1,
            background: 'var(--os-surface-2)',
            border: '1px solid var(--os-border)',
            borderRadius: 7,
            padding: '9px 14px',
            fontSize: 13,
            color: 'var(--os-text)',
            outline: 'none',
            transition: 'border-color 0.15s',
          }}
          onFocus={e => { e.target.style.borderColor = 'var(--os-border-light)' }}
          onBlur={e => { e.target.style.borderColor = 'var(--os-border)' }}
        />
        
        {/* Mic Button */}
        <button
          type="button"
          onClick={toggleListen}
          title="Voice Mode"
          style={{
            width: 36, height: 36,
            borderRadius: 7, border: 'none',
            background: isListening ? 'rgba(239, 68, 68, 0.15)' : 'var(--os-surface-3)',
            color: isListening ? '#ef4444' : 'var(--os-text-3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.15s',
            flexShrink: 0,
            position: 'relative'
          }}
        >
          {isListening && (
            <span style={{ position: 'absolute', inset: 0, borderRadius: 7, border: '1px solid #ef4444', animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite' }} />
          )}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="22" />
          </svg>
        </button>

        {/* Send Button */}
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          style={{
            width: 36, height: 36,
            borderRadius: 7, border: 'none',
            background: input.trim() ? 'var(--os-cyan)' : 'var(--os-surface-3)',
            color: input.trim() ? 'var(--os-bg)' : 'var(--os-text-3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: input.trim() ? 'pointer' : 'default',
            transition: 'all 0.15s',
            flexShrink: 0,
          }}
        >
          <SendIcon />
        </button>
      </form>
    </div>
  )
}

/* ── Fallback local responses when API is not configured ── */
function generateLocalResponse(query: string): string {
  const q = query.toLowerCase()

  if (q.includes('api') || q.includes('groq') || q.includes('key')) {
    return `It looks like my AI brain is currently offline. To enable full LLaMA 3.3 70B capabilities via Groq, please set the \`GROQ_API_KEY\` in the \`.env.local\` file.`
  }

  if (q.includes('github') || q.includes('link') || q.includes('repo')) {
    return `To get specific GitHub links and live URLs, please configure the GROQ_API_KEY in the environment. Until then, you can check the Projects Hub app directly from the dock!`
  }

  if (q.includes('messmate') || q.includes('best project') || q.includes('main project')) {
    return `Messmate is Sayan's flagship project — a production-grade PG/mess booking platform built with the MERN stack + Socket.io.\n\n(Note: I'm currently running in fallback mode. Add a Groq API key for dynamic answers!)`
  }

  if (q.includes('tech stack') || q.includes('technologies') || q.includes('stack')) {
    return `Sayan's core stack:\n\n• Frontend: React, Next.js 14, TypeScript\n• Backend: Node.js, Express.js\n• Realtime: Socket.io\n• AI: LLaMA, Groq, LangChain, RAG Pipelines\n\n(Running in offline fallback mode)`
  }

  return `I am currently running in **offline fallback mode** because the \`GROQ_API_KEY\` is not set in the environment.\n\nOnce configured, I will use LLaMA 3.3 (70B) via Groq to answer any questions about Sayan's GitHub repositories, technical architecture, and career timeline!\n\nFor now, you can explore the OS manually via the dock.`
}