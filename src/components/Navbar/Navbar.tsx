import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { resume, scenes } from '../../data/content'
import { sceneStore } from '../../animations/sceneStore'
import { scrollToId } from '../../utils/scroll'
import ScrollProgress from '../ScrollProgress/ScrollProgress'
import Icon from '../Icon/Icon'
import './Navbar.css'

export default function Navbar() {
  const [active, setActive] = useState(0)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const els = scenes
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null)
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = scenes.findIndex((s) => s.id === entry.target.id)
            if (idx >= 0) {
              setActive(idx)
              sceneStore.active = idx
            }
          }
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    setOpen(false)
    scrollToId(id)
  }

  const current = scenes[active]

  return (
    <header className="nav-wrap">
      <nav className="nav" aria-label="Scenes">
        <a href="#world" className="nav__brand" onClick={go('world')} aria-label="Back to start">
          <span className="nav__monogram" aria-hidden="true">
            B
          </span>
          <span className="nav__brand-text">
            <span className="nav__name">Bakkiyalakshmi R.</span>
            <span className="nav__tag">
              The Art of
              <br />
              Intelligence
            </span>
          </span>
        </a>

        <ul className="nav__links">
          {scenes.map((s, i) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                onClick={go(s.id)}
                className={i === active ? 'is-active' : undefined}
                aria-current={i === active ? 'true' : undefined}
              >
                <span>{s.n}</span>
                <span>{s.label}</span>
              </a>
            </li>
          ))}
        </ul>

        <div className="nav__telemetry">
          <div className="nav__scene" aria-live="polite">
            <i aria-hidden="true" />
            <span>
              Scene {current.n}
              <br />
              {'// '}
              {current.label.toUpperCase()}
            </span>
          </div>
          <ScrollProgress />
        </div>

        <button
          type="button"
          className="nav__toggle"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <Icon name={open ? 'close' : 'menu'} size={22} />
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="nav__panel"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22 }}
          >
            <ul>
              {scenes.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} onClick={go(s.id)} className={i === active ? 'is-active' : undefined}>
                    <span className="mono">{s.n}</span> {s.label}
                  </a>
                </li>
              ))}
            </ul>
            <a className="btn btn--ghost" href={resume.href} download={resume.downloadName}>
              <Icon name="description" />
              Download Resume
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
