'use client'

import { useState, useEffect } from 'react'
import Editor from '@monaco-editor/react'
import { Play, MessageSquare, Loader2, Folder, FileCode2, ChevronRight, ChevronDown } from 'lucide-react'
import { FiGithub } from 'react-icons/fi'
import { PROJECTS } from '@/data/projects'

export function VSCode() {
  const [activeProject, setActiveProject] = useState<typeof PROJECTS[0] | null>(null)
  const [fileTree, setFileTree] = useState<any[]>([])
  const [activeFile, setActiveFile] = useState<{ path: string, content: string } | null>(null)
  const [isLoadingTree, setIsLoadingTree] = useState(false)
  const [isLoadingFile, setIsLoadingFile] = useState(false)

  const [review, setReview] = useState('')
  const [isReviewing, setIsReviewing] = useState(false)
  const [showPanel, setShowPanel] = useState(false)

  // Parse owner/repo from github URL
  const getRepoInfo = (url: string) => {
    const cleanUrl = url.replace('.git', '')
    const parts = cleanUrl.replace('https://github.com/', '').split('/')
    return { owner: parts[0], repo: parts[1] }
  }

  const loadProject = async (project: typeof PROJECTS[0]) => {
    setActiveProject(project)
    setFileTree([])
    setActiveFile(null)
    setReview('')
    
    if (!project.github) return
    setIsLoadingTree(true)
    
    try {
      const { owner, repo } = getRepoInfo(project.github)
      const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents`)
      if (!res.ok) throw new Error('API Rate limit or repo not found')
      const data = await res.json()
      
      // Filter out some noise, keep src, public, package.json, readme etc
      const filtered = Array.isArray(data) ? data.filter(d => 
        !d.name.startsWith('.') && 
        d.name !== 'node_modules'
      ).sort((a, b) => a.type === 'dir' ? -1 : 1) : []
      
      setFileTree(filtered)
    } catch (e) {
      console.warn('GitHub API failed, using fallback mock data', e)
      setFileTree([
        { name: 'src', type: 'dir', path: 'src' },
        { name: 'public', type: 'dir', path: 'public' },
        { name: 'README.md', type: 'file', path: 'README.md' },
        { name: 'package.json', type: 'file', path: 'package.json' },
        { name: 'index.ts', type: 'file', path: 'index.ts' }
      ])
    }
    setIsLoadingTree(false)
  }

  const toggleFolder = async (folder: any) => {
    if (!activeProject || !activeProject.github) return

    if (folder.isOpen) {
      setFileTree(prev => {
        const filtered = prev.filter(f => !f.path.startsWith(folder.path + '/'))
        return filtered.map(f => f.path === folder.path ? { ...f, isOpen: false } : f)
      })
      return
    }

    setIsLoadingTree(true)
    try {
      const { owner, repo } = getRepoInfo(activeProject.github)
      const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${folder.path}`)
      if (!res.ok) throw new Error()
      const data = await res.json()
      
      const children = Array.isArray(data) ? data.map(d => ({ ...d, level: (folder.level || 0) + 1 })) : []
      children.sort((a, b) => a.type === 'dir' ? -1 : 1)
      
      setFileTree(prev => {
        const index = prev.findIndex(f => f.path === folder.path)
        const newTree = [...prev]
        newTree[index] = { ...folder, isOpen: true }
        newTree.splice(index + 1, 0, ...children)
        return newTree
      })
    } catch (e) {
      console.warn('Failed to fetch directory')
    }
    setIsLoadingTree(false)
  }

  const loadFile = async (file: any) => {
    if (file.type === 'dir') {
      return toggleFolder(file)
    }
    if (!activeProject || !activeProject.github) return
    
    setIsLoadingFile(true)
    setActiveFile({ path: file.path, content: 'Loading...' })
    
    try {
      const { owner, repo } = getRepoInfo(activeProject.github)
      // fetch raw
      const res = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/main/${file.path}`)
      if (!res.ok) {
        // try master branch if main fails
        const res2 = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/master/${file.path}`)
        if (!res2.ok) throw new Error('File not found')
        const text = await res2.text()
        setActiveFile({ path: file.path, content: text })
      } else {
        const text = await res.text()
        setActiveFile({ path: file.path, content: text })
      }
    } catch (e) {
      setActiveFile({ 
        path: file.path, 
        content: `// Mock Data Fallback\n// Could not fetch raw file from GitHub (Private repo or Rate Limited)\n\nexport function SayanEngine() {\n  console.log("Welcome to ${activeProject.name}!");\n}\n` 
      })
    }
    setIsLoadingFile(false)
  }

  const handleReview = async () => {
    if (!activeFile) return
    setShowPanel(true)
    setIsReviewing(true)
    setReview('')
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: 'You are an expert Senior Full-Stack Engineer performing a code review. Keep it extremely concise. Point out bugs, suggest improvements, explain the logic, and compliment good patterns.' },
            { role: 'user', content: `Please review this file (${activeFile.path}):\n\n${activeFile.content}` }
          ]
        })
      })

      if (!response.ok) throw new Error('API failed')
      
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      
      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value, { stream: true })
          const lines = chunk.split('\n')
          for (const line of lines) {
            const trimmed = line.trim()
            if (trimmed.startsWith('data: ')) {
              const data = trimmed.slice(6)
              if (data === '[DONE]') continue
              try {
                const parsed = JSON.parse(data)
                const token = parsed.choices?.[0]?.delta?.content ?? parsed.content ?? ''
                setReview(prev => prev + token)
              } catch (e) {}
            }
          }
        }
      }
    } catch (e) {
      setReview('Failed to connect to AI Reviewer. Ensure Groq API key is set in .env.local.')
    }
    setIsReviewing(false)
  }

  // Get language for Monaco based on extension
  const getLanguage = (filename: string) => {
    if (filename.endsWith('.ts') || filename.endsWith('.tsx')) return 'typescript'
    if (filename.endsWith('.js') || filename.endsWith('.jsx')) return 'javascript'
    if (filename.endsWith('.json')) return 'json'
    if (filename.endsWith('.css')) return 'css'
    if (filename.endsWith('.html')) return 'html'
    if (filename.endsWith('.md')) return 'markdown'
    return 'plaintext'
  }

  return (
    <div className="flex h-full w-full bg-[#1e1e1e] text-white font-mono text-sm">
      {/* Activity Bar */}
      <div className="w-12 bg-[#333333] flex flex-col items-center py-4 gap-6 border-r border-white/10 shrink-0">
        <div className="w-8 h-8 rounded flex items-center justify-center bg-white/10 text-white cursor-pointer hover:bg-white/20 transition-colors">
          <FilesIcon />
        </div>
        <div 
          className="w-8 h-8 rounded flex items-center justify-center text-white/50 cursor-pointer hover:text-white transition-colors" 
          onClick={() => setShowPanel(!showPanel)}
          title="AI Assistant"
        >
          <MessageSquare size={20} />
        </div>
      </div>
      
      {/* Sidebar Explorer */}
      <div className="w-64 bg-[#252526] border-r border-white/10 flex flex-col shrink-0">
        <div className="p-3 text-xs font-semibold text-white/60 tracking-wider">PROJECTS</div>
        
        {/* Projects List */}
        <div className="flex flex-col border-b border-white/10 pb-2 mb-2 max-h-48 overflow-y-auto">
          {PROJECTS.map(p => (
            <div 
              key={p.id}
              onClick={() => loadProject(p)}
              className={`px-3 py-1.5 flex items-center gap-2 cursor-pointer text-xs ${activeProject?.id === p.id ? 'bg-[#37373d] text-white' : 'text-white/60 hover:text-white'}`}
            >
              <FiGithub size={14} />
              <span className="truncate">{p.name}</span>
            </div>
          ))}
        </div>

        {/* Selected Project Files */}
        <div className="p-3 text-xs font-semibold text-white/60 tracking-wider uppercase truncate">
          {activeProject ? activeProject.name : 'NO PROJECT SELECTED'}
        </div>
        <div className="flex-1 overflow-y-auto pb-4">
          {isLoadingTree && <div className="px-4 py-2 text-xs text-white/40 flex items-center gap-2"><Loader2 size={12} className="animate-spin" /> Fetching GitHub...</div>}
          
          {!isLoadingTree && fileTree.map(file => (
            <div 
              key={file.path}
              onClick={() => loadFile(file)}
              className={`py-1 flex items-center gap-2 cursor-pointer text-xs ${activeFile?.path === file.path ? 'bg-[#37373d] text-[#4FC3F7]' : 'text-white/70 hover:text-white hover:bg-white/5'}`}
              style={{ opacity: file.type === 'dir' ? 0.8 : 1, paddingLeft: `${(file.level || 0) * 16 + 16}px`, paddingRight: '16px' }}
            >
              <div className="w-4 flex justify-center shrink-0">
                {file.type === 'dir' ? (
                  file.isOpen ? <ChevronDown size={14} className="text-white/40" /> : <ChevronRight size={14} className="text-white/40" />
                ) : (
                  <FileCode2 size={14} className="text-[#4FC3F7]/70" />
                )}
              </div>
              <span className="truncate">{file.name}</span>
            </div>
          ))}
          {!activeProject && (
            <div className="px-4 py-4 text-xs text-white/40 text-center">
              Select a project from the list above to load its code from GitHub.
            </div>
          )}
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Tabs */}
        <div className="flex bg-[#2d2d2d] border-b border-white/10 overflow-x-auto no-scrollbar">
          {activeFile ? (
            <div className="px-4 py-2 bg-[#1e1e1e] border-t-2 border-[#007acc] text-white flex items-center gap-2 text-xs shrink-0">
              <FileCode2 size={14} className="text-[#4FC3F7]" />
              {activeFile.path.split('/').pop()}
            </div>
          ) : (
            <div className="px-4 py-2 text-white/40 text-xs italic">No file open</div>
          )}
          <div className="flex-1" />
          
          {/* Action buttons */}
          <div className="px-4 py-1.5 flex items-center gap-3 shrink-0">
            <button 
              onClick={handleReview}
              disabled={isReviewing || !activeFile || isLoadingFile}
              className="flex items-center gap-2 px-3 py-1 bg-[#007acc] hover:bg-[#005c99] disabled:opacity-50 disabled:cursor-not-allowed rounded text-white text-xs transition-colors"
            >
              {isReviewing ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} />}
              AI Review Code
            </button>
          </div>
        </div>
        
        {/* Monaco Canvas */}
        <div className="flex-1 relative bg-[#1e1e1e]">
          {isLoadingFile && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#1e1e1e]/80 backdrop-blur-sm">
              <Loader2 className="animate-spin text-[#007acc]" size={32} />
            </div>
          )}
          
          {activeFile ? (
            <Editor
              height="100%"
              language={getLanguage(activeFile.path)}
              theme="vs-dark"
              value={activeFile.content}
              options={{
                readOnly: true,
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: 'JetBrains Mono, monospace',
                padding: { top: 16 }
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-white/20">
              <div className="text-center">
                <FiGithub size={48} className="mx-auto mb-4 opacity-50" />
                <p>Select a file from the explorer to view code.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Panel */}
      {showPanel && (
        <div className="w-96 bg-[#252526] border-l border-white/10 flex flex-col shadow-[-8px_0_16px_rgba(0,0,0,0.2)] shrink-0">
          <div className="p-3 border-b border-white/10 flex items-center justify-between">
            <span className="text-xs font-semibold text-white/60 tracking-wider">AI PAIR PROGRAMMER</span>
            <button onClick={() => setShowPanel(false)} className="text-white/40 hover:text-white">✕</button>
          </div>
          <div className="flex-1 overflow-auto p-4 space-y-4">
            {!review && !isReviewing ? (
              <div className="text-white/40 text-sm text-center mt-10">
                Click 'AI Review Code' to have Groq analyze the currently open GitHub file.
              </div>
            ) : null}
            {review && (
              <div className="text-sm text-white/90 whitespace-pre-wrap leading-relaxed">
                {review}
              </div>
            )}
            {isReviewing && (
              <div className="flex items-center gap-2 text-[#007acc] text-sm">
                <Loader2 size={14} className="animate-spin" /> Analyzing architecture...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function FilesIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 19.5v-15A2.5 2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 2.5 0 0 1 0-5H20"/>
    </svg>
  )
}
