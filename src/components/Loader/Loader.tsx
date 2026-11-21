import { motion } from 'framer-motion'

type Props = { onDone: () => void }

/** Short intro overlay. Waits for web fonts (max ~1.6s) so the first paint is not a flash of fallback type. */
export default function Loader({ onDone }: Props) {
  return (
    <motion.div
      className="loader"
      role="status"
      aria-label="Loading portfolio"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6, ease: 'easeInOut' } }}
    >
      <div className="loader__inner">
        <p className="kicker tone-terracotta" style={{ ['--tone' as string]: 'var(--terracotta)' }}>
          Exhibition No. 01
        </p>
        <h1 className="loader__title">
          The Art of <em>Intelligence</em>
        </h1>
        <div className="loader__bar" aria-hidden="true">
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.1, ease: 'easeInOut' }}
            onAnimationComplete={() => {
              const fonts = (document as Document & { fonts?: FontFaceSet }).fonts
              const wait = fonts ? Promise.race([fonts.ready, new Promise((r) => setTimeout(r, 600))]) : Promise.resolve()
              wait.then(onDone)
            }}
            style={{ width: '100%' }}
          />
        </div>
      </div>
    </motion.div>
  )
}
