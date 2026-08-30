import { useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { baseThreads } from '../data/threads'
import { baseMessages } from '../data/messages'

function cloneMessages() {
  return typeof structuredClone === 'function'
    ? structuredClone(baseMessages)
    : JSON.parse(JSON.stringify(baseMessages))
}

export function useCloudyMessenger({ viewRef }) {
  const [threads, setThreads] = useState(baseThreads)
  const [selectedThreadId, setSelectedThreadId] = useState('mike')
  const [messageInput, setMessageInput] = useState('')
  const [filter, setFilter] = useState('all')
  const [infoOpen, setInfoOpen] = useState(true)
  const [mobileView, setMobileView] = useState('list')
  const [activeView, setActiveView] = useState('chats')
  const [searchTerm, setSearchTerm] = useState('')
  const [notice, setNotice] = useState('')
  const [groupModalOpen, setGroupModalOpen] = useState(false)
  const messageStoreRef = useRef(cloneMessages())
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (!notice) return undefined
    const timeout = window.setTimeout(() => setNotice(''), 2600)
    return () => window.clearTimeout(timeout)
  }, [notice])

  const notify = (message) => setNotice(message)

  const handleNavChange = (viewId) => {
    if (viewId === activeView) return
    if (!reduced && viewRef?.current) {
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

  const selectedMessages = messageStoreRef.current[selectedThread.id] ?? []

  const handleSend = (draft = messageInput) => {
    const trimmed = draft.trim()
    if (!trimmed) return

    const time = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    const activeThread = selectedThread.id
    const nextMessage = { text: trimmed, side: 'me', time }

    messageStoreRef.current[activeThread] = [...(messageStoreRef.current[activeThread] ?? []), nextMessage]
    setThreads((currentThreads) => currentThreads.map((thread) => (
      thread.id === activeThread ? { ...thread, preview: trimmed, time, unread: 0 } : thread
    )))
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

  const handleOpenThread = (id) => {
    handleSelectThread(id)
    setActiveView('chats')
  }

  const handleStartDirectChat = (contact) => {
    setThreads((currentThreads) => (
      currentThreads.some((thread) => thread.id === contact.id)
        ? currentThreads
        : [
          { id: contact.id, name: contact.name, preview: 'Say hello 👋', time: 'now', unread: 0, online: contact.online, group: false },
          ...currentThreads,
        ]
    ))
    handleOpenThread(contact.id)
    notify(`Chat with ${contact.name} is ready`)
  }

  const handleCreateGroup = ({ name, memberIds }) => {
    const id = `group-${name.toLocaleLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`
    const nextThread = {
      id, name, preview: `You created "${name}"`, time: 'now', unread: 0, online: true, group: true, members: memberIds,
    }

    messageStoreRef.current[id] = [
      { text: `You created the group "${name}" and shared it with ${memberIds.length} people.`, side: 'other', time: 'now' },
    ]
    setThreads((currentThreads) => [nextThread, ...currentThreads])
    setGroupModalOpen(false)
    handleOpenThread(id)
    notify(`"${name}" created and shared with ${memberIds.length} people`)
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

  return {
    threads, filteredThreads, selectedThread, selectedMessages,
    messageInput, setMessageInput, filter, setFilter,
    infoOpen, setInfoOpen, mobileView, setMobileView,
    activeView, setActiveView, searchTerm, setSearchTerm,
    notice, notify, reduced,
    groupModalOpen, setGroupModalOpen,
    handleNavChange, handleSend, handleSelectThread, handleOpenThread,
    handleStartDirectChat, handleCreateGroup, handleBlockThread,
  }
}
