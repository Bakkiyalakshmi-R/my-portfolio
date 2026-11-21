import { milestones } from '../../data/content'
import Icon from '../../components/Icon/Icon'
import SceneEyebrow from '../../components/SceneEyebrow/SceneEyebrow'
import './Certifications.css'

export default function Certifications() {
  return (
    <section id="milestones" className="scene certs" aria-labelledby="certs-title" data-scene>
      <div className="container scene-inner tone-plum">
        <SceneEyebrow tone="plum" label="Scene 07 — Paper-Like Timeline" />
        <h2 id="certs-title" className="scene-heading" data-enter>
          Every Skill Has <em>a Story.</em>
        </h2>

        <ol className="timeline">
          <span className="timeline__line" aria-hidden="true" />
          {milestones.map((m) => (
            <li key={m.title} className={`milestone tone-${m.tone}`} data-milestone>
              <span className="milestone__dot" aria-hidden="true">
                <i />
              </span>
              <article className="milestone__card">
                <div className="milestone__top">
                  <span className="milestone__meta">
                    <span className="milestone__badge">
                      <Icon name={m.icon} size={13} />
                      {m.badge}
                    </span>
                    <span className="mono milestone__ctx">{m.context}</span>
                  </span>
                  <span className="mono milestone__aside">{m.aside}</span>
                </div>
                <h3>{m.title}</h3>
                <p>{m.body}</p>
                <footer>
                  <Icon name={m.footIcon} size={15} />
                  <span>{m.foot}</span>
                </footer>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
