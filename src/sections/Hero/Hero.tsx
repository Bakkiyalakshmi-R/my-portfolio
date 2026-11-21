import { profile, resume } from '../../data/content'
import { scrollToId } from '../../utils/scroll'
import Icon from '../../components/Icon/Icon'
import './Hero.css'

export default function Hero() {
  return (
    <section id="world" className="scene hero" aria-labelledby="hero-title" data-scene>
      <div className="container scene-inner">
        <div className="eyebrow tone-terracotta" data-enter>
          <span className="eyebrow__label">Exhibition No. 01 — Spatial Prelude</span>
          <span className="eyebrow__rule" aria-hidden="true" />
          <span className="eyebrow__note">Curatorial Edition 2026</span>
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

          <aside className="hero__callout" data-parallax aria-label="Scene note">
            <div className="hero__callout-glow" aria-hidden="true" />
            <div className="hero__callout-head">
              <span className="kicker tone-terracotta">Sculptural Installation</span>
              <span className="mono">Canvas 01</span>
            </div>
            <blockquote>
              “Translucent geometry, kinetic terracotta toroids and chartreuse light vectors suspended in
              continuous computational balance.”
            </blockquote>
          </aside>
        </div>
      </div>
    </section>
  )
}
