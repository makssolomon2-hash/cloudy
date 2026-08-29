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
      <aside className="settings-nav glass-panel">
        <div className="settings-nav-header">
          <h2>Settings</h2>
        </div>
        <nav>
          {NAV.map(item => (
            <button
              key={item.id}
              type="button"
              className={`settings-nav-item${section === item.id ? ' active' : ''}`}
              onClick={() => setSection(item.id)}
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <div className="settings-content glass-panel" ref={contentRef}>
        {section === 'account' && (
          <div className="settings-section">
            <div className="settings-section-header">
              <h3>Account</h3>
              <button type="button" className={`btn-primary${editMode ? ' btn-save' : ''}`} onClick={handleProfileAction}>
                {editMode ? 'Save Changes' : 'Edit Profile'}
              </button>
            </div>

            <div className="account-avatar-row">
              <div className="account-avatar-wrap">
                <Avatar userId="mike" name="Mike" size="xl" ring />
                {editMode && (
                  <button type="button" className="avatar-edit-btn" aria-label="Change avatar" onClick={() => onNotify?.('Avatar picker is ready')}>
                    <Icon name="photo" />
                  </button>
                )}
              </div>
              <div>
                <div className="account-name">Mike</div>
                <div className="account-username">@mike.cloudy</div>
                <div className="account-joined">Member since August 2024</div>
              </div>
            </div>

            <div className="settings-fields">
              {[
                { key: 'name',     label: 'Full Name',  type: 'text' },
                { key: 'username', label: 'Username',   type: 'text' },
                { key: 'email',    label: 'Email',      type: 'email' },
                { key: 'phone',    label: 'Phone',      type: 'tel' },
              ].map(({ key, label, type }) => (
                <div key={key} className="settings-field">
                  <label>{label}</label>
                  <input
                    type={type}
                    value={formData[key]}
                    disabled={!editMode}
                    onChange={e => handleField(key, e.target.value)}
                    className="settings-input glass-input"
                  />
                </div>
              ))}
              <div className="settings-field">
                <label>Bio</label>
                <textarea
                  value={formData.bio}
                  disabled={!editMode}
                  onChange={e => handleField('bio', e.target.value)}
                  className="settings-input settings-textarea glass-input"
                  rows={3}
                />
              </div>
            </div>
          </div>
        )}

        {section === 'privacy' && (
          <div className="settings-section">
            <div className="settings-section-header"><h3>Privacy &amp; Security</h3></div>
            <div className="settings-toggles">
              {[
                { key: 'encryption', label: 'End-to-end encryption', sub: 'In development for this local demo' },
                { key: 'lastSeen', label: 'Last seen', sub: 'Show when you were last active' },
                { key: 'receipts', label: 'Read receipts', sub: 'Let others know when you\'ve read messages' },
                { key: 'twoFactor', label: 'Two-factor authentication', sub: 'Extra layer of security for your account' },
              ].map(row => (
                <div key={row.label} className="settings-toggle-row">
                  <div>
                    <div className="toggle-label">{row.label}</div>
                    <div className="toggle-sub">{row.sub}</div>
                  </div>
                  <button type="button" className={`switch${preferences[row.key] ? ' on' : ''}`} role="switch" aria-checked={preferences[row.key]} aria-label={`Toggle ${row.label}`} onClick={() => togglePreference(row.key)}><span /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {section === 'notifications' && (
          <div className="settings-section">
            <div className="settings-section-header"><h3>Notifications</h3></div>
            <div className="settings-toggles">
              {[
                { key: 'messageNotifications', label: 'Message notifications', sub: 'Play sound and show badge for new messages' },
                { key: 'groupNotifications', label: 'Group notifications', sub: 'Notify for group mentions only' },
                { key: 'callNotifications', label: 'Call notifications', sub: 'Incoming call alerts' },
                { key: 'desktopNotifications', label: 'Desktop notifications', sub: 'Show native desktop notifications' },
              ].map(row => (
                <div key={row.label} className="settings-toggle-row">
                  <div>
                    <div className="toggle-label">{row.label}</div>
                    <div className="toggle-sub">{row.sub}</div>
                  </div>
                  <button type="button" className={`switch${preferences[row.key] ? ' on' : ''}`} role="switch" aria-checked={preferences[row.key]} aria-label={`Toggle ${row.label}`} onClick={() => togglePreference(row.key)}><span /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {section === 'sessions' && (
          <div className="settings-section">
            <div className="settings-section-header">
              <h3>Active Sessions</h3>
              <button type="button" className="btn-danger" onClick={() => { setSessions(SESSIONS.filter((session) => session.current)); onNotify?.('Other sessions were logged out') }}>Log Out All Sessions</button>
            </div>
            <div className="sessions-list">
              {sessions.map(session => (
                <div key={session.id} className={`session-row${session.current ? ' current' : ''}`}>
                  <div className="session-icon">
                    <Icon name={session.platform} />
                  </div>
                  <div className="session-info">
                    <div className="session-device">{session.device}{session.current && <span className="session-badge">This device</span>}</div>
                    <div className="session-meta">{session.location} · {session.time}</div>
                  </div>
                  {!session.current && (
                    <button type="button" className="session-revoke" onClick={() => { setSessions((current) => current.filter((item) => item.id !== session.id)); onNotify?.(`${session.device} was revoked`) }}>Revoke</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {section === 'storage' && (
          <div className="settings-section">
            <div className="settings-section-header"><h3>Data &amp; Storage</h3></div>
            <div className="storage-card glass-input">
              <div className="storage-header">
                <span className="storage-used">2.34 GB</span>
                <span className="storage-total">of 10 GB used</span>
              </div>
              <div className="storage-bar-wrap">
                <div className="storage-bar"><div className="storage-fill" style={{ width: '23%' }} /></div>
                <span className="storage-pct">23%</span>
              </div>
              <div className="storage-breakdown">
                {[
                  { label: 'Photos & Videos', size: '1.2 GB', color: 'var(--cyan)' },
                  { label: 'Documents',       size: '680 MB', color: 'var(--cyan-deep)' },
                  { label: 'Audio',           size: '340 MB', color: 'rgba(0,229,255,0.46)' },
                  { label: 'Other',           size: '120 MB', color: 'var(--muted)' },
                ].map(item => (
                  <div key={item.label} className="storage-row">
                    <span className="storage-dot" style={{ background: item.color }} />
                    <span className="storage-label">{item.label}</span>
                    <span className="storage-size">{item.size}</span>
                  </div>
                ))}
              </div>
              <button type="button" className="btn-secondary" onClick={() => onNotify?.('Storage manager is ready')}>Manage Storage</button>
            </div>
          </div>
        )}

        {section === 'help' && (
          <div className="settings-section">
            <div className="settings-section-header"><h3>Help &amp; Support</h3></div>
            <div className="help-links">
              {['FAQ', 'Report a Bug', 'Privacy Policy', 'Terms of Service', 'Contact Support'].map(link => (
                <button key={link} type="button" className="help-link-row" onClick={() => onNotify?.(`Opening ${link}`)}>
                  <span>{link}</span>
                  <Icon name="arrowLeft" className="icon-flip" />
                </button>
              ))}
            </div>
            <div className="app-version">Cloudy v1.0.0 · Build 2024.08.29</div>
          </div>
        )}
      </div>
    </>
  )
}
