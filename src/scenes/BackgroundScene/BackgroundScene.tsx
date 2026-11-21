import { Canvas } from '@react-three/fiber'
import JourneyRig from './JourneyRig'
import Gates from './Gates'
import Streaks from './Streaks'
import HeroWorld from './environments/HeroWorld'
import IdentityGallery from './environments/IdentityGallery'
import CampusRoad from './environments/CampusRoad'
import TechTunnel from './environments/TechTunnel'
import SecurityGrid from './environments/SecurityGrid'
import ExhibitionHall from './environments/ExhibitionHall'
import TimelineRun from './environments/TimelineRun'
import ConvergenceRing from './environments/ConvergenceRing'

/** Eight environments along one 3D path. The camera travels it, driven by page scroll. */
export default function BackgroundScene({ compact }: { compact: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0.3, 10], fov: 45, near: 0.1, far: 90 }}
      dpr={compact ? 1 : [1, 1.5]}
      gl={{ antialias: !compact, alpha: true, powerPreference: 'low-power' }}
      aria-hidden
    >
      <JourneyRig compact={compact} />
      <HeroWorld compact={compact} />
      <IdentityGallery compact={compact} />
      <CampusRoad compact={compact} />
      <TechTunnel compact={compact} />
      <SecurityGrid compact={compact} />
      <ExhibitionHall compact={compact} />
      <TimelineRun compact={compact} />
      <ConvergenceRing compact={compact} />
      <Gates compact={compact} />
      <Streaks count={compact ? 24 : 48} />
    </Canvas>
  )
}
