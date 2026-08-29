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
    <div className="dashboard-wrap" ref={wrapRef}>
      <div className="dash-header glass-panel dash-card">
        <div>
          <h2 className="dash-greeting">Good morning, Mike</h2>
          <p className="dash-date">{now}</p>
        </div>
        <div className="dash-header-actions">
          <div className="dash-status-pill">
            <span className="pulse-dot" />
            All systems operational
          </div>
        </div>
      </div>

      <div className="dash-stats">
        {[
          { label: 'Messages today',  value: '1,284', delta: '+12%',  positive: true  },
          { label: 'Active users',    value: '47',    delta: '+3',    positive: true  },
          { label: 'Avg response',    value: '1.4s',  delta: '-0.2s', positive: true  },
          { label: 'Open calls',      value: '2',     delta: '+1',    positive: false },
        ].map(stat => (
          <div key={stat.label} className="stat-card glass-panel dash-card">
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
            <div className={`stat-delta ${stat.positive ? 'positive' : 'negative'}`}>{stat.delta}</div>
          </div>
        ))}
      </div>

      <div className="dash-row">
        <div className="storage-ring-card glass-panel dash-card">
          <h4>Cloud Storage</h4>
          <div className="ring-wrap">
            <svg width="130" height="130" viewBox="0 0 130 130">
              <circle cx="65" cy="65" r="54" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
              <circle
                ref={ringRef}
                cx="65" cy="65" r="54"
                fill="none"
                stroke="var(--cyan)"
                strokeWidth="8"
                strokeLinecap="round"
                transform="rotate(-90 65 65)"
                style={{ filter: 'drop-shadow(0 0 8px rgba(0,229,255,0.5))' }}
              />
            </svg>
            <div className="ring-label">
              <span className="ring-pct">10%</span>
              <span className="ring-sub">used</span>
            </div>
          </div>
          <div className="ring-detail">
            <span className="ring-used">6.8 GB</span>
            <span className="ring-total">of 10 GB</span>
          </div>
        </div>

        <div className="now-playing-card glass-panel dash-card">
          <div className="np-header">
            <h4>Now Playing</h4>
            <span className="np-live">LIVE</span>
          </div>
          <div className="np-info">
            <div className="np-thumb" />
            <div>
              <div className="np-title">new_track.wav</div>
              <div className="np-artist">SLMN Studio · Sound Engineer</div>
            </div>
          </div>
          <div className="waveform" ref={waveRef}>
            {WAVEFORM.map((h, i) => (
              <div key={i} className="wf-bar" style={{ height: h * 2 + 'px' }} />
            ))}
          </div>
          <div className="np-controls">
            <button type="button" className="np-btn" aria-label="Previous track" onClick={() => onNotify?.('Previous track selected')}><Icon name="arrowLeft" /></button>
            <button type="button" className="np-play" aria-label={isPlaying ? 'Pause track' : 'Play track'} onClick={() => setIsPlaying((playing) => !playing)}><Icon name={isPlaying ? 'pause' : 'play'} /></button>
            <button type="button" className="np-btn" aria-label="Next track" onClick={() => onNotify?.('Next track selected')}><Icon name="arrowRight" /></button>
            <span className="np-time">2:41 / 4:18</span>
          </div>
        </div>

        <div className="active-users-card glass-panel dash-card">
          <h4>Active Users <span className="au-count">{ACTIVE_USERS.length + 12}</span></h4>
          <div className="au-stack">
            {ACTIVE_USERS.map((user, i) => (
              <div key={user.id} className="au-avatar" style={{ zIndex: ACTIVE_USERS.length - i, left: i * 22 }}>
                <Avatar userId={user.id} name={user.name} size="sm" />
              </div>
            ))}
            <div className="au-more" style={{ left: ACTIVE_USERS.length * 22 }}>+12</div>
          </div>
          <div className="au-list">
            {ACTIVE_USERS.map(user => (
              <div key={user.id} className="au-row">
                <Avatar userId={user.id} name={user.name} size="xs" online />
                <span>{user.name}</span>
                <span className="au-status">Online</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
