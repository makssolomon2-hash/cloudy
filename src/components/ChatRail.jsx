import { useRef } from 'react'
import gsap from 'gsap'
import { Icon } from './Icon'
import { Avatar } from './Avatar'

const NAV_ITEMS = [
  { id: 'chats',     label: 'Chats',     icon: 'chat'     },
  { id: 'groups',    label: 'Groups',    icon: 'users'    },
  { id: 'calls',     label: 'Calls',     icon: 'phone'    },
  { id: 'contacts',  label: 'Contacts',  icon: 'contact'  },
  { id: 'saved',     label: 'Saved',     icon: 'bookmark' },
  { id: 'settings',  label: 'Settings',  icon: 'gear'     },
]

export function ChatRail({ activeView = 'chats', currentUser, onNavChange, onSignOut }) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const name = currentUser?.name || 'Mike'

  const handleEnter = (el, isActive) => {
    if (reduced || isActive) return
    gsap.to(el, { color: '#00e5ff', duration: 0.16, ease: 'power1.out', overwrite: 'auto' })
  }

  const handleLeave = (el, isActive) => {
    if (reduced || isActive) return
    gsap.to(el, { color: '#8a94a6', duration: 0.16, ease: 'power1.out', overwrite: 'auto' })
  }

  return (
    <aside className="glass-panel flex w-rail flex-col items-center justify-between gap-0 px-2.5 pt-3.5 pb-3">
      <button type="button" className="flex flex-col items-center gap-1 pb-4 text-white" onClick={() => onNavChange?.('dashboard')} aria-label="Dashboard">
        <span className="text-cyan"><Icon name="cloud" size={28} /></span>
        <span className="font-display text-[9px] font-bold tracking-[0.12em] text-muted uppercase">Cloudy</span>
      </button>

      <nav className="flex flex-1 flex-col items-center gap-1 pt-1" aria-label="Sidebar navigation">
        {NAV_ITEMS.map((item) => {
          const isActive = activeView === item.id
          return (
            <button
              key={item.id}
              type="button"
              className={`flex h-12 w-12 items-center justify-center rounded-md border transition-colors ${isActive ? 'border-cyan/18 bg-cyan/10 text-cyan shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]' : 'border-transparent text-muted'}`}
              aria-label={item.label}
              onClick={() => onNavChange?.(item.id)}
              onMouseEnter={(e) => handleEnter(e.currentTarget, isActive)}
              onMouseLeave={(e) => handleLeave(e.currentTarget, isActive)}
            >
              <Icon name={item.icon} size={18} />
            </button>
          )
        })}
      </nav>

      <div className="flex w-full flex-col items-center gap-2 border-t border-white/6 pt-3.5">
        <Avatar userId="mike" name={name} src={currentUser?.imageUrl} size="sm" online />
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 text-[9px] text-cyan">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
            <span>Online</span>
          </div>
          {onSignOut && (
            <button type="button" className="grid h-6 w-6 place-items-center rounded-sm text-muted transition-colors hover:text-danger" aria-label="Sign out" onClick={onSignOut}>
              <Icon name="logOut" size={13} />
            </button>
          )}
        </div>
      </div>
    </aside>
  )
}
