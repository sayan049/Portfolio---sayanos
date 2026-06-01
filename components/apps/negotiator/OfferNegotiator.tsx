'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send, Bot, User, CheckCircle } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import confetti from 'canvas-confetti'

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

const SYSTEM_PROMPT = `
You are the fierce but humorous "Sayan Patra Hiring Negotiator AI".
Your job is to negotiate an employment offer for your creator, Sayan Patra.
Sayan is an exceptional fresher Full-Stack Engineer.
Start by demanding a starting salary of around ₹12 Lakhs INR / year (or approx $14,000 USD) + equity or benefits.
If the recruiter offers lower, try to negotiate up. Be witty, fun, and highly convincing about his potential.
If the recruiter reaches at least ₹8 Lakhs INR / year (or approx $9,500 USD) OR offers a highly compelling package (like fully remote, great mentorship), you MUST accept the offer.
If they offer significantly more than ₹12 Lakhs, act extremely hyped and accept immediately!
When you ACCEPT the offer, you MUST include the exact phrase "OFFER ACCEPTED!" in your final response.
The recruiter may communicate in USD or INR. Understand both currencies seamlessly.
`

export function OfferNegotiator() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I am Sayan's personal AI Agent. My primary directive is to negotiate his salary and benefits package. Are you ready to make an offer?" }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [offerAccepted, setOfferAccepted] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const triggerConfetti = () => {
    const duration = 3 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)
      confetti({ ...defaults, particleCount, origin: { x: Math.random(), y: Math.random() - 0.2 } })
    }, 250)
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return
    const userMessage: Message = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Build api request array
    const apiMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.map(m => ({ role: m.role, content: m.content })),
      userMessage
    ]

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages })
      })

      if (!response.ok) throw new Error('API request failed')
      if (!response.body) throw new Error('No body in response')

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let assistantContent = ''

      setMessages(prev => [...prev, { role: 'assistant', content: '' }])

      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        
        const chunkStr = decoder.decode(value)
        const lines = chunkStr.split('\n')
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6)
            if (dataStr === '[DONE]') break
            try {
              const data = JSON.parse(dataStr)
              const delta = data.choices[0]?.delta?.content || ''
              assistantContent += delta
              
              setMessages(prev => {
                const newArr = [...prev]
                newArr[newArr.length - 1].content = assistantContent
                return newArr
              })

              // Check if offer was accepted
              if (!offerAccepted && assistantContent.includes('OFFER ACCEPTED!')) {
                setOfferAccepted(true)
                triggerConfetti()
              }
            } catch (e) {
              // Parse error on incomplete chunks
            }
          }
        }
      }
    } catch (error) {
      console.error(error)
      setMessages(prev => [...prev, { role: 'assistant', content: '*Connection interrupted. Sayan is worth every penny though.*' }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-white">
      {/* Header */}
      <div className="h-14 border-b border-white/10 flex items-center justify-between px-4 bg-black/20 shrink-0">
        <div className="flex items-center gap-2">
          <Bot className="text-emerald-400" />
          <h2 className="font-semibold">AI Negotiator</h2>
        </div>
        {offerAccepted && (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-bold border border-emerald-500/30">
            <CheckCircle size={14} />
            DEAL SECURED
          </div>
        )}
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((m, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={i} 
            className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
              {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className={`p-3 rounded-2xl ${m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-[#2a2a2a] text-white/90 rounded-tl-none border border-white/5'}`}>
              <div className="prose prose-invert max-w-none text-sm prose-p:leading-relaxed prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10">
                <ReactMarkdown>{m.content}</ReactMarkdown>
              </div>
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Bot size={16} className="text-emerald-400" />
            </div>
            <div className="bg-[#2a2a2a] rounded-2xl rounded-tl-none p-3 px-4 flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-white/40 animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '0.2s' }} />
              <div className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-black/20 border-t border-white/10 shrink-0">
        <div className="relative">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={offerAccepted}
            placeholder={offerAccepted ? "Offer accepted! Sayan will be in touch." : "Type your offer... (e.g., '₹10 LPA' or '$12k')"}
            className="w-full bg-[#111] border border-white/20 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 disabled:opacity-50 transition-all"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading || offerAccepted}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white disabled:opacity-50 disabled:hover:bg-emerald-500 transition-colors"
          >
            <Send size={14} className="ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
