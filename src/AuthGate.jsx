import { useEffect, useState } from 'react'
import {
  ClerkProvider,
  SignIn,
  SignUp,
  SignedIn,
  SignedOut,
  useClerk,
  useUser,
} from '@clerk/clerk-react'
import App from './App.jsx'
import { Icon } from './components/Icon'

const clerkAppearance = {
  variables: {
    colorPrimary: '#00E5FF',
    colorBackground: 'rgba(15,19,27,0.72)',
    colorInputBackground: 'rgba(255,255,255,0.04)',
    colorText: '#FFFFFF',
    colorTextSecondary: '#8A94A6',
    borderRadius: '14px',
    fontFamily: 'Inter, sans-serif',
  },
  elements: {
    card: 'clerk-card',
    formButtonPrimary: 'clerk-primary',
    formFieldInput: 'clerk-input',
    footerActionLink: 'clerk-link',
  },
}

function AuthScreen() {
  const [mode, setMode] = useState(() => window.location.hash === '#/sign-up' ? 'signUp' : 'signIn')

  useEffect(() => {
    const updateMode = () => setMode(window.location.hash === '#/sign-up' ? 'signUp' : 'signIn')
    window.addEventListener('hashchange', updateMode)
    return () => window.removeEventListener('hashchange', updateMode)
  }, [])

  const show = (nextMode) => {
    window.location.hash = nextMode === 'signUp' ? '/sign-up' : '/sign-in'
  }

  return (
    <main className="auth-shell">
      <div className="bg-glow bg-glow-1" />
      <div className="bg-glow bg-glow-2" />
      <div className="bg-grid" />
      <section className="auth-content">
        <div className="auth-brand">
          <span className="auth-cloud"><Icon name="cloud" /></span>
          <h1>Cloudy</h1>
          <p>Stay connected, securely.</p>
        </div>
        <div className="auth-panel glass-panel">
          <div className="auth-switch" role="tablist" aria-label="Authentication choice">
            <button type="button" role="tab" aria-selected={mode === 'signIn'} className={mode === 'signIn' ? 'active' : ''} onClick={() => show('signIn')}>Sign in</button>
            <button type="button" role="tab" aria-selected={mode === 'signUp'} className={mode === 'signUp' ? 'active' : ''} onClick={() => show('signUp')}>Create account</button>
          </div>
          {mode === 'signUp'
            ? <SignUp appearance={clerkAppearance} routing="virtual" signInUrl="#/sign-in" />
            : <SignIn appearance={clerkAppearance} routing="virtual" signUpUrl="#/sign-up" />
          }
        </div>
      </section>
    </main>
  )
}

function AuthConfigurationRequired() {
  return (
    <main className="auth-shell">
      <div className="bg-glow bg-glow-1" />
      <div className="bg-glow bg-glow-2" />
      <div className="bg-grid" />
      <section className="auth-content">
        <div className="auth-brand">
          <span className="auth-cloud"><Icon name="cloud" /></span>
          <h1>Cloudy</h1>
          <p>Stay connected, securely.</p>
        </div>
        <div className="auth-panel glass-panel auth-config">
          <span className="auth-config-icon"><Icon name="lock" /></span>
          <h2>Authentication needs configuration</h2>
          <p>Add your Clerk publishable key to <code>.env</code> using <code>.env.example</code>, then restart the Vite server.</p>
        </div>
      </section>
    </main>
  )
}

function AuthenticatedApp() {
  const { isLoaded, user } = useUser()
  const { signOut } = useClerk()

  if (!isLoaded) {
    return <main className="auth-shell" aria-busy="true" />
  }

  const name = user.fullName || user.username || user.primaryEmailAddress?.emailAddress?.split('@')[0] || 'Cloudy member'

  return (
    <App
      currentUser={{ imageUrl: user.imageUrl, name }}
      onSignOut={() => signOut({ redirectUrl: '/' })}
    />
  )
}

export function AuthGate() {
  const authEnabled = import.meta.env.VITE_AUTH_ENABLED === 'true'
  const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

  if (!authEnabled) {
    return <App currentUser={{ name: 'Mike' }} />
  }

  if (!publishableKey) {
    return <AuthConfigurationRequired />
  }

  return (
    <ClerkProvider publishableKey={publishableKey} afterSignOutUrl="/">
      <SignedOut><AuthScreen /></SignedOut>
      <SignedIn><AuthenticatedApp /></SignedIn>
    </ClerkProvider>
  )
}