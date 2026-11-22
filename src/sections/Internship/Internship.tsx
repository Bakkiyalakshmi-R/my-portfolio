import { internshipTools } from '../../data/content'
import Icon from '../../components/Icon/Icon'
import SceneEyebrow from '../../components/SceneEyebrow/SceneEyebrow'
import './Internship.css'

export default function Internship() {
  return (
    <section id="experience" className="scene internship" aria-labelledby="intern-title" data-scene>
      <div className="container scene-inner tone-terracotta">
        <SceneEyebrow label="The Experience Wing" />
        <h2 id="intern-title" className="scene-heading" data-enter>
          Real-World <em>Experience.</em>
        </h2>

        <div className="intern__stage" data-enter>
          <div className="intern__head">
            <div>
              <span className="intern__pill">
                <span>Industry Internship</span>
                <span aria-hidden="true">•</span>
                <span>May 2026 – June 2026</span>
              </span>
              <h3>Cybersecurity Intern</h3>
              <p className="intern__org">Staunch Technologies Pvt. Ltd.</p>
            </div>
            <dl className="intern__meta">
              <div>
                <dt>DOMAIN:</dt> <dd>Cybersecurity Fundamentals &amp; Vulnerability Assessment</dd>
              </div>
              <div>
                <dt>TOOLS:</dt> <dd>Rapid7 InsightVM, Wazuh, OWASP ZAP, Networking Fundamentals</dd>
              </div>
              <div className="intern__status">
                <dt>STATUS:</dt> <dd>Successfully Completed (One-Month Internship)</dd>
              </div>
            </dl>
          </div>

          <div className="intern__body">
            <p className="intern__lede">
              Successfully completed a one-month cybersecurity internship, gaining practical exposure to
              enterprise security tools and cybersecurity fundamentals.
            </p>
            <ul className="intern__points">
              <li>
                Worked with Rapid7 InsightVM, Wazuh and OWASP ZAP for vulnerability assessment, endpoint
                monitoring and web application security testing.
              </li>
              <li>
                Applied networking principles while strengthening analytical, technical and problem-solving
                skills through practical assignments.
              </li>
              <li>
                Demonstrated professionalism, teamwork, adaptability and a strong willingness to learn while
                working in a professional environment.
              </li>
            </ul>
          </div>

          <div className="intern__tools" data-stagger>
            {internshipTools.map((tool) => (
              <article key={tool.name} className={`tool tone-${tool.tone}`}>
                <div className="tool__top">
                  <span className="kicker">{tool.kicker}</span>
                  <Icon name={tool.icon} />
                </div>
                <h4>{tool.name}</h4>
                <p>{tool.description}</p>
                <footer>
                  <Icon name="verified_user" size={13} />
                  <span className="mono">Used During Internship</span>
                </footer>
              </article>
            ))}
          </div>

          <div className="intern__foot">
            <span className="mono">SCOPE: ENTERPRISE SECURITY TOOLS &amp; FUNDAMENTALS</span>
            <span className="mono">STAUNCH TECHNOLOGIES PVT. LTD.</span>
          </div>
        </div>

        <p className="sr-only">Tools and technologies: Rapid7 InsightVM, Wazuh, OWASP ZAP, Networking Fundamentals.</p>
      </div>
    </section>
  )
}
