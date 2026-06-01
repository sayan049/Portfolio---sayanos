export interface HistoryEntry {
  command: string
  timestamp: Date
}

export class TerminalHistory {
  private history: string[] = []
  private cursor:  number   = -1

  push(cmd: string) {
    if (cmd.trim() && cmd !== this.history[0]) {
      this.history.unshift(cmd)
      if (this.history.length > 100) this.history.pop()
    }
    this.cursor = -1
  }

  up(): string | null {
    if (this.history.length === 0) return null
    this.cursor = Math.min(this.cursor + 1, this.history.length - 1)
    return this.history[this.cursor] ?? null
  }

  down(): string | null {
    this.cursor = Math.max(this.cursor - 1, -1)
    return this.cursor === -1 ? '' : (this.history[this.cursor] ?? null)
  }

  reset() {
    this.cursor = -1
  }
}

export function getAutoComplete(input: string): string[] {
  const COMMANDS = [
    'help', 'whoami', 'about', 'skills', 'projects',
    'open', 'experience', 'timeline', 'contact', 'resume', 'clear',
    'neofetch', 'matrix', 'ls', 'ls -la', 'pwd', 'date', 'uname', 'uname -a',
    'top', 'htop', 'cat resume', 'ping sayan', 'github',
    'sudo hire sayan',
  ]
  const OPEN_ARGS = [
    'terminal', 'projects', 'monitor', 'timeline', 'ai', 'contact', 'resume',
  ]

  const lower = input.toLowerCase().trim()

  if (lower.startsWith('open ')) {
    const partial = lower.slice(5)
    return OPEN_ARGS
      .filter(a => a.startsWith(partial))
      .map(a => `open ${a}`)
  }

  if (lower.startsWith('skills ')) {
    const cats = ['frontend', 'backend', 'ai', 'database', 'realtime', 'devops', 'uiux']
    const partial = lower.slice(7)
    return cats
      .filter(c => c.startsWith(partial))
      .map(c => `skills ${c}`)
  }

  return COMMANDS.filter(c => c.startsWith(lower) && c !== lower)
}