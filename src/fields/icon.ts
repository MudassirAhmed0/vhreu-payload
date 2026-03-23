import type { Field } from 'payload'

/**
 * Curated icon options relevant to vehicle history / VIN check product.
 * Grouped by category for easy browsing in the admin dropdown.
 */
const ICON_OPTIONS = [
  // Vehicle & Transport
  { label: '🚗 Car', value: 'car' },
  { label: '🚙 Car Front', value: 'car-front' },
  { label: '🏍️ Bike', value: 'bike' },
  { label: '🚚 Truck', value: 'truck' },

  // Safety & Security
  { label: '🛡️ Shield Check', value: 'shield-check' },
  { label: '🛡️ Shield', value: 'shield' },
  { label: '🔒 Lock', value: 'lock' },
  { label: '🔓 Lock Open', value: 'lock-open' },
  { label: '⚠️ Triangle Alert', value: 'triangle-alert' },
  { label: '🚨 Siren', value: 'siren' },

  // Documents & Data
  { label: '📄 File Text', value: 'file-text' },
  { label: '📋 Clipboard Check', value: 'clipboard-check' },
  { label: '📑 File Search', value: 'file-search' },
  { label: '✅ Circle Check', value: 'circle-check' },
  { label: '❌ Circle X', value: 'circle-x' },

  // Search & Discovery
  { label: '🔍 Search', value: 'search' },
  { label: '👁️ Eye', value: 'eye' },
  { label: '🔎 Scan', value: 'scan' },

  // Metrics & Data
  { label: '📊 Gauge', value: 'gauge' },
  { label: '📈 Trending Up', value: 'trending-up' },
  { label: '📉 Trending Down', value: 'trending-down' },
  { label: '🗄️ Database', value: 'database' },
  { label: '📊 Bar Chart', value: 'bar-chart-3' },

  // Money & Commerce
  { label: '💰 Wallet', value: 'wallet' },
  { label: '💳 Credit Card', value: 'credit-card' },
  { label: '🏷️ Tag', value: 'tag' },
  { label: '🧾 Receipt', value: 'receipt' },

  // Communication
  { label: '📧 Mail', value: 'mail' },
  { label: '📞 Phone', value: 'phone' },
  { label: '🎧 Headphones', value: 'headphones' },
  { label: '💬 Message Circle', value: 'message-circle' },

  // Actions & UI
  { label: '⚡ Zap', value: 'zap' },
  { label: '🔧 Wrench', value: 'wrench' },
  { label: '🌍 Globe', value: 'globe' },
  { label: '🖱️ Mouse Click', value: 'mouse-pointer-click' },
  { label: '⬇️ Download', value: 'download' },
  { label: '🔗 Link', value: 'link' },
  { label: 'ℹ️ Info', value: 'info' },
  { label: '➡️ Chevron Right', value: 'chevron-right' },
  { label: '⭐ Star', value: 'star' },
  { label: '❤️ Heart', value: 'heart' },
  { label: '🏠 House', value: 'house' },
  { label: '📍 Map Pin', value: 'map-pin' },
  { label: '🕐 Clock', value: 'clock' },
  { label: '📅 Calendar', value: 'calendar' },
  { label: '👤 User', value: 'user' },
  { label: '👥 Users', value: 'users' },
  { label: '🏢 Building', value: 'building' },
  { label: '✏️ Pencil', value: 'pencil' },

  // VIN Specific
  { label: '🔢 Hash', value: 'hash' },
  { label: '📋 List', value: 'list' },
  { label: '🏭 Factory', value: 'factory' },
  { label: '🛞 Circle Dot', value: 'circle-dot' },
]

/**
 * Icon picker field — curated select + custom text fallback.
 */
export function iconField(name = 'icon'): Field {
  return {
    name,
    type: 'group',
    fields: [
      {
        name: 'source',
        type: 'select',
        defaultValue: 'preset',
        options: [
          { label: 'Choose from list', value: 'preset' },
          { label: 'Custom icon name', value: 'custom' },
        ],
        admin: { width: '30%' },
      },
      {
        name: 'preset',
        type: 'select',
        options: ICON_OPTIONS,
        admin: {
          width: '70%',
          condition: (_, { source }) => source !== 'custom',
        },
      },
      {
        name: 'custom',
        type: 'text',
        admin: {
          width: '70%',
          description: 'Any Lucide icon name (e.g. "package-check")',
          condition: (_, { source }) => source === 'custom',
        },
      },
    ],
  }
}

/** Resolve icon field to a single string name */
export function resolveIcon(icon: { source?: string; preset?: string; custom?: string } | null | undefined): string | undefined {
  if (!icon) return undefined
  return icon.source === 'custom' ? icon.custom || undefined : icon.preset || undefined
}
