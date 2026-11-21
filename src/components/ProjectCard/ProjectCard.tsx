import { useId, useState } from 'react'
import type { Project } from '../../data/content'
import Icon from '../Icon/Icon'
import './ProjectCard.css'

/** Schematic preview plates. These are labelled visuals, not screenshots. */
function WattGuardPreview() {
  const bars = [
    { h: 40, c: 'rgba(184,71,46,.3)' },
    { h: 64, c: 'rgba(184,71,46,.5)' },
    { h: 80, c: '#b8472e' },
    { h: 48, c: 'rgba(60,75,55,.6)' },
    { h: 56, c: 'rgba(60,75,55,.8)' },
    { h: 64, c: '#76822e' },
    { h: 44, c: 'rgba(184,71,46,.7)' },
  ]
  return (
    <>
      <div className="preview__row">
        <span className="mono">ENERGY USAGE SIGNATURE</span>
        <span className="mono preview__accent">RANDOM FOREST MODEL</span>
      </div>
      <div className="preview__bars" aria-hidden="true">
        {bars.map((b, i) => (
          <span key={i} style={{ height: b.h, background: b.c }} />
        ))}
      </div>
      <span className="mono preview__foot">CLASSES: NORMAL · MODERATELY · HIGHLY INEFFICIENT</span>
    </>
  )
}

function TrackerPreview() {
  return (
    <>
      <div className="preview__row">
        <span className="mono">ACTIVITY MILESTONE LOG</span>
        <span className="mono preview__accent preview__accent--forest">LOCALSTORAGE ENGINE</span>
      </div>
      <div className="preview__list" aria-hidden="true">
        <div>
          <span className="mono">Add · Edit · Delete activities</span>
          <b className="mono">✓ Tracked</b>
        </div>
        <div>
          <span className="mono">Filter &amp; drag-and-drop sort</span>
          <b className="mono preview__accent">● Live</b>
        </div>
      </div>
      <span className="mono preview__foot">PERSISTENCE: LOCALSTORAGE</span>
    </>
  )
}

export default function ProjectCard({ project }: { project: Project }) {
  const [open, setOpen] = useState(false)
  const panelId = useId()

  return (
    <article className={`project tone-${project.tone}`} data-enter>
      <div className="project__top">
        <span className="project__kicker">{project.kicker}</span>
        <Icon name="arrow_outward" />
      </div>

      <h3>{project.title}</h3>
      <p className="project__overview">{project.overview}</p>

      <div className="project__preview">
        {project.screenshot ? (
          <img
            src={`/assets/images/${project.screenshot}`}
            alt={`${project.title} screenshot`}
            loading="lazy"
            decoding="async"
          />
        ) : project.slug === 'wattguard-ai' ? (
          <WattGuardPreview />
        ) : (
          <TrackerPreview />
        )}
      </div>

      <button
        type="button"
        className="project__toggle"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? 'Hide details' : 'View details'}
        <Icon name={open ? 'expand_less' : 'expand_more'} size={16} />
      </button>

      <div id={panelId} className="project__details" hidden={!open}>
        <p>{project.description}</p>
        <h4 className="kicker">Features</h4>
        <ul>
          {project.features.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </div>

      <footer className="project__foot">
        <ul className="project__tech" aria-label="Technologies">
          {project.tech.map((t) => (
            <li key={t} className={t === project.highlightTech ? 'is-hot' : undefined}>
              {t}
            </li>
          ))}
        </ul>
        <div className="project__links">
          <a href={project.repo} target="_blank" rel="noopener noreferrer">
            Inspect Installation
            <Icon name="open_in_new" size={13} />
          </a>
          {project.demo && (
            <a href={project.demo} target="_blank" rel="noopener noreferrer">
              Live Demo
              <Icon name="open_in_new" size={13} />
            </a>
          )}
        </div>
      </footer>
    </article>
  )
}
