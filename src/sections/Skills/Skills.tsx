import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { skillGroups, skillViews, type SkillView } from '../../data/content'
import SceneEyebrow from '../../components/SceneEyebrow/SceneEyebrow'
import './Skills.css'

const KEYWORDS: Record<SkillView['language'], string[]> = {
  python: ['import', 'from', 'as', 'print'],
  java: ['public', 'class', 'static', 'void', 'int', 'for', 'new'],
  cpp: ['include', 'using', 'namespace', 'int', 'for', 'return'],
  sql: ['SELECT', 'FROM', 'WHERE', 'GROUP', 'BY', 'ORDER', 'COUNT', 'AS', 'DESC'],
  web: ['const', 'let', 'new'],
  git: ['git'],
}

function renderCode(view: SkillView) {
  const words = new RegExp(`\\b(${KEYWORDS[view.language].join('|')})\\b`, 'g')
  return view.code.split('\n').map((line, i) => {
    const isComment = /^\s*(#|\/\/|--)/.test(line)
    if (isComment) {
      return (
        <span key={i} className="code__comment">
          {line}
          {'\n'}
        </span>
      )
    }
    const parts = line.split(words)
    return (
      <span key={i}>
        {parts.map((part, j) => (j % 2 === 1 ? <b key={j}>{part}</b> : part))}
        {'\n'}
      </span>
    )
  })
}

export default function Skills() {
  const [selected, setSelected] = useState(0)
  const view = skillViews[selected]
  const code = useMemo(() => renderCode(view), [view])

  return (
    <section id="technology" className="scene skills" aria-labelledby="skills-title" data-scene>
      <div className="container scene-inner tone-forest">
        <SceneEyebrow tone="forest" label="The Technology Studio" />
        <h2 id="skills-title" className="scene-heading" data-enter>
          My Technical <em>Toolbox.</em>
        </h2>

        <div className="skills__grid">
          <div className="skills__groups" data-stagger>
            {skillGroups.map((group) => (
              <div key={group.id} className={`skills__group tone-${group.tone}`}>
                <h3 className="kicker">{group.title}</h3>
                <div className="skills__chips" role="group" aria-label={group.title}>
                  {skillViews.map((skill, index) =>
                    skill.group === group.id ? (
                      <button
                        key={skill.label}
                        type="button"
                        className={`chip${index === selected ? ' is-selected' : ''}`}
                        aria-pressed={index === selected}
                        onClick={() => setSelected(index)}
                      >
                        {skill.label}
                      </button>
                    ) : null,
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="skills__showcase plate" data-enter>
            <header>
              <div>
                <span className="kicker">Code Example	</span>
                <AnimatePresence mode="wait">
                  <motion.h3
                    key={view.title}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                  >
                    {view.title}
                  </motion.h3>
                </AnimatePresence>
              </div>
            </header>

            <div className="skills__code-wrap" aria-live="polite">
              <pre className="skills__code" tabIndex={0} aria-label={`${view.label} code sample`}>
                <code>{code}</code>
              </pre>
              <p className="skills__caption">{view.note}</p>
            </div>

            <footer>
              <span className="mono">{view.footer}</span>
            </footer>
          </div>
        </div>
      </div>
    </section>
  )
}
