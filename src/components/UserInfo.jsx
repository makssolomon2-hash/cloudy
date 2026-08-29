import { useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Icon } from './Icon'
import { Avatar } from './Avatar'

export function UserInfo({ thread, onClose, onCall, onVideo, onBlock, onNotify }) {
  const panelRef = useRef(null)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [muted, setMuted] = useState(false)
  const [confirmBlock, setConfirmBlock] = useState(false)
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useGSAP(() => {
    if (reduced) return
    gsap.fromTo(panelRef.current,
      { opacity: 0, x: 18 },
      { opacity: 1, x: 0, duration: 0.35, ease: 'power3.inOut' }
    )
  }, { scope: panelRef })

  const username = `@${thread.id}.cloudy`
  const copyUsername = async () => {
    try {
      await navigator.clipboard?.writeText(username)
    } catch {}
    onNotify?.('Username copied')
  }

  return (
    <aside ref={panelRef} className="info-panel glass-panel">
      <div className="info-header">
        <button type="button" className="ghost-close" aria-label="Close contact panel" onClick={onClose}>
          <Icon name="arrowLeft" />
        </button>
      </div>

      <div className="profile-summary">
        <Avatar userId={thread.id} name={thread.name} size="xl" ring online={thread.online} />
        <h3>{thread.name}</h3>
        <span className="status">{thread.online ? 'Online' : 'Away'}</span>
      </div>

      <div className="action-grid">
        <button type="button" aria-label={`Call ${thread.name}`} onClick={onCall}><Icon name="phone" /><span>Call</span></button>
        <button type="button" aria-label={`Video call ${thread.name}`} onClick={onVideo}><Icon name="video" /><span>Video</span></button>
        <button type="button" aria-label={muted ? 'Unmute conversation' : 'Mute conversation'} onClick={() => { setMuted((value) => !value); onNotify?.(muted ? 'Conversation unmuted' : 'Conversation muted') }}><Icon name="bell" /><span>{muted ? 'Unmute' : 'Mute'}</span></button>
        <button type="button" aria-label="More contact actions" onClick={() => onNotify?.('Contact actions are ready')}><Icon name="more" /><span>More</span></button>
      </div>

      <div className="info-section">
        <h4>About</h4>
        <p>Life is what happens when you&#39;re busy making plans.</p>
      </div>

      <div className="info-list">
        <div className="list-row">
          <span>Username</span>
          <button type="button" className="username-copy" onClick={copyUsername}>{username}</button>
        </div>
        <div className="list-row">
          <span>Notifications</span>
          <button
            type="button"
            className={`switch${notificationsEnabled ? ' on' : ''}`}
            role="switch"
            aria-checked={notificationsEnabled}
            aria-label="Toggle notifications"
            onClick={() => setNotificationsEnabled((value) => !value)}
          ><span /></button>
        </div>
        <div className="list-row"><span>Shared Media</span><strong>342</strong></div>
        <div className="list-row"><span>Files</span><strong>28</strong></div>
        <div className="list-row"><span>Links</span><strong>17</strong></div>
      </div>

      <button
        type="button"
        className={`danger-action${confirmBlock ? ' confirm' : ''}`}
        onClick={() => {
          if (confirmBlock) onBlock?.(thread)
          else setConfirmBlock(true)
        }}
      >
        <Icon name="alert" />
        {confirmBlock ? 'Confirm block' : 'Block User'}
      </button>
    </aside>
  )
}
