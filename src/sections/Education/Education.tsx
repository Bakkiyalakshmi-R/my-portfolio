import Icon from '../../components/Icon/Icon'
import SceneEyebrow from '../../components/SceneEyebrow/SceneEyebrow'
import CampusDiorama from './CampusDiorama'
import './Education.css'

export default function Education() {
  return (
    <section id="knowledge" className="scene education" aria-labelledby="edu-title" data-scene>
      <div className="container scene-inner tone-forest">
        <SceneEyebrow tone="forest" label="Scene 03 — Journey to Knowledge" />
        <h2 id="edu-title" className="scene-heading" data-enter>
          Where My Journey <em>Takes Shape.</em>
        </h2>

        <div className="edu__grid">
          <figure className="edu__diorama" data-enter>
            <div className="edu__canvas">
              <CampusDiorama />
            </div>
          </figure>

          <div className="edu__info" data-stagger>
            <article className="edu__card">
              <span className="kicker">Academic Institution</span>
              <h3>B.Sc. Computer Science</h3>
              <p>SSKV College of Arts and Science for Women</p>
              <footer>
                <Icon name="event" size={13} />
                <span className="mono">Current Status: In Third Year of Study</span>
              </footer>
            </article>

            <article className="edu__card edu__card--score">
              <div>
                <span className="kicker">Consolidated Score</span>
                <strong>81.4 %</strong>
                <p>Overall percentage in B.Sc. Computer Science.</p>
              </div>
              <span className="edu__cap" aria-hidden="true">
                <Icon name="school" size={28} />
              </span>
            </article>
          </div>
        </div>
      </div>
    </section>
  )
}
