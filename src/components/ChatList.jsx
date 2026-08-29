import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { Icon } from './Icon'
import { Avatar, GroupAvatar } from './Avatar'

export function ChatList({ threads, filter, onFilterChange, searchTerm, onSearchChange, onCreateThread, selectedThreadId, onSelectThread, className = '' }) {
  const badgeRefs = useRef({})
  const searchRef = useRef(null)
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    threads.forEach((thread) => {
      const el = badgeRefs.current[thread.id]
      if (el && thread.unread > 0 && !reduced) {
        gsap.fromTo(el,
          { scale: 0.4, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.6)', overwrite: true }
        )
      }
    })
  }, [threads, reduced])

  return (
    <aside className={`chat-list glass-panel ${className}`}>
      <div className="panel-header list-header">
        <h2>Chats</h2>
        <div className="header-actions">
          <button type="button" aria-label="Focus chat search" onClick={() => searchRef.current?.focus()}><Icon name="search" /></button>
          <button type="button" aria-label="Create new chat" onClick={onCreateThread}><Icon name="plus" /></button>
        </div>
      </div>

      <div className="search-box glass-input">
        <Icon name="search" />
        <input
          ref={searchRef}
          type="search"
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search chats"
          aria-label="Search chats"
        />
      </div>

      <div className="filter-row" aria-label="Thread filters">
        {['all', 'unread', 'groups'].map((option) => (
          <button
            key={option}
            type="button"
            className={`filter-pill${filter === option ? ' active' : ''}`}
            onClick={() => onFilterChange(option)}
          >
            {option === 'all' ? 'All' : option === 'unread' ? 'Unread' : 'Groups'}
          </button>
        ))}
      </div>

      <div className="thread-list" role="list">
        {threads.length === 0 && <div className="list-empty">No chats match this view.</div>}
        {threads.map((thread) => (
          <button
            key={thread.id}
            type="button"
            className={`thread-item${thread.id === selectedThreadId ? ' active' : ''}`}
            onClick={() => onSelectThread(thread.id)}
          >
            {thread.group
              ? <GroupAvatar size="sm" />
              : <Avatar userId={thread.id} name={thread.name} size="sm" online={thread.online} />
            }
            <div className="thread-copy">
              <div className="thread-topline">
                <strong>{thread.name}</strong>
                <span className="time">{thread.time}</span>
              </div>
              <div className="thread-bottomline">
                {thread.typing
                  ? <TypingIndicator />
                  : <span>{thread.preview}</span>
                }
                {thread.unread > 0
                  ? <span ref={(el) => { badgeRefs.current[thread.id] = el }} className="badge">{thread.unread}</span>
                  : null
                }
              </div>
            </div>
          </button>
        ))}
      </div>
    </aside>
  )
}

function TypingIndicator() {
  const d1 = useRef(null)
  const d2 = useRef(null)
  const d3 = useRef(null)
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (reduced) return
    const tl = gsap.timeline({ repeat: -1 })
    tl.to([d1.current, d2.current, d3.current], {
      y: -3,
      duration: 0.28,
      stagger: 0.12,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: 1,
    })
    return () => tl.kill()
  }, [reduced])

  return (
    <span className="typing-wrap">
      <span ref={d1} className="typing-dot" />
      <span ref={d2} className="typing-dot" />
      <span ref={d3} className="typing-dot" />
    </span>
  )
}
