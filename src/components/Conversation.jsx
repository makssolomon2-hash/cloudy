import { useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Icon } from './Icon'
import { Avatar } from './Avatar'

export function Conversation({ thread, messages, messageInput, onInputChange, onSend, onBack, onOpenInfo, onCall, onVideo, className = '' }) {
  const listRef = useRef(null)
  const sendRef = useRef(null)
  const [attachOpen, setAttachOpen] = useState(false)
  const [messageSearch, setMessageSearch] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [recording, setRecording] = useState(false)
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useGSAP(() => {
    const bubbles = listRef.current?.querySelectorAll('.bubble')
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
    <main className={`conversation glass-panel ${className}`}>
      <div className="conversation-header">
        <div className="header-person">
          <button type="button" className="back-btn" aria-label="Back to chats" onClick={onBack}>
            <Icon name="arrowLeft" />
          </button>
          {isGroup
            ? <div className="avatar avatar-md" />
            : <Avatar userId={thread.id} name={thread.name} size="md" online={thread.online} />
          }
          <div>
            <strong>{thread.name}</strong>
            <div className="online-label">{thread.online ? 'Online' : 'Away'}</div>
          </div>
        </div>
        <div className="header-actions">
          <button type="button" aria-label="Search conversation" onClick={() => setSearchOpen((open) => !open)}><Icon name="search" /></button>
          <button type="button" aria-label="Call contact" onClick={onCall}><Icon name="phone" /></button>
          <button type="button" aria-label="Start video call" onClick={onVideo}><Icon name="video" /></button>
          <button type="button" aria-label="Open contact panel" onClick={onOpenInfo}><Icon name="more" /></button>
        </div>
      </div>

      {searchOpen && (
        <div className="conversation-search">
          <Icon name="search" />
          <input
            autoFocus
            type="search"
            value={messageSearch}
            onChange={(event) => setMessageSearch(event.target.value)}
            placeholder="Search messages"
            aria-label="Search messages"
          />
        </div>
      )}

      <div className="message-list" aria-live="polite" ref={listRef}>
        <div className="date-divider">Today</div>
        {visibleMessages.length === 0 && <div className="message-empty">No messages match this search.</div>}
        {visibleMessages.map((message, index) => (
          <div key={`${message.time}-${index}`} className={`message-row ${message.side}`}>
            {message.side === 'other' && !isGroup
              ? <Avatar userId={thread.id} name={thread.name} size="xs" />
              : message.side === 'other' && isGroup
                ? <div className="avatar avatar-xs" />
                : null
            }
            <div className={`bubble ${message.side}`}>
              <span>{message.text}</span>
              <small>{message.time}{message.side === 'me' && ' ✓✓'}</small>
            </div>
          </div>
        ))}
      </div>

      <div className="composer-wrap">
        {attachOpen && (
          <div className="attach-menu" role="menu" aria-label="Attachment options">
            <button type="button" role="menuitem" onClick={() => sendAttachment('Shared photo: studio-session.jpg')}><Icon name="photo" />Photo</button>
            <button type="button" role="menuitem" onClick={() => sendAttachment('Shared file: new_track.wav')}><Icon name="file" />File</button>
            <button type="button" role="menuitem" onClick={() => sendAttachment('Shared location: Podil, Kyiv')}><Icon name="contact" />Location</button>
          </div>
        )}
        <div className="composer glass-input">
          <button className="composer-attach" type="button" aria-label="Attach file" onClick={() => setAttachOpen((open) => !open)}><Icon name="plus" /></button>
          <input
            type="text"
            value={messageInput}
            onChange={(event) => onInputChange(event.target.value)}
            onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); handleSend() } }}
            placeholder="Type a message..."
            aria-label="Message composer"
          />
          <div className="composer-actions">
            <button type="button" className={recording ? 'recording' : ''} aria-label={recording ? 'Send voice note' : 'Record voice note'} onClick={handleVoiceNote}><Icon name="mic" /></button>
            <button type="button" aria-label="Add reaction" onClick={() => onInputChange(messageInput ? `${messageInput} :)` : ':)')}><Icon name="smile" /></button>
            <button
              ref={sendRef}
              className={`send-button${messageInput.trim() ? '' : ' disabled'}`}
              type="button"
              aria-label="Send message"
              onClick={handleSend}
            >
              <Icon name="send" />
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
