import { useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Icon } from './Icon'
import { Avatar } from './Avatar'

const NAV = [
  { id: 'account',       label: 'Account',              icon: 'contact' },
  { id: 'privacy',       label: 'Privacy & Security',   icon: 'lock' },
  { id: 'notifications', label: 'Notifications',        icon: 'bell' },
  { id: 'sessions',      label: 'Active Sessions',      icon: 'monitor' },
  { id: 'storage',       label: 'Data & Storage',       icon: 'file' },
  { id: 'help',          label: 'Help & Support',       icon: 'alert' },
]

const SESSIONS = [
  { id: 1, device: 'MacBook Pro',    platform: 'monitor', location: 'Kyiv, Ukraine',   time: 'Active now',  current: true },
  { id: 2, device: 'iPhone 15 Pro',  platform: 'phone',   location: 'Kyiv, Ukraine',   time: '2 hours ago', current: false },
  { id: 3, device: 'Chrome — Win',   platform: 'monitor', location: 'Warsaw, Poland',  time: 'Yesterday',   current: false },
]

export function Settings({ onNotify }) {
  const [section, setSection] = useState('account')
  const [editMode, setEditMode] = useState(false)
  const [sessions, setSessions] = useState(SESSIONS)
  const [preferences, setPreferences] = useState({
    encryption: true,
    lastSeen: true,
    receipts: true,
    twoFactor: false,
    messageNotifications: true,
    groupNotifications: false,
    callNotifications: true,
    desktopNotifications: true,
  })
  const [formData, setFormData] = useState({ name: 'Mike', username: 'mike.cloudy', email: 'mike@cloudy.app', phone: '+380 96 123 4567', bio: 'Life is what happens when you\'re busy making plans.' })
  const contentRef = useRef(null)
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useGSAP(() => {
    if (reduced) return
    gsap.from(contentRef.current, { opacity: 0, x: 12, duration: 0.28 })
  }, { scope: contentRef, dependencies: [section] })

  const handleField = (key, value) => setFormData(prev => ({ ...prev, [key]: value }))
  const togglePreference = (key) => setPreferences((current) => ({ ...current, [key]: !current[key] }))
  const handleProfileAction = () => {
    if (editMode) onNotify?.('Profile changes saved')
    setEditMode((value) => !value)
  }

  return (
    <>
      <aside className="glass-panel min-h-0 p-4.5 px-2.5">
        <div className="mb-2.5 border-b border-white/6 px-2.5 pb-4">
          <h2 className="font-display text-[22px] font-bold tracking-tight text-white">Settings</h2>
        </div>
        <nav className="grid gap-0.5">
          {NAV.map(item => (
            <button
              key={item.id}
              type="button"
              className={`flex min-h-10.5 items-center gap-2.5 rounded-sm border px-2.5 text-left text-[13px] transition-colors ${section === item.id ? 'border-cyan/16 bg-cyan/9 text-cyan' : 'border-transparent text-muted hover:bg-white/4 hover:text-white'}`}
              onClick={() => setSection(item.id)}
            >
              <Icon name={item.icon} size={17} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <div className="glass-panel min-h-0 overflow-y-auto" ref={contentRef}>
        {section === 'account' && (
          <div className="mx-auto w-full max-w-[720px] p-6">
            <div className="flex items-center justify-between gap-4 border-b border-white/6 pb-5.5">
              <h3 className="font-display text-[22px] font-bold text-white">Account</h3>
              <button type="button" className={editMode ? 'min-h-9.5 rounded-sm border border-white/28 bg-gradient-to-b from-cyan to-cyan-deep px-3.5 text-xs font-semibold text-cyan-ink shadow-glow' : 'min-h-9.5 rounded-sm border border-white/28 bg-gradient-to-b from-cyan to-cyan-deep px-3.5 text-xs font-semibold text-cyan-ink shadow-glow hover:shadow-[0_8px_34px_rgba(0,229,255,0.4)]'} onClick={handleProfileAction}>
                {editMode ? 'Save Changes' : 'Edit Profile'}
              </button>
            </div>

            <div className="flex items-center gap-3.5 py-5.5">
              <div className="relative">
                <Avatar userId="mike" name="Mike" size="xl" ring />
                {editMode && (
                  <button type="button" className="absolute -right-1 -bottom-1 grid h-7 w-7 place-items-center rounded-full border-2 border-bg-1 bg-cyan text-cyan-ink" aria-label="Change avatar" onClick={() => onNotify?.('Avatar picker is ready')}>
                    <Icon name="photo" />
                  </button>
                )}
              </div>
              <div>
                <div className="text-base font-bold text-white">Mike</div>
                <div className="mt-0.5 text-xs text-muted">@mike.cloudy</div>
                <div className="mt-0.5 text-xs text-muted">Member since August 2024</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              {[
                { key: 'name',     label: 'Full Name',  type: 'text' },
                { key: 'username', label: 'Username',   type: 'text' },
                { key: 'email',    label: 'Email',      type: 'email' },
                { key: 'phone',    label: 'Phone',      type: 'tel' },
              ].map(({ key, label, type }) => (
                <div key={key}>
                  <label className="mb-1.5 block text-[11px] font-semibold tracking-[0.1em] text-muted uppercase">{label}</label>
                  <input
                    type={type}
                    value={formData[key]}
                    disabled={!editMode}
                    onChange={e => handleField(key, e.target.value)}
                    className="glass-input w-full px-2.5 py-2.5 text-white disabled:opacity-68"
                  />
                </div>
              ))}
              <div className="col-span-full">
                <label className="mb-1.5 block text-[11px] font-semibold tracking-[0.1em] text-muted uppercase">Bio</label>
                <textarea
                  value={formData.bio}
                  disabled={!editMode}
                  onChange={e => handleField('bio', e.target.value)}
                  className="glass-input w-full min-h-20.5 resize-y px-2.5 py-2.5 text-white disabled:opacity-68"
                  rows={3}
                />
              </div>
            </div>
          </div>
        )}

        {section === 'privacy' && (
          <div className="mx-auto w-full max-w-[720px] p-6">
            <div className="border-b border-white/6 pb-5.5"><h3 className="font-display text-[22px] font-bold text-white">Privacy &amp; Security</h3></div>
            <div className="mt-4 grid">
              {[
                { key: 'encryption', label: 'End-to-end encryption', sub: 'In development for this local demo' },
                { key: 'lastSeen', label: 'Last seen', sub: 'Show when you were last active' },
                { key: 'receipts', label: 'Read receipts', sub: 'Let others know when you\'ve read messages' },
                { key: 'twoFactor', label: 'Two-factor authentication', sub: 'Extra layer of security for your account' },
              ].map(row => (
                <div key={row.label} className="flex items-center gap-3.5 border-b border-white/6 py-3.5">
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-semibold text-white">{row.label}</div>
                    <div className="mt-0.5 text-xs leading-snug text-muted">{row.sub}</div>
                  </div>
                  <button type="button" className={`relative h-[19px] w-[34px] shrink-0 rounded-full border border-white/8 transition-colors ${preferences[row.key] ? 'bg-cyan/75' : 'bg-white/10'}`} role="switch" aria-checked={preferences[row.key]} aria-label={`Toggle ${row.label}`} onClick={() => togglePreference(row.key)}><span className={`absolute top-0.5 h-[13px] w-[13px] rounded-full transition-all ${preferences[row.key] ? 'left-[17px] bg-cyan-ink' : 'left-0.5 bg-white'}`} /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {section === 'notifications' && (
          <div className="mx-auto w-full max-w-[720px] p-6">
            <div className="border-b border-white/6 pb-5.5"><h3 className="font-display text-[22px] font-bold text-white">Notifications</h3></div>
            <div className="mt-4 grid">
              {[
                { key: 'messageNotifications', label: 'Message notifications', sub: 'Play sound and show badge for new messages' },
                { key: 'groupNotifications', label: 'Group notifications', sub: 'Notify for group mentions only' },
                { key: 'callNotifications', label: 'Call notifications', sub: 'Incoming call alerts' },
                { key: 'desktopNotifications', label: 'Desktop notifications', sub: 'Show native desktop notifications' },
              ].map(row => (
                <div key={row.label} className="flex items-center gap-3.5 border-b border-white/6 py-3.5">
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-semibold text-white">{row.label}</div>
                    <div className="mt-0.5 text-xs leading-snug text-muted">{row.sub}</div>
                  </div>
                  <button type="button" className={`relative h-[19px] w-[34px] shrink-0 rounded-full border border-white/8 transition-colors ${preferences[row.key] ? 'bg-cyan/75' : 'bg-white/10'}`} role="switch" aria-checked={preferences[row.key]} aria-label={`Toggle ${row.label}`} onClick={() => togglePreference(row.key)}><span className={`absolute top-0.5 h-[13px] w-[13px] rounded-full transition-all ${preferences[row.key] ? 'left-[17px] bg-cyan-ink' : 'left-0.5 bg-white'}`} /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {section === 'sessions' && (
          <div className="mx-auto w-full max-w-[720px] p-6">
            <div className="flex items-center justify-between gap-4 border-b border-white/6 pb-5.5">
              <h3 className="font-display text-[22px] font-bold text-white">Active Sessions</h3>
              <button type="button" className="min-h-9.5 rounded-sm border border-danger/35 bg-danger/7 px-3.5 text-xs font-semibold text-danger" onClick={() => { setSessions(SESSIONS.filter((session) => session.current)); onNotify?.('Other sessions were logged out') }}>Log Out All Sessions</button>
            </div>
            <div className="mt-4 grid">
              {sessions.map(session => (
                <div key={session.id} className="flex items-center gap-3.5 border-b border-white/6 py-3.5">
                  <div className="grid h-9.5 w-9.5 place-items-center rounded-sm border border-cyan/16 bg-cyan/6 text-cyan">
                    <Icon name={session.platform} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-semibold text-white">{session.device}{session.current && <span className="ml-1.5 rounded-full bg-cyan/10 px-1.5 py-0.5 text-[9px] font-semibold text-cyan">This device</span>}</div>
                    <div className="mt-0.5 text-xs leading-snug text-muted">{session.location} · {session.time}</div>
                  </div>
                  {!session.current && (
                    <button type="button" className="min-h-8 rounded-sm border border-danger/20 px-3.5 text-xs font-semibold text-danger" onClick={() => { setSessions((current) => current.filter((item) => item.id !== session.id)); onNotify?.(`${session.device} was revoked`) }}>Revoke</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {section === 'storage' && (
          <div className="mx-auto w-full max-w-[720px] p-6">
            <div className="border-b border-white/6 pb-5.5"><h3 className="font-display text-[22px] font-bold text-white">Data &amp; Storage</h3></div>
            <div className="glass-input mt-4.5 p-4.5">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-white">2.34 GB</span>
                <span className="ml-1.5 text-xs text-muted">of 10 GB used</span>
              </div>
              <div className="my-4.5 flex items-center gap-3">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/8"><div className="h-full rounded-full bg-gradient-to-r from-cyan to-cyan-deep" style={{ width: '23%' }} /></div>
                <span className="text-xs font-bold text-cyan">23%</span>
              </div>
              <div className="mb-5 grid gap-2.5">
                {[
                  { label: 'Photos & Videos', size: '1.2 GB', color: 'var(--color-cyan)' },
                  { label: 'Documents',       size: '680 MB', color: 'var(--color-cyan-deep)' },
                  { label: 'Audio',           size: '340 MB', color: 'rgba(0,229,255,0.46)' },
                  { label: 'Other',           size: '120 MB', color: 'var(--color-muted)' },
                ].map(item => (
                  <div key={item.label} className="flex items-center">
                    <span className="mr-2.5 h-1.5 w-1.5 rounded-full" style={{ background: item.color }} />
                    <span className="flex-1 text-xs text-muted">{item.label}</span>
                    <span className="text-xs font-semibold text-white">{item.size}</span>
                  </div>
                ))}
              </div>
              <button type="button" className="min-h-9.5 w-full rounded-sm border border-white/14 bg-white/4.5 text-xs font-semibold text-white" onClick={() => onNotify?.('Storage manager is ready')}>Manage Storage</button>
            </div>
          </div>
        )}

        {section === 'help' && (
          <div className="mx-auto w-full max-w-[720px] p-6">
            <div className="border-b border-white/6 pb-5.5"><h3 className="font-display text-[22px] font-bold text-white">Help &amp; Support</h3></div>
            <div className="mt-4 grid">
              {['FAQ', 'Report a Bug', 'Privacy Policy', 'Terms of Service', 'Contact Support'].map(link => (
                <button key={link} type="button" className="flex w-full items-center justify-between border-b border-white/6 py-3.5 text-left text-[13px] text-white transition-colors hover:text-cyan" onClick={() => onNotify?.(`Opening ${link}`)}>
                  <span>{link}</span>
                  <Icon name="arrowLeft" className="rotate-180" />
                </button>
              ))}
            </div>
            <div className="pt-4.5 text-[11px] text-muted">Cloudy v1.0.0 · Build 2024.08.29</div>
          </div>
        )}
      </div>
    </>
  )
}
