'use client'

/* eslint-disable @next/next/no-img-element */
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useOSStore } from '@/stores/os.store'
import type { AppId } from '@/lib/constants'
import { listVariants, listItemVariants } from '@/lib/motion'

const DESKTOP_ITEMS: { id: AppId; label: string; icon: string }[] = [
  { id: 'terminal',      label: 'Terminal',       icon: 'https://img.icons8.com/color/144/console.png' },
  { id: 'projects',      label: 'Projects',        icon: 'https://img.icons8.com/color/144/mac-folder.png' },
  { id: 'ai-assistant',  label: 'AI Assistant',    icon: 'https://img.icons8.com/color/144/siri.png' },
  { id: 'timeline',      label: 'Timeline',        icon: 'https://img.icons8.com/color/144/calendar--v1.png' },
  { id: 'resume',        label: 'Resume',          icon: 'https://img.icons8.com/color/144/resume.png' },
]

export function DesktopIcons() {
  return null
}