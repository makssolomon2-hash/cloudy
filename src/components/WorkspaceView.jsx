import { Avatar, GroupAvatar } from './Avatar'
import { Icon } from './Icon'

const CONTACTS = [
  { id: 'mike', name: 'Mike', online: true, note: 'Sound engineer' },
  { id: 'anna', name: 'Anna', online: false, note: 'Design lead' },
  { id: 'alex', name: 'Alex', online: true, note: 'Product team' },
  { id: 'david', name: 'David', online: false, note: 'Creative director' },
  { id: 'emma', name: 'Emma', online: true, note: 'Available now' },
]

const CALLS = [
  { id: 'anna', name: 'Anna', time: 'Today, 09:18', direction: 'Outgoing', online: false },
  { id: 'design', name: 'Design Team', time: 'Yesterday, 16:42', direction: 'Group call', group: true, online: true },
  { id: 'david', name: 'David', time: 'Saturday, 20:05', direction: 'Missed call', online: false },
]

const VIEW_META = {
  groups: { title: 'Groups', subtitle: 'Your active creative spaces' },
  calls: { title: 'Calls', subtitle: 'Recent and ongoing conversations' },
  contacts: { title: 'Contacts', subtitle: 'The people in your Cloudy network' },
  saved: { title: 'Saved', subtitle: 'Keep the good ideas close' },
}

export function WorkspaceView({ view, threads, onOpenThread, onNotify }) {
  const meta = VIEW_META[view]
  const groupThreads = threads.filter((thread) => thread.group)

  return (
    <main className="workspace-view glass-panel">
      <header className="workspace-header">
        <div>
          <h2>{meta.title}</h2>
          <p>{meta.subtitle}</p>
        </div>
        <button type="button" className="workspace-create" onClick={() => onNotify?.(`${meta.title} creation is ready`)} aria-label={`Create ${meta.title.toLocaleLowerCase()}`}>
          <Icon name="plus" />
        </button>
      </header>

      {view === 'groups' && (
        <div className="workspace-grid">
          {groupThreads.map((thread) => (
            <article key={thread.id} className="workspace-card glass-input">
              <GroupAvatar size="lg" />
              <div className="workspace-card-copy"><strong>{thread.name}</strong><span>{thread.preview}</span></div>
              <button type="button" onClick={() => onOpenThread(thread.id)}>Open chat</button>
            </article>
          ))}
        </div>
      )}

      {view === 'contacts' && (
        <div className="workspace-list">
          {CONTACTS.map((contact) => (
            <article key={contact.id} className="workspace-row">
              <Avatar userId={contact.id} name={contact.name} size="sm" online={contact.online} />
              <div><strong>{contact.name}</strong><span>{contact.note}</span></div>
              <button type="button" onClick={() => onOpenThread(contact.id)}>Message</button>
            </article>
          ))}
        </div>
      )}

      {view === 'calls' && (
        <div className="workspace-list">
          {CALLS.map((call) => (
            <article key={`${call.id}-${call.time}`} className="workspace-row">
              {call.group ? <GroupAvatar size="sm" /> : <Avatar userId={call.id} name={call.name} size="sm" online={call.online} />}
              <div><strong>{call.name}</strong><span>{call.direction} - {call.time}</span></div>
              <button type="button" aria-label={`Call ${call.name}`} onClick={() => onNotify?.(`Calling ${call.name}...`)}><Icon name="phone" /></button>
            </article>
          ))}
        </div>
      )}

      {view === 'saved' && (
        <div className="saved-stack">
          {[
            { id: 'design', from: 'Design Team', text: 'The new screens are ready for review.', time: '9:10 AM' },
            { id: 'mike', from: 'Mike', text: 'I am putting my best foot forward.', time: '9:43 AM' },
            { id: 'anna', from: 'Anna', text: 'I found a place with amazing coffee and live music.', time: 'Yesterday' },
          ].map((message) => (
            <article key={message.text} className="saved-message glass-input">
              <div className="saved-meta"><strong>{message.from}</strong><span>{message.time}</span></div>
              <p>{message.text}</p>
              <button type="button" onClick={() => onOpenThread(message.id)}>Open chat</button>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}