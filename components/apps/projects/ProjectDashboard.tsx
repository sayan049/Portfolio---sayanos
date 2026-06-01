'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '@/components/ui/Badge'
import type { Project } from '@/data/projects'
import { PROJECT_DETAILS } from '@/data/projectDetails'
import { ArchitectureViz } from './ArchitectureViz'
import { RealtimeViz } from './RealtimeViz'
import { listVariants, listItemVariants } from '@/lib/motion'

interface ProjectDashboardProps {
  project: Project
}

type Tab = 'Overview' | 'Architecture' | 'Realtime' | 'Challenges' | 'Future'

export function ProjectDashboard({ project }: ProjectDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('Overview')

  const details = PROJECT_DETAILS[project.id]

  const TABS: Tab[] = ['Overview']
  if (details?.architecture?.nodes?.length) TABS.push('Architecture')
  if (details?.realtime?.pipeline?.length) TABS.push('Realtime')
  if (details?.challenges?.length) TABS.push('Challenges')
  if (details?.roadmap?.length) TABS.push('Future')

  // Always make sure active tab is valid if we switch projects
  if (!TABS.includes(activeTab)) {
    setActiveTab('Overview')
  }

  const STATS = [
    { label: 'Status', value: project.status },
    { label: 'Core Tech', value: project.stack.length.toString() },
    { label: 'Key Features', value: project.highlights.length.toString() },
    { label: 'Platform', value: 'Web' },
  ]

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '20px 24px 0', flexShrink: 0 }}>
        {/* Title row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--os-text)' }}>{project.name}</h2>
              <Badge label={project.status} variant={project.status} />
            </div>
            <p style={{ fontSize: 13, color: 'var(--os-text-3)' }}>
              {project.tagline}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  fontSize: 12, color: 'var(--os-text-2)',
                  padding: '6px 12px', borderRadius: 7,
                  border: '1px solid var(--os-border)',
                  textDecoration: 'none',
                  background: 'var(--os-surface-2)',
                  transition: 'all 0.15s',
                }}
              >
                GitHub ↗
              </a>
            )}
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  fontSize: 12, color: 'var(--os-bg)',
                  padding: '6px 12px', borderRadius: 7,
                  background: 'var(--os-cyan)',
                  textDecoration: 'none',
                  fontWeight: 500,
                  transition: 'all 0.15s',
                }}
              >
                Live ↗
              </a>
            )}
          </div>
        </div>

        {/* Tech stack pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
          {project.stack.map(tech => (
            <span
              key={tech}
              style={{
                fontSize: 11, color: 'var(--os-text-3)',
                background: 'var(--os-surface-3)', borderRadius: 5,
                padding: '3px 8px', border: '1px solid var(--os-border)',
              }}
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Stats grid */}
        <div
          style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8,
            marginBottom: 16,
          }}
        >
          {STATS.map(stat => (
            <div
              key={stat.label}
              style={{
                background: 'var(--os-surface-2)', border: '1px solid var(--os-border)',
                borderRadius: 8, padding: '10px 14px', textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--os-text)' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: 10, color: 'var(--os-text-3)', letterSpacing: '0.06em', marginTop: 2 }}
                className="font-mono uppercase"
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--os-border)' }}>
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '8px 16px',
                fontSize: 12, fontWeight: 500,
                color: activeTab === tab ? 'var(--os-cyan)' : 'var(--os-text-3)',
                background: 'transparent', border: 'none', cursor: 'pointer',
                borderBottom: activeTab === tab ? '2px solid var(--os-cyan)' : '2px solid transparent',
                transition: 'all 0.15s',
                marginBottom: -1,
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content — scrollable */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {activeTab === 'Overview' && <OverviewTab project={project} />}
            {activeTab === 'Architecture' && details?.architecture && (
              <ArchitectureTab project={project} nodes={details.architecture.nodes} edges={details.architecture.edges} />
            )}
            {activeTab === 'Realtime' && details?.realtime && (
              <RealtimeTab pipeline={details.realtime.pipeline} events={details.realtime.events} />
            )}
            {activeTab === 'Challenges' && details?.challenges && (
              <ChallengesTab challenges={details.challenges} />
            )}
            {activeTab === 'Future' && details?.roadmap && (
              <FutureTab roadmap={details.roadmap} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ── TAB: Overview ── */
function OverviewTab({ project }: { project: Project }) {
  return (
    <div>
      {/* Problem */}
      {project.problem && (
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--os-cyan)', marginBottom: 8, letterSpacing: '0.04em' }}
            className="font-mono uppercase"
          >
            Problem
          </h3>
          <p style={{ fontSize: 13, color: 'var(--os-text-2)', lineHeight: 1.6 }}>
            {project.problem}
          </p>
        </div>
      )}

      {/* Solution */}
      {project.solution && (
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--os-cyan)', marginBottom: 8, letterSpacing: '0.04em' }}
            className="font-mono uppercase"
          >
            Solution
          </h3>
          <p style={{ fontSize: 13, color: 'var(--os-text-2)', lineHeight: 1.6 }}>
            {project.solution}
          </p>
        </div>
      )}

      {/* Features grid */}
      <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--os-cyan)', marginBottom: 12, letterSpacing: '0.04em' }}
        className="font-mono uppercase"
      >
        Highlights
      </h3>
      <motion.div
        variants={listVariants}
        initial="hidden"
        animate="visible"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}
      >
        {project.highlights.map(h => (
          <motion.div
            key={h}
            variants={listItemVariants}
            style={{
              background: 'var(--os-surface-2)', border: '1px solid var(--os-border)',
              borderRadius: 8, padding: '14px 16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <span style={{ color: 'var(--os-cyan)', fontSize: 16, marginTop: -2, flexShrink: 0 }}>⚡</span>
              <span style={{ fontSize: 13, color: 'var(--os-text)', lineHeight: 1.5 }}>{h}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

/* ── TAB: Architecture ── */
function ArchitectureTab({ project, nodes, edges }: { project: Project, nodes: any[], edges: any[] }) {
  return (
    <div>
      <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--os-cyan)', marginBottom: 16, letterSpacing: '0.04em' }}
        className="font-mono uppercase"
      >
        System Architecture
      </h3>
      {project.architecture && (
        <p style={{ fontSize: 13, color: 'var(--os-text-2)', lineHeight: 1.6, marginBottom: 20 }}>
          {project.architecture}
        </p>
      )}
      <div
        style={{
          background: 'var(--os-surface-2)', border: '1px solid var(--os-border)',
          borderRadius: 10, padding: '24px 20px',
        }}
      >
        <ArchitectureViz nodes={nodes} edges={edges} />
      </div>
    </div>
  )
}

/* ── TAB: Realtime ── */
function RealtimeTab({ pipeline, events }: { pipeline: any[], events: any[] }) {
  return (
    <div>
      <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--os-cyan)', marginBottom: 16, letterSpacing: '0.04em' }}
        className="font-mono uppercase"
      >
        Realtime Infrastructure
      </h3>
      <RealtimeViz pipeline={pipeline} events={events} />
    </div>
  )
}

/* ── TAB: Challenges ── */
function ChallengesTab({ challenges }: { challenges: any[] }) {
  return (
    <div>
      <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--os-cyan)', marginBottom: 16, letterSpacing: '0.04em' }}
        className="font-mono uppercase"
      >
        Engineering Challenges
      </h3>
      <motion.div
        variants={listVariants}
        initial="hidden"
        animate="visible"
        style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
      >
        {challenges.map(c => (
          <motion.div
            key={c.title}
            variants={listItemVariants}
            style={{
              background: 'var(--os-surface-2)', border: '1px solid var(--os-border)',
              borderRadius: 10, padding: '18px 20px',
            }}
          >
            <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--os-text)', marginBottom: 10 }}>
              {c.title}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div>
                <span style={{ fontSize: 10, color: 'var(--os-amber)', letterSpacing: '0.08em', fontWeight: 600 }}
                  className="font-mono uppercase"
                >
                  CHALLENGE
                </span>
                <p style={{ fontSize: 12, color: 'var(--os-text-3)', lineHeight: 1.5, marginTop: 2 }}>
                  {c.challenge}
                </p>
              </div>
              <div>
                <span style={{ fontSize: 10, color: 'var(--os-cyan)', letterSpacing: '0.08em', fontWeight: 600 }}
                  className="font-mono uppercase"
                >
                  APPROACH
                </span>
                <p style={{ fontSize: 12, color: 'var(--os-text-3)', lineHeight: 1.5, marginTop: 2 }}>
                  {c.approach}
                </p>
              </div>
              <div>
                <span style={{ fontSize: 10, color: 'var(--os-green)', letterSpacing: '0.08em', fontWeight: 600 }}
                  className="font-mono uppercase"
                >
                  OUTCOME
                </span>
                <p style={{ fontSize: 12, color: 'var(--os-text-3)', lineHeight: 1.5, marginTop: 2 }}>
                  {c.outcome}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

/* ── TAB: Future ── */
function FutureTab({ roadmap }: { roadmap: any[] }) {
  return (
    <div>
      <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--os-cyan)', marginBottom: 16, letterSpacing: '0.04em' }}
        className="font-mono uppercase"
      >
        Roadmap
      </h3>
      <motion.div
        variants={listVariants}
        initial="hidden"
        animate="visible"
        style={{ display: 'flex', flexDirection: 'column', gap: 0, position: 'relative' }}
      >
        {/* Vertical line */}
        <div
          style={{
            position: 'absolute', left: 20, top: 16, bottom: 16,
            width: 1, background: 'var(--os-border)',
          }}
        />

        {roadmap.map((item, i) => (
          <motion.div
            key={item.version}
            variants={listItemVariants}
            style={{
              display: 'flex', alignItems: 'center', gap: 16,
              paddingLeft: 10, paddingTop: 12, paddingBottom: 12,
            }}
          >
            {/* Dot */}
            <div
              style={{
                width: 20, height: 20, borderRadius: '50%',
                background: i < 2 ? 'var(--os-cyan)' : 'var(--os-surface-3)',
                border: `2px solid ${i < 2 ? 'var(--os-cyan)' : 'var(--os-border)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, zIndex: 1,
              }}
            >
              {i < 2 && (
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--os-bg)' }} />
              )}
            </div>

            {/* Label */}
            <div
              style={{
                flex: 1, display: 'flex', alignItems: 'center', gap: 12,
                background: 'var(--os-surface-2)', border: '1px solid var(--os-border)',
                borderRadius: 8, padding: '10px 14px',
              }}
            >
              <span
                className="font-mono"
                style={{
                  fontSize: 12, fontWeight: 700, flexShrink: 0, width: 36,
                  color: i < 2 ? 'var(--os-cyan)' : 'var(--os-text-3)',
                }}
              >
                {item.version}
              </span>
              <span style={{ fontSize: 13, color: 'var(--os-text-2)' }}>{item.label}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
