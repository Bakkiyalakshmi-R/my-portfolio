import { profile, resume } from '../../data/content'
import { scrollToId } from '../../utils/scroll'
import Icon from '../../components/Icon/Icon'
import './Hero.css'

export default function Hero() {
  return (
    <section id="world" className="scene hero" aria-labelledby="hero-title" data-scene>
      <div className="container scene-inner">
        <div className="eyebrow tone-terracotta" data-enter>
          <span className="eyebrow__label">The Entrance</span>
        </div>

        <div className="hero__grid">
          <div className="hero__copy">
            <p className="hero__hello" data-enter>
              Hello, I’m <span>{profile.name}</span>
            </p>
            <h1 id="hero-title" className="hero__title" data-enter>
              <span>Turning Data Into</span>{' '}
              <em>Intelligence.</em>
            </h1>
            <p className="hero__role" data-enter>
              Computer Science Student | AI &amp; Data Science Enthusiast.
            </p>
            <p className="hero__lede" data-enter>
              Exploring the intersection of data, artificial intelligence and technology to build meaningful
              solutions.
            </p>
            <div className="hero__actions" data-enter>
              <a
                className="btn btn--primary"
                href="#exhibition"
                onClick={(e) => {
                  e.preventDefault()
                  scrollToId('exhibition')
                }}
              >
                Explore My Work
                <Icon name="south" />
              </a>
              <a className="btn btn--ghost" href={resume.href} download={resume.downloadName}>
                <Icon name="description" />
                Download Resume
              </a>
            </div>
          </div>
          <aside className="hero__facts" aria-label="Highlights">
  <span className="kicker tone-terracotta">Highlights</span>
  <dl className="hero__fact-list">
    <div>
      <dt>81.4 %</dt>
      <dd>B.Sc. Computer Science</dd>
    </div>
    <div>
      <dt>2</dt>
      <dd>Projects: WattGuard AI &amp; Student Activity Tracker</dd>
    </div>
    <div>
      <dt>1</dt>
      <dd>Cybersecurity internship at Staunch Technologies</dd>
    </div>
  </dl>
</aside>
        </div>
      </div>
    </section>
  )
}
