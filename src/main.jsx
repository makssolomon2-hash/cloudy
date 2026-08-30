import { ClerkProvider } from '@clerk/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthGate, AuthConfigurationRequired } from './AuthGate.jsx'
import App from './App.jsx'
import './index.css'

const authEnabled = import.meta.env.VITE_AUTH_ENABLED === 'true'
const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

function Root() {
  if (!authEnabled) return <App currentUser={{ name: 'Mike' }} />
  if (!publishableKey) return <AuthConfigurationRequired />

  return (
    <ClerkProvider publishableKey={publishableKey} afterSignOutUrl="/">
      <AuthGate App={App} />
    </ClerkProvider>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>
)
