import { Dashboard } from './Dashboard'
import { ChatList } from './ChatList'
import { Conversation } from './Conversation'

export function DashboardView({ messenger }) {
  return (
    <div className="grid h-full min-h-0 grid-cols-1 gap-2.5 md:grid-cols-2">
      <div className="h-full min-h-0 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.08) transparent' }}>
        <Dashboard onNotify={messenger.notify} />
      </div>
      <div className="hidden h-full min-h-0  gap-2.5 md:grid">
        {/* <ChatList
          threads={messenger.filteredThreads}
          filter={messenger.filter}
          onFilterChange={messenger.setFilter}
          searchTerm={messenger.searchTerm}
          onSearchChange={messenger.setSearchTerm}
          onStartDirectChat={messenger.handleStartDirectChat}
          onOpenGroupModal={() => messenger.setGroupModalOpen(true)}
          selectedThreadId={messenger.selectedThread.id}
          onSelectThread={messenger.handleSelectThread}
        /> */}
        <Conversation
          thread={messenger.selectedThread}
          messages={messenger.selectedMessages}
          messageInput={messenger.messageInput}
          onInputChange={messenger.setMessageInput}
          onSend={messenger.handleSend}
          onBack={() => {}}
          onOpenInfo={() => messenger.setInfoOpen(true)}
          onCall={() => messenger.notify(`Calling ${messenger.selectedThread.name}...`)}
          onVideo={() => messenger.notify(`Starting a video call with ${messenger.selectedThread.name}...`)}
        />
      </div>
    </div>
  )
}
