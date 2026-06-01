import { SKILL_MODULES } from '@/data/skills'
import { PROJECTS } from '@/data/projects'
import { COMMAND_REGISTRY, APP_ALIASES } from '@/data/commands'
import type { AppId } from '@/lib/constants'
import { useOSStore } from '@/stores/os.store'

export interface TerminalLine {
  id:      number
  type:    'output' | 'error' | 'success' | 'input' | 'system' | 'cyan' | 'dim'
  content: string
  html?:   boolean
}

let lineId = 0
export const nextId = () => ++lineId

export function getWelcomeLines(): TerminalLine[] {
  return [
    { id: nextId(), type: 'system', content: '╭──────────────────────────────────────────────╮' },
    { id: nextId(), type: 'system', content: '│  SayanOS Terminal  v1.0.0                    │' },
    { id: nextId(), type: 'system', content: '│  SayanOS v1.0.0 · Personal Engineering OS    │' },
    { id: nextId(), type: 'system', content: '│  Type \'help\' to see available commands       │' },
    { id: nextId(), type: 'system', content: '╰──────────────────────────────────────────────╯' },
    { id: nextId(), type: 'dim',    content: '' },
  ]
}

export function processCommand(
  raw:     string,
  openApp: (id: AppId) => void,
  showToast: (msg: string) => void,
): TerminalLine[] {
  const trimmed = raw.trim()
  const parts   = trimmed.split(/\s+/)
  const cmd     = parts[0]?.toLowerCase() ?? ''
  const arg     = parts.slice(1).join(' ').toLowerCase() ?? ''
  const lines:  TerminalLine[] = []

  const out = (content: string, type: TerminalLine['type'] = 'output') =>
    lines.push({ id: nextId(), type, content })

  switch (cmd) {
    /* ── HELP ── */
    case 'help': {
      out('')
    out('neofetch         System info, SayanOS style')
      out('ls               List all apps and files')
      out('matrix           Enter the Matrix (type to exit)')
      out('ping sayan       Check if Sayan is online')
      out('cat resume       Print resume to terminal')
      out('uname            System info')
      out('date             Current date and time')
      out('top              Open System Monitor')
      out('')
      out('COMMAND          DESCRIPTION', 'cyan')
      out('────────────────────────────────────────────────────', 'dim')
      COMMAND_REGISTRY.forEach(c => {
        const pad = (c.usage ?? c.name).padEnd(16, ' ')
        out(`${pad} ${c.description}`)
      })
      out('')
      out('TIP: Try \'sudo hire sayan\' for something special.', 'dim')
      out('')
      break
    }

    /* ── WHOAMI ── */
    case 'whoami': {
      out('')
      out('╔═══════════════════════════════════════════════════╗', 'cyan')
      out('║  SAYAN PATRA                                      ║', 'cyan')
      out('║  Full-Stack Engineer · AI Systems Developer       ║', 'cyan')
      out('║  Founder @ Messmate · Builder @ Curalink          ║', 'cyan')
      out('║  MAKAUT B.Tech CSE · Kolkata, India               ║', 'cyan')
      out('║  sayanpatra017@gmail.com · github.com/sayan049    ║', 'cyan')
      out('║  Status: AVAILABLE FOR OPPORTUNITIES              ║', 'cyan')
      out('╚═══════════════════════════════════════════════════╝', 'cyan')
      out('')
      break
    }

    /* ── ABOUT ── */
    case 'about': {
      out('')
      out('ABOUT SAYAN PATRA', 'cyan')
      out('─────────────────', 'dim')
      out('PROGRAMMER: A TOOL FOR CONVERTING CAFFEINE INTO CODE.')
      out('Full-stack engineer building scalable systems and immersive experiences.')
      out('Specializes in realtime architectures, AI integrations, and cinematic UI.')
      out('B.Tech CSE @ MAKAUT, Haringhata, Nadia (CGPA: 7.63).')
      out('')
      out('STACK', 'cyan')
      out('Frontend  → React, Next.js, TypeScript, Tailwind CSS, HTML5, CSS3')
      out('Backend   → Node.js, Express.js, Socket.io')
      out('Database  → MongoDB, Redis, MySQL')
      out('AI/ML     → PyTorch, TensorFlow, BERT, CNN, LSTM, Whisper, OpenCV, RAG, LLaMA 3.1 8B, Groq, TF-IDF, Ollama')
      out('DevOps    → AWS, Docker, Vercel, Render, CI/CD, GitHub Actions')
      out('')
      break
    }

    /* ── SKILLS ── */
    case 'skills': {
      if (arg) {
        const skillModule = SKILL_MODULES.find(m =>
          m.category.toLowerCase() === arg ||
          m.id.toLowerCase() === arg ||
          m.name.toLowerCase().includes(arg)
        )
        if (skillModule) {
          out('')
          out(`● ${skillModule.name}  [${skillModule.status}]`, 'cyan')
          out('─────────────────────────────────', 'dim')
          skillModule.skills.forEach(s => out(`  · ${s}`))
          out(`  Efficiency: ${skillModule.efficiency}%`, 'dim')
          out('')
        } else {
          out(`Module '${arg}' not found.`, 'error')
          out('Available: frontend | backend | ai | database | realtime | devops | uiux', 'dim')
        }
      } else {
        out('')
        out('SKILL MODULES', 'cyan')
        out('─────────────────────────────────────────────────', 'dim')
        SKILL_MODULES.forEach(m => {
          const statusColor = m.status === 'ACTIVE' ? '●' : m.status === 'LEARNING' ? '◐' : '○'
          const dots = '█'.repeat(Math.floor(m.efficiency / 10)) + '░'.repeat(10 - Math.floor(m.efficiency / 10))
          out(`${statusColor} ${m.name.padEnd(22)} ${dots}  ${m.efficiency}%`)
        })
        out('')
        out('Type \'skills [category]\' for details.', 'dim')
        out('Example: skills frontend', 'dim')
        out('')
      }
      break
    }

    /* ── PROJECTS ── */
    case 'projects': {
      out('')
      out('SYSTEMS', 'cyan')
      out('────────────────────────────────────────', 'dim')
      PROJECTS.forEach(p => {
        const dots = '·'.repeat(Math.max(1, 40 - p.name.length - p.status.length))
        out(`● ${p.name} ${dots} ${p.status}`)
      })
      out('')
      out('Type \'open projects\' to explore in Systems Hub.', 'dim')
      out('')
      break
    }

    /* ── ACHIEVEMENTS ── */
    case 'achievements': {
      out('')
      out('ACHIEVEMENTS', 'cyan')
      out('────────────────────────────────────────', 'dim')
      out('🏆 Certificate of Distinction — Humanity Founders Medical AI Hackathon 2025')
      out('   (Top recognition among 100+ participants)')
      out('🥉 3rd Place — Intra-College Hackathon')
      out('🥈 2nd Place — CSS Battle')
      out('📈 40% improvement in backend response time (Messmate optimization)')
      out('📉 25% improvement in frontend load speed')
      out('📜 IBM Certified — Python 101 for Data Science')
      out('')
      break
    }

    /* ── OPEN ── */
    case 'open': {
      if (!arg) {
        out('Usage: open [app] or open safari [url]', 'error')
        out('Apps: finder · safari · terminal · projects · monitor · timeline · ai · contact · resume', 'dim')
        break
      }
      
      const subparts = arg.split(/\s+/)
      const targetApp = subparts[0]

      if (targetApp === 'safari' && subparts.length > 1) {
        const url = subparts[1]
        out(`↳ Launching Safari navigating to ${url}...`, 'success')
        const store = useOSStore.getState()
        store.setSafariUrl(url)
        store.addSafariTab(url)
        setTimeout(() => openApp('safari'), 300)
        break
      }

      const appId = APP_ALIASES[targetApp] as AppId | undefined
      if (!appId) {
        out(`Unknown app: '${targetApp}'`, 'error')
        out('Apps: finder · safari · terminal · projects · monitor · timeline · ai · contact · resume', 'dim')
        break
      }

      if (targetApp === 'curalink' || targetApp === 'messmate') {
        const store = useOSStore.getState()
        store.setActiveProject(targetApp)
      }

      out(`↳ Launching ${appId.replace('-', ' ').toUpperCase()}...`, 'success')
      setTimeout(() => openApp(appId as AppId), 300)
      break
    }

    /* ── GITHUB ── */
    case 'github': {
      out('↳ Opening GitHub profile in Safari...', 'success')
      const store = useOSStore.getState()
      store.addSafariTab('https://github.com/sayan049')
      setTimeout(() => openApp('safari'), 300)
      break
    }

    /* ── EXPERIENCE / TIMELINE ── */
    case 'experience':
    case 'timeline': {
      out('')
      out('CAREER TIMELINE', 'cyan')
      out('────────────────────────────────────────', 'dim')
      out('2023  FOUNDATIONS         HTML · CSS · JavaScript · React')
      out('  │')
      out('2024  SYSTEMS THINKING    MERN · REST APIs · JWT · MongoDB')
      out('  │')
      out('2024  REALTIME            Socket.io · Messmate (Production)')
      out('  │')
      out('2025  AI INTEGRATION      OpenAI · LangChain · RAG · Streaming')
      out('  │')
      out('2025  IMMERSIVE ENG.      GSAP · Three.js · SayanOS')
      out('  │')
      out('2026  ● NOW — AVAILABLE   Open to high-impact roles', 'cyan')
      out('')
      out('Type \'open timeline\' for the full visual timeline.', 'dim')
      out('')
      break
    }

    /* ── CONTACT ── */
    case 'contact': {
      out('')
      out('CONTACT', 'cyan')
      out('────────────────────────────────────────', 'dim')
      out('Email    → sayanpatra017@gmail.com')
      out('Phone    → +91 7479170108')
      out('GitHub   → github.com/sayan049')
      out('LinkedIn → linkedin.com/in/sayan-patra-426833193/')
      out('')
      out('↳ Opening Contact Hub...', 'success')
      setTimeout(() => openApp('contact'), 400)
      break
    }

    /* ── RESUME ── */
    case 'resume': {
      out('↳ Opening Resume Viewer...', 'success')
      setTimeout(() => openApp('resume'), 300)
      break
    }

    /* ── CLEAR ── */
    case 'clear': {
      return [{ id: nextId(), type: 'system', content: '__CLEAR__' }]
    }

    /* ── EASTER EGGS ── */
    case 'sudo': {
      if (parts[1] === 'hire' && parts[2] === 'sayan') {
        out('')
        out('[sudo] password for recruiter: ████████', 'dim')
        out('')

        setTimeout(() => {}, 0)

        out('Verifying credentials...', 'dim')
        out('', 'dim')
        out('✓ Access granted.', 'success')
        out('✓ Recruiter network: CONNECTED', 'success')
        out('✓ Talent acquisition: INITIATED', 'success')
        out('')
        out('  📡 Transmission to sayanpatra017@gmail.com complete.', 'cyan')
        out('     He will be in touch shortly.', 'cyan')
        out('')
        showToast('🎉 Hire request transmitted successfully!')
        setTimeout(() => openApp('contact'), 1500)
      } else {
        out('sudo: command not found', 'error')
      }
      break
    }

    case 'hack': {
      out('Permission denied.', 'error')
      out('This terminal runs on integrity, not clichés.', 'dim')
      out('Try: skills backend', 'dim')
      break
    }

    case 'exit': {
      out('You can\'t exit SayanOS. You\'re already inside the system.', 'cyan')
      out('The system IS you.', 'dim')
      break
    }

    case '': {
      break
    }

    default: {
      out(`command not found: ${cmd}`, 'error')
      out('Type \'help\' to see available commands.', 'dim')
      break
    }
  }

  return lines
}