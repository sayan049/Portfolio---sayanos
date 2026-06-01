'use client'

import { useState, useEffect } from 'react'
import { useOSStore } from '@/stores/os.store'
import { APP_NAMES } from '@/lib/constants'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts'
import { Activity, Clock, MousePointerClick, Target } from 'lucide-react'

export function RecruiterAnalytics() {
  const sessionStartTime = useOSStore(s => s.sessionStartTime)
  const appOpenCount = useOSStore(s => s.appOpenCount)
  
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [])

  const durationSeconds = Math.floor((now - sessionStartTime) / 1000)
  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m}m ${s}s`
  }

  // Transform data for charts
  const barData = Object.entries(appOpenCount)
    .filter(([id, count]) => count > 0 && id !== 'analytics')
    .map(([id, count]) => ({
      name: APP_NAMES[id as keyof typeof APP_NAMES] || id,
      clicks: count,
    }))
    .sort((a, b) => b.clicks - a.clicks)

  const totalClicks = barData.reduce((acc, item) => acc + item.clicks, 0)
  
  // Fake algorithm for "Match Score"
  // Starts at 50%, goes up based on time spent and apps clicked
  const matchScore = Math.min(99, 50 + (durationSeconds / 60) * 10 + (totalClicks * 5))

  return (
    <div className="w-full h-full bg-[#111]">
      <div className="flex flex-col h-full text-white p-6 font-sans overflow-y-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Target className="text-[#00f2fe]" size={32} />
            Your Session Analytics
          </h1>
          <p className="text-white/60 mt-2">
            Instead of you analyzing Sayan, Sayan is analyzing you. Here is real-time telemetry of your interactions with this OS.
          </p>
        </div>

        {/* Top KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Clock className="text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-white/50">Time on Site</p>
              <p className="text-2xl font-bold">{formatDuration(durationSeconds)}</p>
            </div>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
              <MousePointerClick className="text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-white/50">Apps Explored</p>
              <p className="text-2xl font-bold">{totalClicks}</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-[#00f2fe]/10 to-[#4facfe]/10 border border-[#00f2fe]/30 rounded-xl p-5 flex items-center gap-4 relative overflow-hidden">
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#00f2fe]/20 to-transparent pointer-events-none" />
            <div className="w-12 h-12 rounded-full bg-[#00f2fe]/20 flex items-center justify-center shrink-0">
              <Activity className="text-[#00f2fe]" />
            </div>
            <div>
              <p className="text-sm text-[#00f2fe]/80 font-medium">Predicted Match</p>
              <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00f2fe] to-white">
                {matchScore.toFixed(0)}%
              </p>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-[300px]">
          {/* Bar Chart */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col">
            <h3 className="text-lg font-bold mb-6">Interaction Frequency</h3>
            {barData.length > 0 ? (
              <div className="flex-1 w-full min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} layout="vertical" margin={{ left: 30 }}>
                    <XAxis type="number" hide />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }} 
                    />
                    <Tooltip 
                      cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                      contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    />
                    <Bar dataKey="clicks" radius={[0, 4, 4, 0]}>
                      {barData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#00f2fe' : 'rgba(255,255,255,0.2)'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-white/40">
                Not enough data. Open some apps!
              </div>
            )}
          </div>

          {/* AI Assessment */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col justify-start relative overflow-y-auto group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00f2fe]/5 to-transparent opacity-50" />
            
            <h3 className="text-xl font-bold mb-4 relative z-10">AI Hiring Assessment</h3>
            <div className="space-y-4 relative z-10 text-white/80">
              <p>Based on your interaction telemetry, our algorithms have concluded the following:</p>
              
              <ul className="list-disc pl-5 space-y-2">
                <li>You value complex frontend architecture (Time spent: {formatDuration(durationSeconds)}).</li>
                {totalClicks > 3 && (
                  <li>You are a thorough investigator, having opened {totalClicks} applications.</li>
                )}
                {barData.find(d => d.name === 'VS Code AI') && (
                  <li>You checked the source code. You appreciate clean React patterns.</li>
                )}
                <li><strong className="text-[#00f2fe]">Conclusion:</strong> Sayan Patra possesses the exact Full-Stack engineering skills required for your open role. You should probably schedule an interview.</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
