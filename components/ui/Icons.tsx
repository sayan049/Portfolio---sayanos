/* eslint-disable @next/next/no-img-element */
import type { AppId } from '@/lib/constants'

// Use icons8 fluency style — matches macOS Big Sur / Sonoma aesthetic perfectly
const I8 = (slug: string) => `https://img.icons8.com/fluency/512/${slug}.png`

export const APP_ICONS: Record<AppId, React.ReactNode> = {
  finder: (
    <img
      src="https://img.icons8.com/color/512/mac-logo.png"
      alt="Finder"
      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
    />
  ),
  safari: (
    <img
      src="https://img.icons8.com/color/512/safari--v1.png"
      alt="Safari"
      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
    />
  ),
  terminal: (
    <img
      src="https://img.icons8.com/?size=512&id=WbRVMGxHh74X&format=png"
      alt="Terminal"
      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
    />
  ),
  projects: (
    <img
      src="https://img.icons8.com/?size=512&id=oiCA327R8ADq&format=png"
      alt="Projects"
      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
    />
  ),
  'system-monitor': (
    <img
      src="https://img.icons8.com/color/512/heart-monitor.png"
      alt="System Monitor"
      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
    />
  ),
  timeline: (
    <img
      src={I8('timeline')}
      alt="Timeline"
      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
    />
  ),
  'ai-assistant': (
    <img
      src="https://img.icons8.com/?size=512&id=eX8jitZ012aV&format=png"
      alt="AI Assistant"
      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
    />
  ),
  contact: (
    <img
      src="https://img.icons8.com/fluency/512/contacts.png"
      alt="Contact"
      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
    />
  ),
  resume: (
    <img
      src={I8('resume')}
      alt="Resume"
      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
    />
  ),
  settings: (
    <img
      src="https://img.icons8.com/color/512/settings.png"
      alt="Settings"
      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
    />
  ),
  'vscode': (
    <img
      src={I8('visual-studio-code-2019')}
      alt="VS Code"
      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
    />
  ),
  'resume-game': (
    <img
      src={I8('controller')}
      alt="Resume Game"
      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
    />
  ),
  'vision-control': (
    <img
      src={I8('visible--v1')}
      alt="Vision Control"
      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
    />
  ),
  'analytics': (
    <img
      src={I8('combo-chart')}
      alt="Analytics"
      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
    />
  ),
  'negotiator': (
    <img
      src={I8('stack-of-money')}
      alt="Negotiator"
      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
    />
  ),
  'github-city': (
    <img
      src={I8('city')}
      alt="GitHub City"
      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
    />
  ),
}
