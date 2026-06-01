'use client'

import dynamic from 'next/dynamic'
import { Window } from './Window'

const Finder         = dynamic(() => import('@/components/apps/finder/Finder').then(m => ({ default: m.Finder })),             { ssr: false, loading: () => null })
const Safari         = dynamic(() => import('@/components/apps/safari/Safari').then(m => ({ default: m.Safari })),             { ssr: false, loading: () => null })
const Terminal       = dynamic(() => import('@/components/apps/terminal/Terminal').then(m => ({ default: m.Terminal })),       { ssr: false, loading: () => null })
const ProjectsHub    = dynamic(() => import('@/components/apps/projects/ProjectsHub').then(m => ({ default: m.ProjectsHub })),   { ssr: false, loading: () => null })
const SystemMonitor  = dynamic(() => import('@/components/apps/system-monitor/SystemMonitor').then(m => ({ default: m.SystemMonitor })), { ssr: false, loading: () => null })
const Timeline       = dynamic(() => import('@/components/apps/timeline/Timeline').then(m => ({ default: m.Timeline })),         { ssr: false, loading: () => null })
const AIAssistant    = dynamic(() => import('@/components/apps/ai-assistant/AIAssistant').then(m => ({ default: m.AIAssistant })), { ssr: false, loading: () => null })
const Contact        = dynamic(() => import('@/components/apps/contact/Contact').then(m => ({ default: m.Contact })),           { ssr: false, loading: () => null })

const ResumeGame     = dynamic(() => import('@/components/apps/resume-game/ResumeGame').then(m => ({ default: m.ResumeGame })),     { ssr: false, loading: () => null })
const VisionControl  = dynamic(() => import('@/components/apps/vision-control/VisionControl').then(m => ({ default: m.VisionControl })), { ssr: false, loading: () => null })
const ResumeViewer   = dynamic(() => import('@/components/apps/resume/ResumeViewer').then(m => ({ default: m.ResumeViewer })),   { ssr: false, loading: () => null })
const SettingsApp    = dynamic(() => import('@/components/apps/settings/SettingsApp').then(m => ({ default: m.SettingsApp })), { ssr: false, loading: () => null })
const VSCode         = dynamic(() => import('@/components/apps/vscode/VSCode').then(m => ({ default: m.VSCode })),           { ssr: false, loading: () => null })
const RecruiterAnalytics = dynamic(() => import('@/components/apps/analytics/RecruiterAnalytics').then(m => ({ default: m.RecruiterAnalytics })), { ssr: false, loading: () => null })
const OfferNegotiator  = dynamic(() => import('@/components/apps/negotiator/OfferNegotiator').then(m => ({ default: m.OfferNegotiator })), { ssr: false, loading: () => null })
const GithubCity  = dynamic(() => import('@/components/apps/github-city/GithubCity').then(m => ({ default: m.GithubCity })), { ssr: false, loading: () => null })

export function WindowManager() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="pointer-events-auto">
        <Window id="finder"><Finder /></Window>
        <Window id="safari"><Safari /></Window>
        <Window id="terminal"><Terminal /></Window>
        <Window id="projects"><ProjectsHub /></Window>
        <Window id="system-monitor"><SystemMonitor /></Window>
        <Window id="timeline"><Timeline /></Window>
        <Window id="ai-assistant"><AIAssistant /></Window>

        <Window id="contact"><Contact /></Window>
        <Window id="resume"><ResumeViewer /></Window>
        <Window id="resume-game"><ResumeGame /></Window>
        <Window id="settings"><SettingsApp /></Window>
        <Window id="vision-control"><VisionControl /></Window>
        <Window id="vscode"><VSCode /></Window>
        <Window id="analytics"><RecruiterAnalytics /></Window>
        <Window id="negotiator"><OfferNegotiator /></Window>
        <Window id="github-city"><GithubCity /></Window>
      </div>
    </div>
  )
}