import { profile, resume } from '../../data/content'
import Icon from '../../components/Icon/Icon'
import SceneEyebrow from '../../components/SceneEyebrow/SceneEyebrow'
import ContactForm from '../../components/ContactForm/ContactForm'
import './Contact.css'

const channels = [
  {
    key: 'linkedin',
    tone: 'terracotta',
    icon: 'link',
    label: 'Professional Network',
    value: profile.linkedinLabel,
    href: profile.linkedin,
    external: true,
  },
  {
    key: 'github',
    tone: 'forest',
    icon: 'code',
    label: 'Code Repository',
    value: profile.githubLabel,
    href: profile.github,
    external: true,
  },
  {
    key: 'phone',
    tone: 'plum',
    icon: 'call',
    label: 'Direct Line',
    value: profile.phoneDisplay,
    href: profile.phoneHref,
    external: false,
  },
] as const

export default function Contact() {
  return (
    <section id="connect" className="scene contact" aria-labelledby="contact-title" data-scene>
      <div className="container scene-inner tone-terracotta">
        <SceneEyebrow label="The Meeting Point" />
        <h2 id="contact-title" className="scene-heading" data-enter>
          Let’s Build Something <em>Meaningful.</em>
        </h2>

        <div className="contact__card" data-enter>
          <div className="contact__grid">
            <div className="contact__left">
              <h3 data-converge="left">Have an idea, an opportunity or a project in mind?</h3>
              <p className="contact__lede" data-converge="left">
                I’m always interested in connecting with people, exploring ideas and learning through new
                experiences.
              </p>

              <div className="contact__langs" data-converge="left">
                <span className="kicker" style={{ ['--tone' as string]: 'var(--forest)' }}>
                  Linguistic Fluency &amp; Mindset
                </span>
                <q>
                  I believe learning doesn’t stop with technology. I enjoy exploring new ideas, participating in
                  activities and discovering creative ways to approach challenges.
                </q>
                <ul aria-label="Languages">
                  <li>• Tamil</li>
                  <li className="is-accent">• English</li>
                </ul>
              </div>

              <div className="contact__buttons" data-converge="left">
                <a className="btn btn--primary" href={`mailto:${profile.email}`}>
                  <Icon name="mail" />
                  <span>
                    Initiate Dialogue{' '}
                    <span className="contact__addr">
                      ({profile.email.split('@')[0]}
                      <wbr />@{profile.email.split('@')[1]})
                    </span>
                  </span>
                </a>
                <a className="btn btn--ghost" href={resume.href} download={resume.downloadName}>
                  <Icon name="description" />
                  Download Resume
                </a>
              </div>
            </div>

            <div className="contact__right" data-converge="right">
              {channels.map((c) => (
                <a
                  key={c.key}
                  className={`channel tone-${c.tone}`}
                  href={c.href}
                  {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  <span className="channel__icon" aria-hidden="true">
                    <Icon name={c.icon} />
                  </span>
                  <span className="channel__text">
                    <span className="mono">{c.label}</span>
                    <span>{c.value}</span>
                  </span>
                </a>
              ))}
              <div className="channel channel--static tone-forest">
                <span className="channel__icon channel__icon--olive" aria-hidden="true">
                  <Icon name="location_on" />
                </span>
                <span className="channel__text">
                  <span className="mono">Geographic Residence</span>
                  <span>{profile.location}</span>
                </span>
              </div>
            </div>
          </div>

          <ContactForm />

          <div className="contact__colophon">
            <span className="mono">© 2026 Bakkiyalakshmi R. All rights reserved.</span>
            <span className="mono contact__sign">
              <i aria-hidden="true" />
              THE ART OF INTELLIGENCE
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
