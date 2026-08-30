import { Icon } from './Icon'

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

export function Avatar({ userId, name, src, size = 'sm', online, ring = false, isSelf = false, className = '' }) {
  const url = src || AVATARS[userId]
  const px = SIZES[size] ?? SIZES.sm
  const initial = (name || userId || '?')[0].toUpperCase()

  return (
    <div
      className={`relative grid shrink-0 place-items-center rounded-full border-[1.5px] border-white/16 bg-gradient-to-br from-cyan/20 to-white/8 shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_4px_12px_rgba(0,0,0,0.24)] ${ring ? 'border-2 !border-cyan p-[3px] shadow-[0_0_0_3px_rgba(0,229,255,0.13),inset_0_1px_0_rgba(255,255,255,0.22)]' : ''} ${className}`}
      style={{ width: px, height: px, minWidth: px }}
      aria-label={name || userId}
    >
      {isSelf ? (
        <div className="grid h-full w-full place-items-center rounded-full bg-cyan text-cyan-ink">
          <Icon name="cloud" size={Math.round(px * 0.46)} />
        </div>
      ) : url ? (
        <img src={url} alt={name || userId || ''} loading="lazy" className={`block h-full w-full rounded-full object-cover object-center ${ring ? 'border border-white/28' : ''}`} />
      ) : (
        <div className="grid h-full w-full place-items-center rounded-full bg-cyan text-[12px] font-bold text-cyan-ink">{initial}</div>
      )}
      {online !== undefined && (
        <span className={`absolute -right-px -bottom-px h-2.5 w-2.5 rounded-full border-2 border-bg-1 ${online ? 'bg-cyan shadow-[0_0_0_2px_rgba(0,229,255,0.18)]' : 'bg-muted'}`} />
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
    <div className="grid shrink-0 grid-cols-2 grid-rows-2 gap-0.5 overflow-hidden rounded-full border-[1.5px] border-white/16 bg-white/7 p-0.5" style={{ width: px, height: px }}>
      {faces.slice(0, 4).map((url, i) => (
        <img key={i} src={url} alt="" className="h-full w-full min-w-0 rounded-full object-cover" loading="lazy" />
      ))}
    </div>
  )
}
