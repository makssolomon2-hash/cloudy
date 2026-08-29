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
    <aside className="rail glass-panel">
      <button type="button" className="brand-mark" onClick={() => onNavChange?.('dashboard')} aria-label="Dashboard">
        <span className="mark-cloud"><Icon name="cloud" /></span>
        <span className="brand-text">Cloudy</span>
      </button>

      <nav className="rail-nav" aria-label="Sidebar navigation">
        {NAV_ITEMS.map((item) => {
          const isActive = activeView === item.id
          return (
            <button
              key={item.id}
              type="button"
              className={`rail-item${isActive ? ' active' : ''}`}
              aria-label={item.label}
              onClick={() => onNavChange?.(item.id)}
              onMouseEnter={(e) => handleEnter(e.currentTarget, isActive)}
              onMouseLeave={(e) => handleLeave(e.currentTarget, isActive)}
            >
              <Icon name={item.icon} />
            </button>
          )
        })}
      </nav>

      <div className="user-card">
        <Avatar userId="mike" name={name} src={currentUser?.imageUrl} size="sm" online />
        <div className="user-card-meta">
          <div className="user-status">
            <span className="status-dot" />
            <span>Online</span>
          </div>
          {onSignOut && (
            <button type="button" className="rail-signout" aria-label="Sign out" onClick={onSignOut}>
              <Icon name="logOut" />
            </button>
          )}
        </div>
      </div>
    </aside>
  )
}
