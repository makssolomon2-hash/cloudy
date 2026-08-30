import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Icon } from './Icon'
import { Avatar } from './Avatar'
import { CONTACTS } from '../data/contacts'

export function GroupCreateModal({ onClose, onCreate }) {
  const [name, setName] = useState('')
  const [memberIds, setMemberIds] = useState([])
  const cardRef = useRef(null)
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useGSAP(() => {
    if (reduced) return
    gsap.fromTo(cardRef.current, { opacity: 0, y: 8, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.28, ease: 'power3.out' })
  }, { scope: cardRef })

  useEffect(() => {
    const handleKeyDown = (event) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const toggleMember = (id) => {
    setMemberIds((current) => (
      current.includes(id) ? current.filter((memberId) => memberId !== id) : [...current, id]
    ))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!name.trim()) return
    onCreate({ name: name.trim(), memberIds })
  }

  return (
    <div
      className="fixed inset-0 z-[130] grid place-items-center bg-black/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Create group"
      onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}
    >
      <form ref={cardRef} onSubmit={handleSubmit} className="glass-panel w-full max-w-sm p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold tracking-tight text-white">New group</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="grid h-8 w-8 place-items-center rounded-sm border border-white/8 bg-white/[0.02] text-muted hover:text-white">
            <Icon name="arrowLeft" />
          </button>
        </div>

        <label className="mb-1.5 block text-[11px] font-semibold tracking-[0.1em] text-muted uppercase">Group name</label>
        <input
          autoFocus
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. Poznan Nights"
          className="glass-input mb-4 w-full px-3 py-2.5 text-sm text-white placeholder:text-muted"
        />

        <label className="mb-2 block text-[11px] font-semibold tracking-[0.1em] text-muted uppercase">Share with</label>
        <div className="mb-5 flex max-h-56 flex-col gap-1 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.08) transparent' }}>
          {CONTACTS.map((contact) => {
            const selected = memberIds.includes(contact.id)
            return (
              <button
                type="button"
                key={contact.id}
                onClick={() => toggleMember(contact.id)}
                className={`flex items-center gap-3 rounded-md border px-2 py-2 text-left transition-colors ${selected ? 'border-cyan/20 bg-cyan/10' : 'border-transparent hover:bg-white/[0.03]'}`}
              >
                <Avatar userId={contact.id} name={contact.name} size="xs" online={contact.online} />
                <span className="min-w-0 flex-1 truncate text-sm text-white">{contact.name}</span>
                {selected && <span className="text-cyan"><Icon name="check" /></span>}
              </button>
            )
          })}
        </div>

        <button
          type="submit"
          disabled={!name.trim()}
          className="w-full rounded-sm bg-gradient-to-b from-cyan to-cyan-deep py-2.5 text-sm font-semibold text-cyan-ink shadow-glow disabled:opacity-40 disabled:shadow-none"
        >
          Create &amp; share
        </button>
      </form>
    </div>
  )
}
