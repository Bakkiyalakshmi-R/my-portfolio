import type { ReactNode } from 'react'

type IconProps = { name: string; size?: number; className?: string }

/**
 * Inline SVG icons (24x24, stroke-based, currentColor). Replaces the Material Symbols
 * font so icons never degrade into ligature text (e.g. "south") if a web font fails to load.
 */
const paths: Record<string, ReactNode> = {
  close: <path d="M6 6l12 12M18 6L6 18" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  south: <path d="M12 5v14M6 13l6 6 6-6" />,
  arrow_outward: <path d="M7 17L17 7M8 7h9v9" />,
  expand_less: <path d="M6 15l6-6 6 6" />,
  expand_more: <path d="M6 9l6 6 6-6" />,
  open_in_new: <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />,
  description: <path d="M7 3h7l5 5v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM14 3v5h5M9 13h6M9 17h6" />,
  hourglass_top: <path d="M7 3h10M7 21h10M8 3c0 5 4 5 4 9s-4 4-4 9M16 3c0 5-4 5-4 9s4 4 4 9" />,
  send: <path d="M4 12L20 4l-4 16-4-6-8-2zM12 14l8-10" />,
  mail: <path d="M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1zM3 7l9 7 9-7" />,
  call: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A15 15 0 0 1 4 5a1 1 0 0 1 1-1z" />,
  location_on: (
    <>
      <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </>
  ),
  link: <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />,
  code: <path d="M9 7l-5 5 5 5M15 7l5 5-5 5M13.5 5l-3 14" />,
  radar: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 12l6-6" />
    </>
  ),
  shield: <path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6l8-3z" />,
  verified_user: <path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6l8-3zM8.5 12l2.5 2.5 4.5-5" />,
  bug_report: (
    <>
      <path d="M9 8a3 3 0 0 1 6 0v8a3 3 0 0 1-6 0V8zM9 12H4M15 12h5M9 8L6 5M15 8l3-3M9 16l-3 3M15 16l3 3" />
    </>
  ),
  verified: <path d="M12 3l2.4 1.8 3-.2 1 2.8 2.4 1.8-.9 2.9.9 2.9-2.4 1.8-1 2.8-3-.2L12 21l-2.4-1.8-3 .2-1-2.8L3.2 14.8 4.1 12l-.9-2.9L5.6 7.3l1-2.8 3 .2L12 3zM8.5 12l2.5 2.5 4.5-5" />,
  check_circle: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12.5l2.7 2.7L16 9.5" />
    </>
  ),
  psychology: <path d="M9 4a4 4 0 0 0-4 4c0 1 .3 1.8.8 2.5A3.5 3.5 0 0 0 7 17h2v3h6v-4a6 6 0 0 0 0-12H9zM12 8v5M10 11h4" />,
  event: <path d="M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zM4 10h16M8 3v4M16 3v4" />,
  school: <path d="M12 4L2 9l10 5 8-4v6M6 11.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5" />,
  military_tech: (
    <>
      <circle cx="12" cy="14" r="5" />
      <path d="M9 3h6l-1.5 6M9 3l1.5 6M12 11.5v5M10 14h4" />
    </>
  ),
  design_services: <path d="M4 20l1-4L16 5l3 3L8 19l-4 1zM14 7l3 3" />,
}

/** Decorative icon. Falls back to a small dot for unknown names rather than rendering text. */
export default function Icon({ name, size, className }: IconProps) {
  const px = size ?? 18
  return (
    <svg
      className={`icon ${className ?? ''}`.trim()}
      width={px}
      height={px}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {paths[name] ?? <circle cx="12" cy="12" r="2" />}
    </svg>
  )
}
