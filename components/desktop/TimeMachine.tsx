'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { History, X } from 'lucide-react'

export type OSTheme = '1995' | '2007' | '2026'

// Global Theme State (Local to component for ease, but affects entire document)
let currentTheme: OSTheme = '2026'

const THEME_STYLES = {
  '1995': `
    /* Windows 95 Theme Overrides */
    body {
      background: #008080 !important;
    }
    * {
      font-family: 'Courier New', Courier, monospace !important;
      border-radius: 0px !important;
      backdrop-filter: none !important;
      box-shadow: none !important;
      transition: none !important;
    }
    .bg-\\[\\#1a1a1a\\], .bg-\\[\\#1e1e1e\\], .bg-\\[\\#111\\], .bg-black\\/50 {
      background-color: #c0c0c0 !important;
      color: black !important;
    }
    .text-white, .text-white\\/80, .text-white\\/60 {
      color: black !important;
    }
    .border-white\\/10, .border-white\\/20, .border-t {
      border: 2px solid !important;
      border-top-color: #dfdfdf !important;
      border-left-color: #dfdfdf !important;
      border-right-color: #000 !important;
      border-bottom-color: #000 !important;
    }
    /* Buttons */
    button {
      background-color: #c0c0c0 !important;
      border: 2px solid !important;
      border-top-color: #dfdfdf !important;
      border-left-color: #dfdfdf !important;
      border-right-color: #000 !important;
      border-bottom-color: #000 !important;
      color: black !important;
    }
    button:active {
      border-top-color: #000 !important;
      border-left-color: #000 !important;
      border-right-color: #dfdfdf !important;
      border-bottom-color: #dfdfdf !important;
    }
  `,
  '2007': `
    /* Mac OS X Aqua / Windows Aero Theme Overrides */
    body {
      background: url('https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2070&auto=format&fit=crop') center/cover !important;
    }
    * {
      border-radius: 6px !important;
      font-family: 'Lucida Grande', 'Segoe UI', sans-serif !important;
    }
    .bg-\\[\\#1a1a1a\\], .bg-\\[\\#1e1e1e\\], .bg-\\[\\#111\\] {
      background: linear-gradient(180deg, #e6f0fa 0%, #b2c9db 100%) !important;
      color: #333 !important;
      border: 1px solid #7a9cba !important;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.8) !important;
    }
    .text-white, .text-white\\/80, .text-white\\/60 {
      color: #333 !important;
      text-shadow: 0 1px 0 rgba(255,255,255,0.8) !important;
    }
    .border-white\\/10 {
      border-color: #99b4cc !important;
    }
    /* Glossy Buttons */
    button {
      background: linear-gradient(180deg, #fff 0%, #e6f0fa 45%, #b2c9db 50%, #d3e1eb 100%) !important;
      color: #333 !important;
      border: 1px solid #7a9cba !important;
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.8) !important;
    }
  `,
  '2026': '' // Default SayanOS Theme (no overrides needed)
}

export function TimeMachine() {
  const [isOpen, setIsOpen] = useState(false)
  const [theme, setTheme] = useState<OSTheme>('2026')

  useEffect(() => {
    // Inject or update theme styles
    let styleEl = document.getElementById('time-machine-styles')
    if (!styleEl) {
      styleEl = document.createElement('style')
      styleEl.id = 'time-machine-styles'
      document.head.appendChild(styleEl)
    }
    styleEl.innerHTML = THEME_STYLES[theme]
    currentTheme = theme
  }, [theme])

  return (
    <>
      {/* Taskbar Widget Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 flex items-center gap-2 hover:bg-white/10 transition-colors h-full text-sm font-medium"
      >
        <History size={16} className={theme !== '2026' ? 'text-red-500 animate-spin-slow' : 'text-white'} />
        <span className="hidden sm:inline">Time Machine</span>
      </button>

      {/* Main UI */}
      {isOpen && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[9999] w-[400px]">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1a1a1a]/90 backdrop-blur-2xl border border-[#00f2fe]/30 p-6 rounded-2xl shadow-[0_0_50px_rgba(0,242,254,0.1)] relative"
          >
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white"
            >
              <X size={16} />
            </button>

            <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
              <History className="text-[#00f2fe]" /> Time Machine
            </h3>
            <p className="text-xs text-white/50 mb-6">Travel through the history of UI design.</p>

            <div className="relative pt-6 pb-2 px-2">
              {/* Slider Track */}
              <div className="absolute top-8 left-0 right-0 h-1 bg-white/10 rounded-full" />
              
              <input 
                type="range" 
                min="0" 
                max="2" 
                step="1"
                value={theme === '1995' ? 0 : theme === '2007' ? 1 : 2}
                onChange={(e) => {
                  const val = parseInt(e.target.value)
                  if (val === 0) setTheme('1995')
                  if (val === 1) setTheme('2007')
                  if (val === 2) setTheme('2026')
                }}
                className="relative w-full z-10 opacity-0 cursor-pointer h-8 -mt-4"
              />

              {/* Custom Thumb & Marks */}
              <div className="absolute top-8 left-0 right-0 flex justify-between px-1 pointer-events-none -mt-1.5">
                {[0, 1, 2].map((step) => {
                  const isActive = (theme === '1995' && step === 0) || (theme === '2007' && step === 1) || (theme === '2026' && step === 2)
                  return (
                    <div key={step} className="flex flex-col items-center">
                      <div className={`w-4 h-4 rounded-full border-2 transition-colors ${isActive ? 'bg-[#00f2fe] border-white shadow-[0_0_10px_#00f2fe]' : 'bg-[#1a1a1a] border-white/30'}`} />
                      <span className={`text-xs mt-2 font-bold ${isActive ? 'text-[#00f2fe]' : 'text-white/40'}`}>
                        {step === 0 ? '1995' : step === 1 ? '2007' : '2026'}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
            
            <div className="mt-8 p-3 rounded-lg bg-white/5 border border-white/10 text-xs text-white/80 leading-relaxed">
              {theme === '1995' && "Ah, 1995. The era of pure HTML, dial-up modems, and the iconic Windows 95 aesthetic. Everything is sharp, gray, and aggressively functional."}
              {theme === '2007' && "Welcome to 2007. Steve Jobs just announced the iPhone. UI design is obsessed with glossy buttons, drop shadows, and the Aero glass look."}
              {theme === '2026' && "Back to the present. You are viewing SayanOS: a masterclass in React, Zustand, Tailwind, and futuristic Glassmorphism."}
            </div>
          </motion.div>
        </div>
      )}
    </>
  )
}
