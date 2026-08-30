import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ChatRail } from './components/ChatRail'
import { ChatList } from './components/ChatList'
import { Conversation } from './components/Conversation'
import { UserInfo } from './components/UserInfo'
import { Settings } from './components/Settings'
import { DashboardView } from './components/DashboardView'
import { WorkspaceView } from './components/WorkspaceView'
import { GroupCreateModal } from './components/GroupCreateModal'
import { Icon } from './components/Icon'
import { useCloudyMessenger } from './hooks/useCloudyMessenger'

gsap.registerPlugin()
gsap.defaults({ ease: 'power3.out', duration: 0.45 })

const MOBILE_TABS = [
  ['chats', 'chat', 'Chats'],
  ['calls', 'phone', 'Calls'],
  ['contacts', 'contact', 'Contacts'],
  ['settings', 'gear', 'Settings'],
]

function App({ currentUser, onSignOut }) {
  const panelRef = useRef(null)
  const viewRef = useRef(null)
  const m = useCloudyMessenger({ viewRef })

  useGSAP(() => {
    gsap.from('.panel', {
      opacity: 0,
      y: m.reduced ? 0 : 16,
      duration: m.reduced ? 0.01 : 0.6,
      stagger: m.reduced ? 0 : 0.06,
    })
  }, { scope: panelRef })

  const viewAreaClass = m.activeView === 'chats'
    ? `grid min-h-0 min-w-0 gap-2.5 overflow-hidden max-md:grid-cols-1 max-md:gap-0 ${m.infoOpen ? 'grid-cols-[var(--spacing-list)_minmax(0,1fr)_var(--spacing-info)] max-lg:grid-cols-[var(--spacing-list)_minmax(0,1fr)]' : 'grid-cols-[var(--spacing-list)_minmax(0,1fr)]'}`
    : m.activeView === 'settings'
      ? 'grid min-h-0 min-w-0 gap-2.5 overflow-hidden grid-cols-[240px_minmax(0,1fr)] max-md:grid-cols-1'
      : 'grid min-h-0 min-w-0 overflow-y-auto'

  return (
    <div className="relative flex h-dvh w-screen items-stretch overflow-hidden max-md:items-start" ref={panelRef}>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 15% 0%, rgba(0,229,255,0.13), transparent), radial-gradient(ellipse 50% 60% at 92% 100%, rgba(0,194,199,0.09), transparent), var(--color-bg)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-55"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.028) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.028) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black, transparent)',
        }}
      />
      <div className="pointer-events-none absolute -top-20 -left-30 h-[480px] w-[480px] rounded-full bg-cyan/14 opacity-55 blur-[130px]" />
      <div className="pointer-events-none absolute -right-20 -bottom-25 h-[560px] w-[560px] rounded-full bg-cyan-deep/9 opacity-55 blur-[130px]" />

      <div className="panel relative z-1 grid h-full w-full grid-cols-[var(--spacing-rail)_minmax(0,1fr)] gap-2.5 p-3 max-md:grid-cols-1 max-md:grid-rows-[1fr_auto] max-md:gap-0 max-md:p-0">
        <ChatRail
          activeView={m.activeView}
          currentUser={currentUser}
          onNavChange={m.handleNavChange}
          onSignOut={onSignOut}
        />

        <div className={viewAreaClass} ref={viewRef}>
          {m.activeView === 'chats' && (
            <>
              <ChatList
                threads={m.filteredThreads}
                filter={m.filter}
                onFilterChange={m.setFilter}
                searchTerm={m.searchTerm}
                onSearchChange={m.setSearchTerm}
                onStartDirectChat={m.handleStartDirectChat}
                onOpenGroupModal={() => m.setGroupModalOpen(true)}
                selectedThreadId={m.selectedThread.id}
                onSelectThread={m.handleSelectThread}
                hiddenOnMobile={m.mobileView === 'chat'}
              />
              <Conversation
                thread={m.selectedThread}
                messages={m.selectedMessages}
                messageInput={m.messageInput}
                onInputChange={m.setMessageInput}
                onSend={m.handleSend}
                onBack={() => m.setMobileView('list')}
                onOpenInfo={() => m.setInfoOpen(true)}
                onCall={() => m.notify(`Calling ${m.selectedThread.name}...`)}
                onVideo={() => m.notify(`Starting a video call with ${m.selectedThread.name}...`)}
                hiddenOnMobile={m.mobileView === 'list'}
              />
              {m.infoOpen && (
                <UserInfo
                  thread={m.selectedThread}
                  onClose={() => m.setInfoOpen(false)}
                  onCall={() => m.notify(`Calling ${m.selectedThread.name}...`)}
                  onVideo={() => m.notify(`Starting a video call with ${m.selectedThread.name}...`)}
                  onBlock={m.handleBlockThread}
                  onNotify={m.notify}
                />
              )}
            </>
          )}
          {m.activeView === 'settings' && <Settings onNotify={m.notify} />}
          {m.activeView === 'dashboard' && <DashboardView messenger={m} />}
          {['groups', 'calls', 'contacts', 'saved'].includes(m.activeView) && (
            <WorkspaceView
              view={m.activeView}
              threads={m.threads}
              onOpenThread={m.handleOpenThread}
              onCreateGroup={() => m.setGroupModalOpen(true)}
              onNotify={m.notify}
            />
          )}
        </div>
      </div>

      {m.notice && (
        <div role="status" className="glass-panel fixed top-6 right-6 z-[120] max-w-[min(340px,calc(100vw-32px))] p-3.75 text-[13px] text-white" style={{ animation: 'toast-in 0.3s ease-out both' }}>
          {m.notice}
        </div>
      )}

      {m.groupModalOpen && (
        <GroupCreateModal onClose={() => m.setGroupModalOpen(false)} onCreate={m.handleCreateGroup} />
      )}

      <nav className="fixed bottom-3 left-1/2 z-100 hidden w-[calc(100vw-24px)] -translate-x-1/2 max-md:flex" aria-label="Mobile navigation">
        <div className="glass-panel flex w-full justify-around p-1.5">
          {MOBILE_TABS.map(([viewId, icon, label]) => (
            <button
              key={label}
              type="button"
              className={`flex min-w-15 flex-col items-center gap-1 rounded-md px-4 py-1.5 text-[10px] font-medium transition-colors ${m.activeView === viewId ? 'bg-cyan/8 text-cyan' : 'text-muted'}`}
              aria-label={label}
              onClick={() => m.handleNavChange(viewId)}
            >
              <Icon name={icon} size={20} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}

export default App

