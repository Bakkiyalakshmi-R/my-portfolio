import Icon from '../../components/Icon/Icon'
import SceneEyebrow from '../../components/SceneEyebrow/SceneEyebrow'
import './About.css'

export default function About() {
  return (
    <section id="identity" className="scene about" aria-labelledby="about-title" data-scene>
      <div className="container scene-inner tone-plum">
        <SceneEyebrow tone="plum" label="Scene 02 — Sculptural Gallery" />
        <h2 id="about-title" className="scene-heading" data-enter>
          A Little About <em>My Journey.</em>
        </h2>

        <div className="about__grid">
          <article className="about__plate" data-enter>
            <span className="about__badge">Curated Biography</span>
            <div className="about__text">
              <p>
                I’m a third-year Computer Science student with a strong interest in Artificial Intelligence,
                Data Science and Machine Learning.
              </p>
              <p>
                I enjoy exploring how technology can transform raw information into meaningful insights and
                intelligent solutions.
              </p>
              <p>
                My learning journey involves programming, experimenting with machine learning concepts,
                building practical applications and continuously exploring emerging technologies.
              </p>
              <blockquote>
                “I’m currently working towards becoming an AI and Data Science professional, with a curiosity
                to learn, experiment and create.”
              </blockquote>
            </div>
            <div className="about__label">
              <span className="mono">IDENTITY VECTOR // MEDIUM: DATA &amp; CODE</span>
              <span className="mono about__room">ROOM 02</span>
            </div>
          </article>

          <div className="about__pedestals" data-stagger>
            <article className="pedestal">
              <span className="kicker" style={{ ['--tone' as string]: 'var(--plum)' }}>
                Degree // Specialization
              </span>
              <h3>B.Sc. Computer Science</h3>
              <p>Currently in Third Year at SSKV College of Arts and Science for Women.</p>
              <footer className="pedestal__foot tone-plum">
                <i aria-hidden="true" />
                Third Year Student
              </footer>
            </article>

            <article className="pedestal pedestal--merit">
              <span className="kicker" style={{ ['--tone' as string]: 'var(--plum)' }}>
                Academic Merit
              </span>
              <strong className="pedestal__figure">83.06 %</strong>
              <p>Overall percentage in B.Sc. Computer Science.</p>
              <footer className="pedestal__foot tone-plum">
                <Icon name="verified" size={13} />
                Academic Record
              </footer>
            </article>

            <article className="pedestal">
              <span className="kicker">Foundational Runtime</span>
              <h3>Python Programming</h3>
              <p>NPTEL Silver Badge (75%). Udemy Python for Machine Learning and Data Science bootcamp in progress.</p>
              <footer className="pedestal__foot tone-terracotta">
                <Icon name="check_circle" size={13} />
                NPTEL Certified
              </footer>
            </article>

            <article className="pedestal">
              <span className="kicker">Core Research Focus</span>
              <h3>AI &amp; Data Science</h3>
              <p>Pattern recognition, machine learning pipelines, predictive energy models.</p>
              <footer className="pedestal__foot tone-forest">
                <Icon name="psychology" size={13} />
                Predictive Synthesis
              </footer>
            </article>
          </div>
        </div>
      </div>
    </section>
  )
}
