import { projects } from '../../data/content'
import ProjectCard from '../../components/ProjectCard/ProjectCard'
import SceneEyebrow from '../../components/SceneEyebrow/SceneEyebrow'
import './Projects.css'

export default function Projects() {
  return (
    <section id="exhibition" className="scene projects" aria-labelledby="projects-title" data-scene>
      <div className="container scene-inner tone-terracotta">
        <SceneEyebrow label="Scene 06 — 3D Exhibition Gallery" />
        <h2 id="projects-title" className="scene-heading" data-enter>
          Turning Ideas Into <em>Applications.</em>
        </h2>
        <div className="projects__grid" data-stagger>
          {projects.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </div>
    </section>
  )
}
