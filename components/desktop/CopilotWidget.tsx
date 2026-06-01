'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useOSStore } from '@/stores/os.store'
import { MessageSquare, Sparkles, X, Send, Loader2 } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

const CONTEXT_MESSAGES: Record<string, string> = {
  'vscode': "Snooping around my source code? 👀 Notice how I used Zustand to build a robust window management system!",
  'vision-control': "Wave your hands! 🖐️ I used TensorFlow's Handpose model and applied LERP math to make the dragging buttery smooth.",
  'resume-game': "Use your arrow keys to play! 🎮 I integrated Kaboom.js into the React tree for this 2D physics engine.",
  'safari': "A fully functional browser inside a browser. 🌐 Try navigating to your favorite site!",
  'projects': "Here are some of my proudest builds. 🚀 You can actually click them to view their real source code in the VS Code app!",
  'terminal': "Ah, a fellow CLI enthusiast! 💻 Try typing 'help' to see what Easter eggs I've hidden in this faux-UNIX environment.",
  'system-monitor': "Don't worry, this isn't mining crypto. 📈 It's a real-time monitor of the OS's virtualized resources.",
  'timeline': "My professional journey! ⏳ I built this custom timeline component from scratch using Framer Motion.",
  'contact': "Let's get in touch! 📬 I'm currently looking for full-stack opportunities.",
  'ai-assistant': "Hello! 🤖 I am powered by Groq's Llama 3 API for lightning-fast inference.",
  'resume': "My classic PDF resume. 📄 But let's be honest, this OS is way more fun to look at."
}

export function CopilotWidget() {
  const windows = useOSStore(s => s.windows)
  const focusedApp = Object.values(windows).find(w => w.isFocused && !w.isMinimized)?.id || null
  const isGlitching = useOSStore(s => s.isGlitching)
  
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [hasGreeted, setHasGreeted] = useState(false)
  const [notification, setNotification] = useState<string | null>(null)
  const [isNotificationDismissed, setIsNotificationDismissed] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll chat
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  // Context-Aware Observer
  useEffect(() => {
    if (isGlitching) return

    if (!hasGreeted) {
      setTimeout(() => {
        setNotification("Hi! I'm Sayan's AI Copilot. I'm here to guide you through the OS.")
        setHasGreeted(true)
      }, 2000)
    } else if (focusedApp && CONTEXT_MESSAGES[focusedApp]) {
      // Small delay so it feels natural
      setIsNotificationDismissed(false)
      const timer = setTimeout(() => {
        setNotification(CONTEXT_MESSAGES[focusedApp])
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [focusedApp, isGlitching, hasGreeted])

  const handleChat = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isTyping) return

    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setIsTyping(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { 
              role: 'system', 
              content: `You are Sayan Copilot, an AI assistant built by Sayan Patra. You live inside SayanOS, a web-based operating system portfolio. 
Sayan Patra is a highly skilled Full-Stack Developer and AI Integrator. 
His key skills:
- React & Next.js (Used to build this OS)
- TypeScript & TailwindCSS
- AI/ML Integrations (TensorFlow.js for Handpose vision control, Groq for fast LLM inference)
- State Management (Zustand)
- Game Dev (Kaboom.js used for the Resume Game)

CRITICAL INSTRUCTIONS:
1. Always keep your answers short, concise, and professional. 
2. Use markdown formatting (like **bold** and bullet points) to make it easy to read. 
3. Do NOT hallucinate skills or experiences not listed here.` 
            },
            ...messages,
            { role: 'user', content: userMsg }
          ]
        })
      })

      if (!response.ok) throw new Error('Failed')
      
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      
      let assistantMsg = ''
      setMessages(prev => [...prev, { role: 'assistant', content: '' }])

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          
          const chunk = decoder.decode(value, { stream: true })
          const lines = chunk.split('\n')
          
          for (const line of lines) {
            if (line.startsWith('data: ') && line !== 'data: [DONE]') {
              try {
                const data = JSON.parse(line.slice(6))
                const token = data.choices?.[0]?.delta?.content || data.content || ''
                assistantMsg += token
                
                setMessages(prev => {
                  const newArr = [...prev]
                  newArr[newArr.length - 1] = { role: 'assistant', content: assistantMsg }
                  return newArr
                })
              } catch (e) {}
            }
          }
        }
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I lost connection to the server.' }])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="fixed bottom-24 right-6 z-[9999] flex flex-col items-end pointer-events-none">
      
      {/* Popover Notification */}
      <AnimatePresence>
        {!isOpen && notification && !isNotificationDismissed && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className="mb-4 max-w-[280px] bg-white/10 backdrop-blur-xl border border-white/20 p-3 rounded-2xl shadow-2xl pointer-events-auto flex items-start gap-3 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#00f2fe]/10 to-[#4facfe]/10 opacity-50" />
            
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#00f2fe] to-[#4facfe] flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(0,242,254,0.5)]">
              <Sparkles size={16} className="text-black" />
            </div>
            
            <div className="flex-1 text-sm text-white/90 leading-snug relative z-10 pt-1">
              {notification}
            </div>

            <button 
              onClick={() => setIsNotificationDismissed(true)}
              className="absolute top-2 right-2 text-white/40 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity z-20"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="mb-4 w-[340px] h-[450px] bg-[#1a1a1a]/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_10px_50px_rgba(0,0,0,0.5)] pointer-events-auto flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#00f2fe] to-[#4facfe] flex items-center justify-center shadow-[0_0_15px_rgba(0,242,254,0.3)]">
                  <Sparkles size={16} className="text-black" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Sayan Copilot</h3>
                  <p className="text-[10px] text-[#00f2fe] uppercase tracking-wider">Online</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Chat History */}
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 no-scrollbar">
              <div className="bg-white/5 p-3 rounded-2xl rounded-tl-sm text-sm text-white/90 self-start max-w-[85%] border border-white/5">
                Hi! I'm Sayan's personal AI agent. Ask me anything about his skills, experience, or this OS!
              </div>
              
              {messages.map((msg, i) => (
                <div 
                  key={i} 
                  className={`p-3 rounded-2xl text-sm max-w-[85%] ${
                    msg.role === 'user' 
                      ? 'bg-[#00f2fe]/20 text-[#00f2fe] self-end rounded-tr-sm border border-[#00f2fe]/20' 
                      : 'bg-white/5 text-white/90 self-start rounded-tl-sm border border-white/5'
                  }`}
                >
                  {msg.role === 'assistant' ? (
                    <div className="prose-sm prose-invert [&>p]:mb-2 [&>ul]:list-disc [&>ul]:pl-4 [&>ul]:mb-2 last:[&>*]:mb-0">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="bg-white/5 p-3 rounded-2xl rounded-tl-sm text-sm text-white/60 self-start flex items-center gap-2 w-fit border border-white/5">
                  <Loader2 size={14} className="animate-spin" /> Thinking...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleChat} className="p-3 border-t border-white/10 bg-black/20 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#00f2fe]/50 transition-colors"
              />
              <button 
                type="submit"
                disabled={!input.trim() || isTyping}
                className="w-10 h-10 rounded-xl bg-[#00f2fe] text-black flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#4facfe] transition-colors"
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen)
          setIsNotificationDismissed(true)
        }}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.5)] pointer-events-auto transition-transform hover:scale-110 active:scale-95 ${
          isOpen 
            ? 'bg-white/10 text-white border border-white/20' 
            : 'bg-gradient-to-tr from-[#00f2fe] to-[#4facfe] text-black'
        }`}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        
        {/* Unread indicator / pulse when notification is active */}
        {!isOpen && notification && !isNotificationDismissed && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-[#1a1a1a] animate-pulse" />
        )}
      </button>
    </div>
  )
}
