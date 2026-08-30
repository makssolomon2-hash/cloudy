import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { Icon } from './Icon'
import { Avatar, GroupAvatar } from './Avatar'
import { CONTACTS } from '../data/contacts'

export function ChatList({ threads, filter, onFilterChange, searchTerm, onSearchChange, onStartDirectChat, onOpenGroupModal, selectedThreadId, onSelectThread, hiddenOnMobile = false }) {
  const badgeRefs = useRef({})
  const searchRef = useRef(null)
  const [newChatOpen, setNewChatOpen] = useState(false)
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
    <aside className={`glass-panel relative flex flex-col overflow-hidden p-3 max-md:absolute max-md:inset-0 max-md:bottom-[72px] max-md:z-20 max-md:rounded-none ${hiddenOnMobile ? 'max-md:hidden' : ''}`}>
      <div className="mb-3 flex shrink-0 items-center justify-between">
        <h2 className="font-display text-[1.7rem] leading-none font-bold tracking-tight text-white">Chats</h2>
        <div className="flex items-center gap-2">
          <button type="button" aria-label="Focus chat search" className="grid h-8 w-8 place-items-center rounded-sm border border-white/8 bg-white/[0.02] text-muted transition-colors hover:text-white" onClick={() => searchRef.current?.focus()}><Icon name="search" /></button>
          <button type="button" aria-label="Start a new chat" className="grid h-8 w-8 place-items-center rounded-sm border border-white/8 bg-white/[0.02] text-muted transition-colors hover:text-white" onClick={() => setNewChatOpen((open) => !open)}><Icon name="plus" /></button>
        </div>
      </div>

      {newChatOpen && (
        <div role="menu" aria-label="New chat options" className="glass-panel absolute top-14 right-3 z-10 grid w-64 gap-0.5 p-1.5">
          <span className="px-2 pt-1 pb-1.5 text-[10px] font-semibold tracking-[0.1em] text-muted uppercase">Message someone</span>
          {CONTACTS.map((contact) => (
            <button
              key={contact.id}
              type="button"
              role="menuitem"
              className="flex items-center gap-2.5 rounded-sm px-2 py-2 text-left text-sm text-white transition-colors hover:bg-cyan/10 hover:text-cyan"
              onClick={() => { setNewChatOpen(false); onStartDirectChat(contact) }}
            >
              <Avatar userId={contact.id} name={contact.name} size="xs" online={contact.online} />
              <span className="min-w-0 flex-1 truncate">{contact.name}</span>
            </button>
          ))}
          <div className="my-1 h-px bg-white/6" />
          <button
            type="button"
            role="menuitem"
            className="flex items-center gap-2.5 rounded-sm px-2 py-2 text-left text-sm font-semibold text-cyan transition-colors hover:bg-cyan/10"
            onClick={() => { setNewChatOpen(false); onOpenGroupModal() }}
          >
            <Icon name="users" />
            <span>Create a group</span>
          </button>
        </div>
      )}

      <div className="glass-input mb-3 flex shrink-0 items-center gap-2 px-3 py-2.5">
        <Icon name="search" className="text-muted" />
        <input
          ref={searchRef}
          type="search"
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search chats"
          aria-label="Search chats"
          className="min-w-0 flex-1 bg-transparent text-[13px] text-white placeholder:text-muted"
        />
      </div>

      <div className="mb-3 flex shrink-0 gap-1.5" aria-label="Thread filters">
        {['all', 'unread', 'groups'].map((option) => (
          <button
            key={option}
            type="button"
            className={`flex-1 rounded-sm border px-1.5 py-2 text-xs font-medium transition-colors ${filter === option ? 'border-transparent bg-gradient-to-b from-cyan to-cyan-deep font-semibold text-cyan-ink shadow-glow' : 'border-white/8 text-muted'}`}
            onClick={() => onFilterChange(option)}
          >
            {option === 'all' ? 'All' : option === 'unread' ? 'Unread' : 'Groups'}
          </button>
        ))}
      </div>

      <div className="flex flex-1 flex-col gap-0.5 overflow-y-auto overflow-x-hidden" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.08) transparent' }} role="list">
        {threads.length === 0 && <div className="m-auto text-center text-[13px] text-muted">No chats match this view.</div>}
        {threads.map((thread) => (
          <button
            key={thread.id}
            type="button"
            className={`flex min-h-16 items-center gap-3 rounded-md border px-3 py-2.5 text-left text-white transition-colors ${thread.id === selectedThreadId ? 'border-cyan/14 bg-white/[0.04]' : 'border-transparent hover:bg-white/[0.03]'}`}
            onClick={() => onSelectThread(thread.id)}
          >
            {thread.group
              ? <GroupAvatar size="sm" />
              : <Avatar userId={thread.id} name={thread.name} size="sm" online={thread.online} isSelf={thread.isSelf} />
            }
            <div className="min-w-0 flex-1">
              <div className="mb-0.5 flex items-center justify-between gap-1.5">
                <strong className="truncate text-[13.5px] font-semibold">{thread.name}</strong>
                <span className="shrink-0 text-[11px] whitespace-nowrap text-muted">{thread.time}</span>
              </div>
              <div className="flex items-center justify-between gap-1.5">
                {thread.typing
                  ? <TypingIndicator />
                  : <span className="truncate text-xs text-muted">{thread.preview}</span>
                }
                {thread.unread > 0
                  ? <span ref={(el) => { badgeRefs.current[thread.id] = el }} className="inline-flex h-[18px] min-w-[18px] shrink-0 items-center justify-center rounded-full bg-cyan px-1.5 text-[10px] font-bold text-cyan-ink">{thread.unread}</span>
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
    <span className="inline-flex h-3.5 items-center gap-0.5 text-cyan">
      <span ref={d1} className="inline-block h-1 w-1 rounded-full bg-cyan" />
      <span ref={d2} className="inline-block h-1 w-1 rounded-full bg-cyan" />
      <span ref={d3} className="inline-block h-1 w-1 rounded-full bg-cyan" />
    </span>
  )
}
