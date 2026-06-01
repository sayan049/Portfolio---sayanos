'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function HireSequence() {
  const [active, setActive] = useState(false)

  useEffect(() => {
    const trigger = () => {
      setActive(true)
      // Auto close after 8 seconds
      setTimeout(() => setActive(false), 8000)
    }
    window.addEventListener('HIRE_SAYAN', trigger)
    return () => window.removeEventListener('HIRE_SAYAN', trigger)
  }, [])

  return (
    <AnimatePresence>
      {active && (
        <div className="fixed inset-0 z-[999999] pointer-events-none flex items-center justify-center">
          {/* Confetti backdrop using framer motion */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 40 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  y: -50, 
                  x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000), 
                  rotate: 0, 
                  opacity: 1, 
                  scale: Math.random() * 0.5 + 0.5 
                }}
                animate={{ 
                  y: typeof window !== 'undefined' ? window.innerHeight + 100 : 1000, 
                  x: `+=${Math.random() * 200 - 100}`,
                  rotate: 360 * (Math.random() * 4 + 1),
                  opacity: 0
                }}
                transition={{ 
                  duration: Math.random() * 2 + 2, 
                  ease: "linear",
                  delay: Math.random() * 1.5
                }}
                style={{
                  position: 'absolute',
                  width: 12,
                  height: 12,
                  backgroundColor: ['#4FC3F7', '#818CF8', '#34D399', '#FBBF24', '#F87171'][Math.floor(Math.random() * 5)],
                  borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                }}
              />
            ))}
          </div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="pointer-events-auto p-8 rounded-3xl border border-white/20 shadow-2xl flex flex-col items-center justify-center text-center max-w-md w-full mx-4"
            style={{
              background: 'rgba(20, 20, 30, 0.7)',
              backdropFilter: 'blur(30px) saturate(200%)',
              WebkitBackdropFilter: 'blur(30px) saturate(200%)',
            }}
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
              className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#4FC3F7] to-[#818CF8] flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(79,195,247,0.4)]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </motion.div>
            
            <h2 className="text-3xl font-bold text-white mb-2 font-sans tracking-tight">Contract Accepted</h2>
            <p className="text-[#9898B0] text-sm mb-8 font-sans leading-relaxed">
              Sayan Patra has been successfully deployed to your team. Prepare for massive architectural improvements and 10x engineering velocity.
            </p>

            <button
              onClick={() => setActive(false)}
              className="px-8 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-all hover:scale-105 active:scale-95 border border-white/10"
            >
              Close Protocol
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
