export type AppId =
  | 'finder'
  | 'safari'
  | 'terminal'
  | 'projects'
  | 'system-monitor'
  | 'timeline'
  | 'ai-assistant'
  | 'contact'
  | 'resume'
  | 'settings'
  | 'vscode'
  | 'resume-game'
  | 'vision-control'
  | 'analytics'
  | 'negotiator'
  | 'github-city'

export const APP_NAMES: Record<AppId, string> = {
  'finder':          'Finder',
  'safari':          'Safari',
  'terminal':        'Terminal',
  'projects':        'Systems Hub',
  'system-monitor':  'System Monitor',
  'timeline':        'Timeline',
  'ai-assistant':    'SAYAN-AI',
  'contact':         'Contact Hub',
  'resume':          'Resume Viewer',
  'settings':        'System Settings',
  'vscode':          'VS Code AI',
  'resume-game':     'Resume Game',
  'vision-control':  'AI Vision Control',
  'analytics':       'Recruiter Analytics',
  'negotiator':      'AI Negotiator',
  'github-city':     'GitHub City',
}

export const DEFAULT_WINDOW_SIZES: Record<AppId, { width: number; height: number }> = {
  'finder':          { width: 800, height: 520 },
  'safari':          { width: 1000, height: 680 },
  'terminal':        { width: 740, height: 500 },
  'projects':        { width: 980, height: 640 },
  'system-monitor':  { width: 880, height: 600 },
  'timeline':        { width: 800, height: 560 },
  'ai-assistant':    { width: 720, height: 540 },
  'contact':         { width: 640, height: 520 },
  'resume':          { width: 840, height: 620 },
  'settings':        { width: 600, height: 480 },
  'vscode':          { width: 900, height: 650 },
  'resume-game':     { width: 800, height: 600 },
  'vision-control':  { width: 640, height: 480 },
  'analytics':       { width: 840, height: 560 },
  'negotiator':      { width: 440, height: 600 },
  'github-city':     { width: 800, height: 600 },
}

export const DOCK_APPS = [
  { id: 'finder'          as AppId, label: 'Finder',         icon: 'folder'    },
  { id: 'safari'          as AppId, label: 'Safari',         icon: 'compass'   },
  { id: 'terminal'        as AppId, label: 'Terminal',       icon: 'terminal'  },
  { id: 'projects'        as AppId, label: 'Systems Hub',    icon: 'grid'      },
  { id: 'system-monitor'  as AppId, label: 'System Monitor', icon: 'activity'  },
  { id: 'timeline'        as AppId, label: 'Timeline',       icon: 'clock'     },
  { id: 'ai-assistant'    as AppId, label: 'SAYAN-AI',       icon: 'sparkles'  },
  { id: 'analytics'       as AppId, label: 'Analytics',      icon: 'activity'  },
  { id: 'negotiator'      as AppId, label: 'Negotiator',     icon: 'dollar-sign' },
  { id: 'contact'         as AppId, label: 'Contact Hub',    icon: 'mail'      },
  { id: 'resume'          as AppId, label: 'Resume',         icon: 'file-text' },
  { id: 'vscode'          as AppId, label: 'VS Code',        icon: 'code'      },
  { id: 'resume-game'     as AppId, label: 'Game',           icon: 'gamepad-2' },
  { id: 'vision-control'  as AppId, label: 'AI Vision',      icon: 'eye'       },
  { id: 'settings'        as AppId, label: 'Settings',       icon: 'settings'  },
] as const

export const MENU_BAR_HEIGHT  = 28
export const DOCK_HEIGHT       = 80
export const WINDOW_MIN_WIDTH  = 400
export const WINDOW_MIN_HEIGHT = 300
export const CASCADE_OFFSET    = 28
export const CASCADE_START     = { x: 120, y: 80 }