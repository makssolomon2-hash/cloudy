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
    <aside ref={panelRef} className="glass-panel flex w-info flex-col overflow-y-auto p-3.5" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.06) transparent' }}>
      <div className="flex shrink-0 justify-end">
        <button type="button" className="grid h-8 w-8 place-items-center rounded-sm border border-white/8 bg-white/[0.02] text-muted transition-colors hover:text-white" aria-label="Close contact panel" onClick={onClose}>
          <Icon name="arrowLeft" />
        </button>
      </div>

      <div className="flex flex-col items-center py-2.5 pb-4 text-center">
        <Avatar userId={thread.id} name={thread.name} size="xl" ring online={thread.online} isSelf={thread.isSelf} />
        <h3 className="font-display mt-2.5 mb-0.5 text-xl font-bold text-white">{thread.name}</h3>
        <span className="text-xs font-medium text-cyan">{thread.isSelf ? 'Only visible to you' : thread.online ? 'Online' : 'Away'}</span>
      </div>

      {!thread.isSelf && (
        <div className="mb-3.5 grid grid-cols-4 gap-2">
          <button type="button" className="flex min-h-15.5 flex-col items-center justify-center gap-1.5 rounded-md border border-white/7 bg-white/[0.03] text-[10px] text-white transition-colors hover:bg-white/6" aria-label={`Call ${thread.name}`} onClick={onCall}><Icon name="phone" size={17} /><span>Call</span></button>
          <button type="button" className="flex min-h-15.5 flex-col items-center justify-center gap-1.5 rounded-md border border-white/7 bg-white/[0.03] text-[10px] text-white transition-colors hover:bg-white/6" aria-label={`Video call ${thread.name}`} onClick={onVideo}><Icon name="video" size={17} /><span>Video</span></button>
          <button type="button" className="flex min-h-15.5 flex-col items-center justify-center gap-1.5 rounded-md border border-white/7 bg-white/[0.03] text-[10px] text-white transition-colors hover:bg-white/6" aria-label={muted ? 'Unmute conversation' : 'Mute conversation'} onClick={() => { setMuted((value) => !value); onNotify?.(muted ? 'Conversation unmuted' : 'Conversation muted') }}><Icon name="bell" size={17} /><span>{muted ? 'Unmute' : 'Mute'}</span></button>
          <button type="button" className="flex min-h-15.5 flex-col items-center justify-center gap-1.5 rounded-md border border-white/7 bg-white/[0.03] text-[10px] text-white transition-colors hover:bg-white/6" aria-label="More contact actions" onClick={() => onNotify?.('Contact actions are ready')}><Icon name="more" size={17} /><span>More</span></button>
        </div>
      )}

      <div className="mb-3.5">
        <h4 className="mb-1.5 text-[10px] font-semibold tracking-[0.12em] text-muted uppercase">About</h4>
        <p className="text-[13px] leading-[1.55] text-white/88">{thread.isSelf ? 'Notes, files, and links you save here stay private to your account.' : "Life is what happens when you're busy making plans."}</p>
      </div>

      <div className="mb-3 flex flex-col">
        {!thread.isSelf && (
          <div className="flex items-center justify-between gap-2.5 border-b border-white/5 py-2.5 text-[13px]">
            <span className="text-muted">Username</span>
            <button type="button" className="font-semibold text-white transition-colors hover:text-cyan" onClick={copyUsername}>{username}</button>
          </div>
        )}
        <div className="flex items-center justify-between gap-2.5 border-b border-white/5 py-2.5 text-[13px]">
          <span className="text-muted">Notifications</span>
          <button
            type="button"
            className={`relative h-[19px] w-[34px] shrink-0 rounded-full border border-white/8 transition-colors ${notificationsEnabled ? 'bg-cyan/75' : 'bg-white/10'}`}
            role="switch"
            aria-checked={notificationsEnabled}
            aria-label="Toggle notifications"
            onClick={() => setNotificationsEnabled((value) => !value)}
          ><span className={`absolute top-0.5 h-[13px] w-[13px] rounded-full transition-all ${notificationsEnabled ? 'left-[17px] bg-cyan-ink' : 'left-0.5 bg-white'}`} /></button>
        </div>
        <div className="flex items-center justify-between gap-2.5 border-b border-white/5 py-2.5 text-[13px]"><span className="text-muted">{thread.isSelf ? 'Saved Files' : 'Shared Media'}</span><strong className="font-semibold text-white">342</strong></div>
        <div className="flex items-center justify-between gap-2.5 border-b border-white/5 py-2.5 text-[13px]"><span className="text-muted">Files</span><strong className="font-semibold text-white">28</strong></div>
        <div className="flex items-center justify-between gap-2.5 border-b border-white/5 py-2.5 text-[13px]"><span className="text-muted">Links</span><strong className="font-semibold text-white">17</strong></div>
      </div>

      {!thread.isSelf && (
        <button
          type="button"
          className={`mt-auto flex w-full items-center justify-center gap-2 rounded-md border px-3.5 py-2.5 text-[13px] text-danger transition-colors ${confirmBlock ? 'border-danger/62 bg-danger/16' : 'border-danger/35 bg-danger/7'}`}
          onClick={() => {
            if (confirmBlock) onBlock?.(thread)
            else setConfirmBlock(true)
          }}
        >
          <Icon name="alert" />
          {confirmBlock ? 'Confirm block' : 'Block User'}
        </button>
      )}
    </aside>
  )
}
