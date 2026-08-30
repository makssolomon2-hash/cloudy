import { useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Icon } from './Icon'
import { Avatar, GroupAvatar } from './Avatar'

export function Conversation({ thread, messages, messageInput, onInputChange, onSend, onBack, onOpenInfo, onCall, onVideo, hiddenOnMobile = false }) {
  const listRef = useRef(null)
  const sendRef = useRef(null)
  const [attachOpen, setAttachOpen] = useState(false)
  const [messageSearch, setMessageSearch] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [recording, setRecording] = useState(false)
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useGSAP(() => {
    const bubbles = listRef.current?.querySelectorAll('[data-bubble]')
    if (!bubbles?.length) return
    gsap.from(bubbles, {
      opacity: 0,
      y: reduced ? 0 : 8,
      duration: reduced ? 0.01 : 0.32,
      stagger: reduced ? 0 : 0.02,
    })
  }, { scope: listRef, dependencies: [thread.id] })

  const handleSend = () => {
    if (!messageInput.trim()) return
    if (!reduced && sendRef.current) {
      gsap.fromTo(sendRef.current, { scale: 0.88 }, { scale: 1, duration: 0.28, ease: 'back.out(1.4)' })
    }
    onSend()
  }

  const isGroup = thread.group
  const isSelf = thread.isSelf
  const visibleMessages = messages.filter((message) => (
    !messageSearch || message.text.toLocaleLowerCase().includes(messageSearch.toLocaleLowerCase())
  ))

  const sendAttachment = (label) => {
    onSend(label)
    setAttachOpen(false)
  }

  const handleVoiceNote = () => {
    if (recording) {
      onSend('Voice note - 0:07')
      setRecording(false)
      return
    }
    setRecording(true)
  }

  return (
    <main className={`glass-panel flex flex-col overflow-hidden max-md:absolute max-md:inset-0 max-md:bottom-[72px] max-md:z-20 max-md:rounded-none ${hiddenOnMobile ? 'max-md:hidden' : ''}`}>
      <div className="flex min-h-16 shrink-0 items-center justify-between gap-3 border-b border-white/6 px-4.5 py-3.5">
        <div className="flex items-center gap-2.5">
          <button type="button" className="back-btn mr-0.5 hidden h-9 w-9 items-center justify-center rounded-sm border border-white/8 bg-white/[0.02] text-muted" aria-label="Back to chats" onClick={onBack}>
            <Icon name="arrowLeft" />
          </button>
          {isGroup
            ? <GroupAvatar size="md" />
            : <Avatar userId={thread.id} name={thread.name} size="md" online={thread.online} isSelf={isSelf} />
          }
          <div>
            <strong className="block text-[14.5px] font-semibold text-white">{thread.name}</strong>
            <div className="text-[11.5px] font-medium text-cyan">{isSelf ? 'Only visible to you' : thread.online ? 'Online' : 'Away'}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" aria-label="Search conversation" className="grid h-8 w-8 place-items-center rounded-sm border border-white/8 bg-white/[0.02] text-muted transition-colors hover:text-white" onClick={() => setSearchOpen((open) => !open)}><Icon name="search" /></button>
          {!isSelf && <button type="button" aria-label="Call contact" className="grid h-8 w-8 place-items-center rounded-sm border border-white/8 bg-white/[0.02] text-muted transition-colors hover:text-white" onClick={onCall}><Icon name="phone" /></button>}
          {!isSelf && <button type="button" aria-label="Start video call" className="grid h-8 w-8 place-items-center rounded-sm border border-white/8 bg-white/[0.02] text-muted transition-colors hover:text-white" onClick={onVideo}><Icon name="video" /></button>}
          <button type="button" aria-label="Open contact panel" className="grid h-8 w-8 place-items-center rounded-sm border border-white/8 bg-white/[0.02] text-muted transition-colors hover:text-white" onClick={onOpenInfo}><Icon name="more" /></button>
        </div>
      </div>

      {searchOpen && (
        <div className="mx-3.5 mt-2.5 flex items-center gap-2 rounded-md border border-cyan/22 bg-white/[0.035] px-2.5 py-2 text-muted">
          <Icon name="search" />
          <input
            autoFocus
            type="search"
            value={messageSearch}
            onChange={(event) => setMessageSearch(event.target.value)}
            placeholder="Search messages"
            aria-label="Search messages"
            className="min-w-0 flex-1 bg-transparent text-[13px] text-white placeholder:text-muted"
          />
        </div>
      )}

      <div className="relative flex flex-1 flex-col justify-end gap-1.5 overflow-y-auto overflow-x-hidden px-4.5 py-4" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.08) transparent' }} aria-live="polite" ref={listRef}>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_18%_28%,rgba(0,229,255,0.06),transparent),radial-gradient(ellipse_35%_35%_at_82%_72%,rgba(0,229,255,0.04),transparent)]" />
        <div className="z-1 mb-1.5 self-center rounded-full border border-white/8 bg-white/[0.02] px-2.5 py-0.5 text-[10px] font-medium tracking-[0.08em] text-muted uppercase">Today</div>
        {visibleMessages.length === 0 && <div className="z-1 m-auto text-center text-[13px] text-muted">No messages match this search.</div>}
        {visibleMessages.map((message, index) => (
          <div key={`${message.time}-${index}`} className={`z-1 flex items-end gap-2 ${message.side === 'me' ? 'justify-end' : ''}`}>
            {message.side === 'other' && !isGroup
              ? <Avatar userId={thread.id} name={thread.name} size="xs" isSelf={isSelf} />
              : message.side === 'other' && isGroup
                ? <GroupAvatar size="xs" />
                : null
            }
            <div
              data-bubble
              className={`relative max-w-[62%] rounded-lg px-3.5 pt-2.5 pb-2 text-[14.5px] leading-normal ${message.side === 'me'
                ? 'rounded-br-[5px] bg-gradient-to-b from-cyan to-cyan-deep text-cyan-ink shadow-[0_4px_18px_rgba(0,229,255,0.22),inset_0_1px_0_rgba(255,255,255,0.3)]'
                : 'rounded-bl-[5px] border border-white/5 bg-white/6 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]'
              }`}
            >
              <span>{message.text}</span>
              <small className="mt-1 block text-[10px] opacity-65">{message.time}{message.side === 'me' && ' ✓✓'}</small>
            </div>
          </div>
        ))}
      </div>

      <div className="relative shrink-0 px-3.5 pt-2.5 pb-3">
        {attachOpen && (
          <div role="menu" aria-label="Attachment options" className="glass-panel absolute bottom-[70px] left-4 z-3 grid min-w-44 gap-0.5 p-1.5">
            <button type="button" role="menuitem" className="flex items-center gap-2.5 rounded-sm px-2.5 py-2.5 text-left text-[13px] text-white transition-colors hover:bg-cyan/10 hover:text-cyan" onClick={() => sendAttachment('Shared photo: studio-session.jpg')}><Icon name="photo" />Photo</button>
            <button type="button" role="menuitem" className="flex items-center gap-2.5 rounded-sm px-2.5 py-2.5 text-left text-[13px] text-white transition-colors hover:bg-cyan/10 hover:text-cyan" onClick={() => sendAttachment('Shared file: new_track.wav')}><Icon name="file" />File</button>
            <button type="button" role="menuitem" className="flex items-center gap-2.5 rounded-sm px-2.5 py-2.5 text-left text-[13px] text-white transition-colors hover:bg-cyan/10 hover:text-cyan" onClick={() => sendAttachment('Shared location: Podil, Kyiv')}><Icon name="contact" />Location</button>
          </div>
        )}
        <div className="glass-input flex min-h-13 items-center gap-2.5 py-2 pr-2.5 pl-3">
          <button className="grid h-8 w-8 shrink-0 place-items-center rounded-sm border border-white/7 bg-white/[0.04] text-muted" type="button" aria-label="Attach file" onClick={() => setAttachOpen((open) => !open)}><Icon name="plus" /></button>
          <input
            type="text"
            value={messageInput}
            onChange={(event) => onInputChange(event.target.value)}
            onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); handleSend() } }}
            placeholder={isSelf ? 'Save a note to your cloud...' : 'Type a message...'}
            aria-label="Message composer"
            className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-muted"
          />
          <div className="flex items-center gap-2">
            <button type="button" className={`text-muted transition-colors hover:text-white ${recording ? 'text-cyan' : ''}`} aria-label={recording ? 'Send voice note' : 'Record voice note'} onClick={handleVoiceNote}><Icon name="mic" /></button>
            <button type="button" className="text-muted transition-colors hover:text-white" aria-label="Add reaction" onClick={() => onInputChange(messageInput ? `${messageInput} :)` : ':)')}><Icon name="smile" /></button>
            <button
              ref={sendRef}
              className={`grid h-10 w-10 place-items-center rounded-full bg-gradient-to-b from-cyan to-cyan-deep text-cyan-ink shadow-glow transition-shadow hover:shadow-[0_8px_36px_rgba(0,229,255,0.4)] ${messageInput.trim() ? '' : 'cursor-default opacity-30 shadow-none hover:shadow-none'}`}
              type="button"
              aria-label="Send message"
              onClick={handleSend}
            >
              <Icon name="send" size={16} />
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
