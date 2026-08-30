import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Avatar } from './Avatar'
import { Icon } from './Icon'

const WAVEFORM = [3,6,9,14,8,12,16,9,5,11,15,10,7,13,9,4,8,12,16,11,6,9,13,8,5,10,15,12,7,4,9,11]

const ACTIVE_USERS = [
  { id: 'mike',  name: 'Mike' },
  { id: 'anna',  name: 'Anna' },
  { id: 'emma',  name: 'Emma' },
  { id: 'alex',  name: 'Alex' },
  { id: 'david', name: 'David' },
]

export function Dashboard({ onNotify }) {
  const wrapRef = useRef(null)
  const ringRef = useRef(null)
  const waveRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useGSAP(() => {
    if (reduced) return
    gsap.from('.dash-card', {
      opacity: 0,
      y: 20,
      duration: 0.45,
      stagger: 0.07,
    })
  }, { scope: wrapRef })

  useEffect(() => {
    if (!ringRef.current || reduced) return
    const circumference = 2 * Math.PI * 54
    ringRef.current.style.strokeDasharray = circumference
    ringRef.current.style.strokeDashoffset = circumference
    gsap.to(ringRef.current, {
      strokeDashoffset: circumference * (1 - 0.68),
      duration: 1.4,
      ease: 'power2.out',
    })
  }, [reduced])

  useEffect(() => {
    if (!waveRef.current || reduced || !isPlaying) return
    const bars = waveRef.current.querySelectorAll('.wf-bar')
    const tl = gsap.timeline({ repeat: -1, yoyo: true })
    bars.forEach((bar, i) => {
      tl.to(bar, { scaleY: 0.3 + Math.random() * 1.4, duration: 0.2 + Math.random() * 0.3, ease: 'sine.inOut' }, i * 0.03)
    })
    return () => tl.kill()
  }, [isPlaying, reduced])

  const now = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div className="grid gap-2.5 pb-3" ref={wrapRef}>
      <div className="dash-card glass-panel flex items-center justify-between gap-5 p-5.5">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-white">Good morning, Mike</h2>
          <p className="mt-1 text-[13px] text-muted">{now}</p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-cyan/15 bg-cyan/6 px-2.5 py-2 text-[11px] text-cyan">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan shadow-[0_0_0_5px_rgba(0,229,255,0.12)]" />
          All systems operational
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {[
          { label: 'Messages today',  value: '1,284', delta: '+12%',  positive: true  },
          { label: 'Active users',    value: '47',    delta: '+3',    positive: true  },
          { label: 'Avg response',    value: '1.4s',  delta: '-0.2s', positive: true  },
          { label: 'Open calls',      value: '2',     delta: '+1',    positive: false },
        ].map(stat => (
          <div key={stat.label} className="dash-card glass-panel relative p-4.5">
            <div className="font-display text-[28px] font-bold text-white">{stat.value}</div>
            <div className="mt-1 text-xs text-muted">{stat.label}</div>
            <div className="absolute top-4.5 right-4.5 text-[11px] font-bold text-cyan">{stat.delta}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-2.5">
        <div className="dash-card glass-panel p-4.5">
          <h4 className="font-display text-[13px] font-bold text-white">Cloud Storage</h4>
          <div className="relative my-3.5 grid place-items-center">
            <svg width="130" height="130" viewBox="0 0 130 130" className="[grid-area:1/1]">
              <circle cx="65" cy="65" r="54" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
              <circle
                ref={ringRef}
                cx="65" cy="65" r="54"
                fill="none"
                stroke="var(--color-cyan)"
                strokeWidth="8"
                strokeLinecap="round"
                transform="rotate(-90 65 65)"
                style={{ filter: 'drop-shadow(0 0 8px rgba(0,229,255,0.5))' }}
              />
            </svg>
            <div className="grid place-items-center text-center [grid-area:1/1]">
              <span className="font-display text-2xl font-bold text-white">68%</span>
              <span className="text-[11px] text-muted">used</span>
            </div>
          </div>
          <div className="flex justify-center gap-1.5">
            <span className="text-[13px] font-bold text-cyan">6.8 GB</span>
            <span className="text-[11px] text-muted">of 10 GB</span>
          </div>
        </div>

        <div className="dash-card glass-panel p-4.5">
          <div className="flex items-center justify-between">
            <h4 className="font-display text-[13px] font-bold text-white">Now Playing</h4>
            <span className="rounded-full bg-cyan/10 px-1.5 py-0.5 text-[9px] font-bold text-cyan">LIVE</span>
          </div>
          <div className="my-4 flex items-center gap-2.5">
            <div className="h-10.5 w-10.5 rounded-sm border border-cyan/28 bg-[radial-gradient(circle_at_70%_30%,rgba(0,229,255,0.75),transparent_34%)] bg-cyan/6" />
            <div>
              <div className="text-[13px] font-bold text-white">new_track.wav</div>
              <div className="mt-0.5 text-[11px] text-muted">SLMN Studio · Sound Engineer</div>
            </div>
          </div>
          <div className="my-1 mb-3.5 flex h-10.5 items-center gap-0.5 overflow-hidden" ref={waveRef}>
            {WAVEFORM.map((h, i) => (
              <div key={i} className="wf-bar min-w-0.5 max-w-1.25 flex-1 origin-center rounded-full bg-gradient-to-b from-cyan to-cyan-deep" style={{ height: h * 2 + 'px' }} />
            ))}
          </div>
          <div className="flex items-center justify-center gap-3.25">
            <button type="button" className="grid place-items-center text-muted" aria-label="Previous track" onClick={() => onNotify?.('Previous track selected')}><Icon name="arrowLeft" size={18} /></button>
            <button type="button" className="grid h-9 w-9 place-items-center rounded-full bg-cyan text-cyan-ink shadow-glow" aria-label={isPlaying ? 'Pause track' : 'Play track'} onClick={() => setIsPlaying((playing) => !playing)}><Icon name={isPlaying ? 'pause' : 'play'} size={17} /></button>
            <button type="button" className="grid place-items-center text-muted" aria-label="Next track" onClick={() => onNotify?.('Next track selected')}><Icon name="arrowRight" size={18} /></button>
            <span className="ml-auto text-[10px] text-muted">2:41 / 4:18</span>
          </div>
        </div>

        <div className="dash-card glass-panel p-4.5">
          <h4 className="font-display text-[13px] font-bold text-white">Active Users <span className="text-cyan">{ACTIVE_USERS.length + 12}</span></h4>
          <div className="relative my-4.25 h-11.5">
            {ACTIVE_USERS.map((user, i) => (
              <div key={user.id} className="absolute top-0 [&_.av]:border-2 [&_.av]:border-bg-1" style={{ zIndex: ACTIVE_USERS.length - i, left: i * 22 }}>
                <Avatar userId={user.id} name={user.name} size="sm" />
              </div>
            ))}
            <div className="absolute top-0 grid h-10 w-10 place-items-center rounded-full border-2 border-bg-1 bg-cyan text-[10px] font-bold text-cyan-ink" style={{ left: ACTIVE_USERS.length * 22 }}>+12</div>
          </div>
          <div className="grid gap-2.25">
            {ACTIVE_USERS.map(user => (
              <div key={user.id} className="flex items-center gap-2 text-xs text-white">
                <Avatar userId={user.id} name={user.name} size="xs" online />
                <span>{user.name}</span>
                <span className="ml-auto text-[10px] text-cyan">Online</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
