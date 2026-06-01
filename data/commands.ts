export interface CommandDef {
  name:        string
  description: string
  usage?:      string
}

export const COMMAND_REGISTRY: CommandDef[] = [
  { name: 'whoami',     description: 'About Sayan'                                     },
  { name: 'about',      description: 'Full profile and philosophy'                      },
  { name: 'skills',     description: 'All skill modules',    usage: 'skills [category]' },
  { name: 'projects',   description: 'List all projects'                                },
  { name: 'open',       description: 'Open an application',  usage: 'open [app]'        },
  { name: 'experience', description: 'Career timeline'                                  },
  { name: 'timeline',   description: 'Alias for experience'                             },
  { name: 'contact',    description: 'Contact information'                              },
  { name: 'achievements',description: 'List all achievements'                                 },
  { name: 'github',     description: 'Open Sayan\'s GitHub profile'                           },
  { name: 'resume',     description: 'Open resume viewer'                               },
  { name: 'clear',      description: 'Clear terminal'                                   },
  { name: 'help',       description: 'Show this menu'                                   },
]

export const SKILL_CATEGORIES = [
  'frontend', 'backend', 'ai', 'database', 'realtime', 'devops',
] as const

export type SkillCategory = typeof SKILL_CATEGORIES[number]

export const APP_ALIASES: Record<string, string> = {
  terminal:   'terminal',
  term:       'terminal',
  projects:   'projects',
  project:    'projects',
  hub:        'projects',
  monitor:    'system-monitor',
  sys:        'system-monitor',
  timeline:   'timeline',
  time:       'timeline',
  experience: 'timeline',
  ai:         'ai-assistant',
  assistant:  'ai-assistant',
  chat:       'ai-assistant',
  contact:    'contact',
  resume:     'resume',
  cv:         'resume',
  messmate:   'projects',
  curalink:   'projects',
  safari:     'safari',
  browser:    'safari',
  finder:     'finder',
  files:      'finder',
}