type Props = {
  label: string
  note?: string
  tone?: 'terracotta' | 'plum' | 'forest'
}

export default function SceneEyebrow({ label, note, tone = 'terracotta' }: Props) {
  return (
    <div className={`eyebrow tone-${tone}`} data-enter>
      <span className="eyebrow__label">{label}</span>
      {note && (
        <>
          <span className="eyebrow__rule" aria-hidden="true" />
          <span className="eyebrow__note">{note}</span>
        </>
      )}
    </div>
  )
}
