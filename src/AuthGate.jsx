import { useEffect, useState } from 'react'
import {
  SignIn,
  SignUp,
  Show,
  useClerk,
  useUser,
} from '@clerk/react'
import { Icon } from './components/Icon'

const clerkAppearance = {
  variables: {
    colorPrimary: '#00E5FF',
    colorPrimaryForeground: '#041114',
    colorBackground: 'rgba(15,19,27,0.72)',
    colorForeground: '#FFFFFF',
    colorMutedForeground: '#8A94A6',
    colorInput: 'rgba(255,255,255,0.04)',
    colorInputForeground: '#FFFFFF',
    colorBorder: 'rgba(255,255,255,0.1)',
    borderRadius: '14px',
    fontFamily: 'Inter, sans-serif',
  },
  elements: {
    card: '!w-full !shadow-none !border-0 !bg-transparent',
    formButtonPrimary: '!bg-gradient-to-b !from-cyan !to-cyan-deep !text-cyan-ink !shadow-glow',
    formFieldInput: '!text-white !border-white/10',
    footerActionLink: '!text-cyan',
  },
}

function AtmosphereBackdrop() {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 58% 55% at 15% 0%, rgba(0,229,255,0.13), transparent), radial-gradient(ellipse 48% 56% at 92% 100%, rgba(0,194,199,0.09), transparent), var(--color-bg)' }}
      />
      <div className="pointer-events-none absolute -top-20 -left-30 h-[480px] w-[480px] rounded-full bg-cyan/14 opacity-55 blur-[130px]" />
      <div className="pointer-events-none absolute -right-20 -bottom-25 h-[560px] w-[560px] rounded-full bg-cyan-deep/9 opacity-55 blur-[130px]" />
    </>
  )
}

function Brand() {
  return (
    <div className="max-w-[290px] max-md:max-w-none max-md:text-center">
      <span className="mb-4.5 inline-grid h-13 w-13 place-items-center rounded-full border border-cyan/22 bg-cyan/6 text-cyan shadow-[0_0_34px_rgba(0,229,255,0.16),inset_0_1px_0_rgba(255,255,255,0.18)] max-md:mb-3">
        <Icon name="cloud" size={27} />
      </span>
      <h1 className="font-display text-[36px] font-bold tracking-tight text-white max-md:text-[30px]">Cloudy</h1>
      <p className="mt-1.5 text-sm text-muted">Stay connected, securely.</p>
    </div>
  )
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
    <main className="relative grid min-h-dvh place-items-center overflow-hidden p-6 max-md:items-start max-md:overflow-y-auto max-md:p-4 max-md:pt-19">
      <AtmosphereBackdrop />
      <section className="relative z-1 grid w-[min(920px,100%)] grid-cols-[minmax(220px,0.8fr)_minmax(360px,420px)] items-center gap-[clamp(56px,9vw,150px)] max-md:max-w-[420px] max-md:grid-cols-1 max-md:gap-7">
        <Brand />
        <div className="glass-panel overflow-visible p-3 max-md:p-2.25">
          <div className="grid grid-cols-2 gap-1 rounded-md bg-white/3.5 p-1" role="tablist" aria-label="Authentication choice">
            <button type="button" role="tab" aria-selected={mode === 'signIn'} className={`min-h-9.5 rounded-sm text-[13px] font-semibold ${mode === 'signIn' ? 'bg-gradient-to-b from-cyan to-cyan-deep text-cyan-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]' : 'text-muted'}`} onClick={() => show('signIn')}>Sign in</button>
            <button type="button" role="tab" aria-selected={mode === 'signUp'} className={`min-h-9.5 rounded-sm text-[13px] font-semibold ${mode === 'signUp' ? 'bg-gradient-to-b from-cyan to-cyan-deep text-cyan-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]' : 'text-muted'}`} onClick={() => show('signUp')}>Create account</button>
          </div>
          <div className="mt-2">
            {mode === 'signUp'
              ? <SignUp appearance={clerkAppearance} routing="virtual" signInUrl="#/sign-in" />
              : <SignIn appearance={clerkAppearance} routing="virtual" signUpUrl="#/sign-up" />
            }
          </div>
        </div>
      </section>
    </main>
  )
}

export function AuthConfigurationRequired() {
  return (
    <main className="relative grid min-h-dvh place-items-center overflow-hidden p-6">
      <AtmosphereBackdrop />
      <section className="relative z-1 grid w-[min(920px,100%)] grid-cols-[minmax(220px,0.8fr)_minmax(360px,420px)] items-center gap-[clamp(56px,9vw,150px)] max-md:max-w-[420px] max-md:grid-cols-1 max-md:gap-7">
        <Brand />
        <div className="glass-panel max-w-[420px] p-8 max-md:p-6">
          <span className="mb-5 grid h-10.5 w-10.5 place-items-center rounded-full border border-cyan/20 bg-cyan/7 text-cyan">
            <Icon name="lock" size={20} />
          </span>
          <h2 className="font-display text-xl font-bold tracking-tight text-white">Authentication needs configuration</h2>
          <p className="mt-2.25 text-[13px] leading-relaxed text-muted">
            Add your Clerk publishable key to <code className="rounded-[5px] bg-white/8 px-1.5 py-0.5 font-mono text-[11px] text-white">.env</code> using <code className="rounded-[5px] bg-white/8 px-1.5 py-0.5 font-mono text-[11px] text-white">.env.example</code>, then restart the Vite server.
          </p>
        </div>
      </section>
    </main>
  )
}

function AuthenticatedApp({ App }) {
  const { isLoaded, user } = useUser()
  const { signOut } = useClerk()

  if (!isLoaded) {
    return <main className="relative min-h-dvh" aria-busy="true"><AtmosphereBackdrop /></main>
  }

  const name = user.fullName || user.username || user.primaryEmailAddress?.emailAddress?.split('@')[0] || 'Cloudy member'

  return (
    <App
      currentUser={{ imageUrl: user.imageUrl, name }}
      onSignOut={() => signOut({ redirectUrl: '/' })}
    />
  )
}

export function AuthGate({ App }) {
  return (
    <>
      <Show when="signed-out"><AuthScreen /></Show>
      <Show when="signed-in"><AuthenticatedApp App={App} /></Show>
    </>
  )
}
