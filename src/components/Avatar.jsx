export const AVATARS = {
  mike:      'https://i.pravatar.cc/150?img=68',
  anna:      'https://i.pravatar.cc/150?img=47',
  alex:      'https://i.pravatar.cc/150?img=12',
  david:     'https://i.pravatar.cc/150?img=53',
  emma:      'https://i.pravatar.cc/150?img=48',
  sophie:    'https://i.pravatar.cc/150?img=44',
  john:      'https://i.pravatar.cc/150?img=15',
}

const SIZES = { xs: 26, sm: 40, md: 36, lg: 52, xl: 86 }

export function Avatar({ userId, name, src, size = 'sm', online, ring = false, className = '' }) {
  const url = src || AVATARS[userId]
  const px = SIZES[size] ?? SIZES.sm
  const initial = (name || userId || '?')[0].toUpperCase()

  return (
    <div
      className={`av av-${size}${ring ? ' av-ring' : ''} ${className}`}
      style={{ width: px, height: px, minWidth: px }}
      aria-label={name || userId}
    >
      {url
        ? <img src={url} alt={name || userId || ''} className="av-img" loading="lazy" />
        : <div className="av-fallback">{initial}</div>
      }
      {online !== undefined && (
        <span className={`av-dot ${online ? 'av-dot--on' : 'av-dot--off'}`} />
      )}
    </div>
  )
}

export function GroupAvatar({ size = 'sm' }) {
  const px = SIZES[size] ?? SIZES.sm
  const faces = [
    AVATARS.mike, AVATARS.anna, AVATARS.alex, AVATARS.david,
  ]

  return (
    <div className={`av av-${size} av-group`} style={{ width: px, height: px }}>
      {faces.slice(0, 4).map((url, i) => (
        <img key={i} src={url} alt="" className="av-group-face" loading="lazy" />
      ))}
    </div>
  )
}
