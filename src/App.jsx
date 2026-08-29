import { useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ChatRail } from './components/ChatRail'
import { ChatList } from './components/ChatList'
import { Conversation } from './components/Conversation'
import { UserInfo } from './components/UserInfo'
import { Settings } from './components/Settings'
import { Dashboard } from './components/Dashboard'
import { WorkspaceView } from './components/WorkspaceView'
import { Icon } from './components/Icon'

gsap.registerPlugin()
gsap.defaults({ ease: 'power3.out', duration: 0.45 })

const baseThreads = [
  { id: 'mike', name: 'Mike', preview: 'Hello! How are you?', time: '9:41 AM', unread: 2, online: true, group: false },
  { id: 'anna', name: 'Anna', preview: "Let's catch up soon.", time: '9:30 AM', unread: 1, online: false, group: false },
  { id: 'design', name: 'Design Team', preview: 'John: New update is out!', time: '9:12 AM', unread: 0, online: true, group: true },
  { id: 'alex', name: 'Alex', preview: 'Thanks!', time: 'Yesterday', unread: 0, online: false, group: false },
  { id: 'marketing', name: 'Marketing', preview: 'Sophie: Great work!', time: 'Yesterday', unread: 0, online: true, group: true },
  { id: 'david', name: 'David', preview: 'See you tomorrow.', time: 'Saturday', unread: 0, online: false, group: false },
  { id: 'emma', name: 'Emma', preview: 'Typing…', time: 'Saturday', unread: 0, typing: true, online: true, group: false },
]

const messageMap = {
  mike: [
    { text: 'Hello my dear friend!', side: 'other', time: '9:41 AM' },
    { text: 'How are you today?', side: 'other', time: '9:41 AM' },
    { text: 'Hello my friend, my heart is so broken now...', side: 'me', time: '9:42 AM' },
    { text: 'From grammar and spelling to style and tone, Grammarly\'s suggestions are comprehensive, helping you communicate effectively and as you intend.', side: 'me', time: '9:43 AM' },
    { text: "I'm putting my best foot forward. Grammarly is like a little superpower, especially when I need to be at 110%.", side: 'other', time: '9:43 AM' },
  ],
  anna: [
    { text: 'We should definitely do lunch this week.', side: 'other', time: '9:29 AM' },
    { text: 'I found a place with amazing coffee and live music.', side: 'me', time: '9:30 AM' },
    { text: 'Perfect — I am in.', side: 'other', time: '9:31 AM' },
  ],
  design: [
    { text: 'The new screens are ready for review.', side: 'other', time: '9:10 AM' },
    { text: 'Looks a lot cleaner now. I like the cyan glow.', side: 'me', time: '9:11 AM' },
    { text: 'Nice. We are shipping this afternoon.', side: 'other', time: '9:12 AM' },
  ],
  alex: [
    { text: 'Can you send the final files?', side: 'other', time: 'Yesterday' },
    { text: 'Yep — just uploaded them.', side: 'me', time: 'Yesterday' },
  ],
  marketing: [
    { text: 'Campaign assets are almost done.', side: 'other', time: 'Yesterday' },
    { text: 'Awesome. We can move this into launch.', side: 'me', time: 'Yesterday' },
  ],
  david: [
    { text: 'See you tomorrow for rehearsal.', side: 'other', time: 'Saturday' },
    { text: 'Sounds good. I will be there at 7.', side: 'me', time: 'Saturday' },
  ],
  emma: [
    { text: 'I can join in 10 minutes.', side: 'other', time: 'Saturday' },
    { text: 'No rush — I will keep the room warm.', side: 'me', time: 'Saturday' },
  ],
  sophie: [
    { text: 'Hey Mike, I saved a few campaign notes for us.', side: 'other', time: '10:42 AM' },
  ],
}

function App({ currentUser, onSignOut }) {
  const panelRef = useRef(null)
  const [threads, setThreads] = useState(baseThreads)
  const [selectedThreadId, setSelectedThreadId] = useState('mike')
  const [messageInput, setMessageInput] = useState('')
  const [filter, setFilter] = useState('all')
  const [infoOpen, setInfoOpen] = useState(true)
  const [mobileView, setMobileView] = useState('list')
  const [activeView, setActiveView] = useState('chats')
  const [searchTerm, setSearchTerm] = useState('')
  const [notice, setNotice] = useState('')
  const viewRef = useRef(null)
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (!notice) return undefined
    const timeout = window.setTimeout(() => setNotice(''), 2600)
    return () => window.clearTimeout(timeout)
  }, [notice])

  const notify = (message) => setNotice(message)

  const handleNavChange = (viewId) => {
    if (viewId === activeView) return
    if (!reduced && viewRef.current) {
      gsap.fromTo(viewRef.current, { opacity: 0, x: 10 }, { opacity: 1, x: 0, duration: 0.3 })
    }
    setActiveView(viewId)
    setMobileView('list')
  }

  const filteredThreads = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLocaleLowerCase()
    return threads.filter((thread) => {
      const matchesFilter = filter === 'all'
        || (filter === 'unread' && thread.unread > 0)
        || (filter === 'groups' && thread.group)
      const matchesSearch = !normalizedSearch
        || `${thread.name} ${thread.preview}`.toLocaleLowerCase().includes(normalizedSearch)
      return matchesFilter && matchesSearch
    })
  }, [filter, searchTerm, threads])

  const selectedThread = useMemo(
    () => threads.find((thread) => thread.id === selectedThreadId) ?? threads[0],
    [threads, selectedThreadId],
  )

  const selectedMessages = messageMap[selectedThread.id] ?? []

  useGSAP(() => {
    gsap.from('.panel', {
      opacity: 0,
      y: reduced ? 0 : 16,
      duration: reduced ? 0.01 : 0.6,
      stagger: reduced ? 0 : 0.06,
    })
  }, { scope: panelRef })

  const handleSend = (draft = messageInput) => {
    const trimmed = draft.trim()
    if (!trimmed) return

    const time = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })

    const nextMessage = { text: trimmed, side: 'me', time }
    const activeThread = selectedThread.id
    const nextThreads = threads.map((thread) => (
      thread.id === activeThread
        ? { ...thread, preview: trimmed, time, unread: 0 }
        : thread
    ))

    messageMap[activeThread] = [...(messageMap[activeThread] ?? []), nextMessage]
    setThreads(nextThreads)
    setMessageInput('')
  }

  const handleSelectThread = (id) => {
    setSelectedThreadId(id)
    setThreads((currentThreads) => currentThreads.map((thread) => (
      thread.id === id ? { ...thread, unread: 0 } : thread
    )))
    setInfoOpen(true)
    setMobileView('chat')
  }

  const handleCreateThread = () => {
    const existing = threads.find((thread) => thread.id === 'sophie')
    if (!existing) {
      setThreads((currentThreads) => [
        { id: 'sophie', name: 'Sophie', preview: 'Hey Mike, I saved a few campaign notes for us.', time: '10:42 AM', unread: 0, online: true, group: false },
        ...currentThreads,
      ])
    }
    setSelectedThreadId('sophie')
    setActiveView('chats')
    setInfoOpen(true)
    setMobileView('chat')
    notify(existing ? 'Sophie is already in your chats' : 'New conversation with Sophie created')
  }

  const handleOpenThread = (id) => {
    handleSelectThread(id)
    setActiveView('chats')
  }

  const handleBlockThread = (thread) => {
    const remainingThreads = threads.filter((item) => item.id !== thread.id)
    setThreads(remainingThreads)
    if (thread.id === selectedThreadId && remainingThreads.length) {
      setSelectedThreadId(remainingThreads[0].id)
    }
    setInfoOpen(false)
    notify(`${thread.name} was blocked`)
  }

  return (
    <div className="page-shell" ref={panelRef}>
      <div className="bg-glow bg-glow-1" />
      <div className="bg-glow bg-glow-2" />
      <div className="bg-grid" />

      <div className="cloudy-app panel">
        <ChatRail
          activeView={activeView}
          currentUser={currentUser}
          onNavChange={handleNavChange}
          onSignOut={onSignOut}
        />

        <div
          className={`view-area view-${activeView}${activeView === 'chats' && !infoOpen ? ' no-info' : ''}`}
          ref={viewRef}
        >
          {activeView === 'chats' && (
            <>
              <ChatList
                threads={filteredThreads}
                filter={filter}
                onFilterChange={setFilter}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onCreateThread={handleCreateThread}
                selectedThreadId={selectedThread.id}
                onSelectThread={handleSelectThread}
                className={mobileView === 'chat' ? 'mobile-hidden' : ''}
              />
              <Conversation
                thread={selectedThread}
                messages={selectedMessages}
                messageInput={messageInput}
                onInputChange={setMessageInput}
                onSend={handleSend}
                infoOpen={infoOpen}
                onBack={() => setMobileView('list')}
                onOpenInfo={() => setInfoOpen(true)}
                onCall={() => notify(`Calling ${selectedThread.name}...`)}
                onVideo={() => notify(`Starting a video call with ${selectedThread.name}...`)}
                className={mobileView === 'list' ? 'mobile-hidden' : ''}
              />
              {infoOpen && (
                <UserInfo
                  thread={selectedThread}
                  onClose={() => setInfoOpen(false)}
                  onCall={() => notify(`Calling ${selectedThread.name}...`)}
                  onVideo={() => notify(`Starting a video call with ${selectedThread.name}...`)}
                  onBlock={handleBlockThread}
                  onNotify={notify}
                />
              )}
            </>
          )}
          {activeView === 'settings'  && <Settings onNotify={notify} />}
          {activeView === 'dashboard' && <Dashboard onNotify={notify} />}
          {['groups', 'calls', 'contacts', 'saved'].includes(activeView) && (
            <WorkspaceView
              view={activeView}
              threads={threads}
              onOpenThread={handleOpenThread}
              onNotify={notify}
            />
          )}
        </div>
      </div>

      {notice && <div className="toast" role="status">{notice}</div>}

      <nav className="mobile-tabs" aria-label="Mobile navigation">
        <div className="mobile-tabs-inner">
          {[['chats', 'chat', 'Chats'], ['calls', 'phone', 'Calls'], ['contacts', 'contact', 'Contacts'], ['settings', 'gear', 'Settings']].map(([viewId, icon, label]) => (
            <button
              key={label}
              type="button"
              className={`tab-btn${activeView === viewId ? ' active' : ''}`}
              aria-label={label}
              onClick={() => handleNavChange(viewId)}
            >
              <Icon name={icon} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}

export default App

