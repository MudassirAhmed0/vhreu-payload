'use client'

import { useRowLabel } from '@payloadcms/ui'

/**
 * Custom row label for content blocks.
 * Shows the heading/title field value instead of "Untitled".
 */
export default function BlockRowLabel() {
  const { data } = useRowLabel<{
    blockType?: string
    heading?: string
    title?: string
    tag?: string
    content?: { blockType?: string; heading?: string }[]
  }>()

  // Try heading (Section, CtaBanner), then title (PageHero)
  let label = data?.heading || data?.title || ''

  // Strip **marker** syntax for clean admin labels
  label = label.replace(/\*\*/g, '')

  // Truncate long headings
  if (label.length > 60) label = label.slice(0, 57) + '…'

  return <span>{label || 'Untitled'}</span>
}
