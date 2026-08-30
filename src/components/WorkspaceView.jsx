import { Avatar, GroupAvatar } from './Avatar'
import { Icon } from './Icon'
import { CONTACTS, CALLS } from '../data/contacts'

const VIEW_META = {
  groups: { title: 'Groups', subtitle: 'Your active creative spaces' },
  calls: { title: 'Calls', subtitle: 'Recent and ongoing conversations' },
  contacts: { title: 'Contacts', subtitle: 'The people in your Cloudy network' },
  saved: { title: 'Saved', subtitle: 'Keep the good ideas close' },
}

export function WorkspaceView({ view, threads, onOpenThread, onCreateGroup, onNotify }) {
  const meta = VIEW_META[view]
  const groupThreads = threads.filter((thread) => thread.group)

  return (
    <main className="glass-panel min-h-[calc(100%-12px)] p-6">
      <header className="flex items-start justify-between gap-4.5 border-b border-white/6 pb-5">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">{meta.title}</h2>
          <p className="mt-1 text-[13px] text-muted">{meta.subtitle}</p>
        </div>
        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-full bg-cyan text-cyan-ink shadow-glow"
          onClick={() => (view === 'groups' ? onCreateGroup?.() : onNotify?.(`${meta.title} creation is ready`))}
          aria-label={`Create ${meta.title.toLocaleLowerCase()}`}
        >
          <Icon name="plus" size={19} />
        </button>
      </header>

      {view === 'groups' && (
        <div className="mt-4.5 grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-3">
          {groupThreads.map((thread) => (
            <article key={thread.id} className="glass-input grid grid-cols-[auto_1fr] gap-3 p-3.5">
              <GroupAvatar size="lg" />
              <div className="min-w-0">
                <strong className="block text-sm text-white">{thread.name}</strong>
                <span className="mt-0.5 block truncate text-xs text-muted">{thread.preview}</span>
              </div>
              <button type="button" className="col-span-full text-cyan" onClick={() => onOpenThread(thread.id)}>Open chat</button>
            </article>
          ))}
        </div>
      )}

      {view === 'contacts' && (
        <div className="mt-3.5 grid">
          {CONTACTS.map((contact) => (
            <article key={contact.id} className="flex items-center gap-3 border-b border-white/6 py-3.5">
              <Avatar userId={contact.id} name={contact.name} size="sm" online={contact.online} />
              <div className="min-w-0 flex-1">
                <strong className="block text-sm text-white">{contact.name}</strong>
                <span className="mt-0.5 block truncate text-xs text-muted">{contact.note}</span>
              </div>
              <button type="button" className="min-w-10 text-cyan" onClick={() => onOpenThread(contact.id)}>Message</button>
            </article>
          ))}
        </div>
      )}

      {view === 'calls' && (
        <div className="mt-3.5 grid">
          {CALLS.map((call) => (
            <article key={`${call.id}-${call.time}`} className="flex items-center gap-3 border-b border-white/6 py-3.5">
              {call.group ? <GroupAvatar size="sm" /> : <Avatar userId={call.id} name={call.name} size="sm" online={call.online} />}
              <div className="min-w-0 flex-1">
                <strong className="block text-sm text-white">{call.name}</strong>
                <span className="mt-0.5 block truncate text-xs text-muted">{call.direction} - {call.time}</span>
              </div>
              <button type="button" className="min-w-10 text-cyan" aria-label={`Call ${call.name}`} onClick={() => onNotify?.(`Calling ${call.name}...`)}><Icon name="phone" size={17} /></button>
            </article>
          ))}
        </div>
      )}

      {view === 'saved' && (
        <div className="mt-3.5 grid gap-2.5">
          {[
            { id: 'design', from: 'Design Team', text: 'The new screens are ready for review.', time: '9:10 AM' },
            { id: 'mike', from: 'Mike', text: 'I am putting my best foot forward.', time: '9:43 AM' },
            { id: 'anna', from: 'Anna', text: 'I found a place with amazing coffee and live music.', time: 'Yesterday' },
          ].map((message) => (
            <article key={message.text} className="glass-input p-3.75">
              <div className="flex justify-between gap-3 text-xs text-white"><strong>{message.from}</strong><span className="whitespace-nowrap text-muted">{message.time}</span></div>
              <p className="my-2.25 text-sm leading-normal">{message.text}</p>
              <button type="button" className="text-cyan" onClick={() => onOpenThread(message.id)}>Open chat</button>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}