# Cloudy — Agent Instructions

> Drop this file in the **project root** as `AGENTS.md`.
> Every agent (Cursor, Copilot, Claude Code, Windsurf, Cline, Continue) MUST read this before writing a single line.
> This file is the source of truth. If a request conflicts with it, follow this file and flag the conflict.

**Product:** Cloudy — a premium, dark, glassmorphic online messenger.
**Tagline (EN):** Stay connected, securely.
**Tagline (UK):** Онлайн месенджер для команди та творчих людей. Швидко. Безпечно. Надійно.
**Pillars:** Modern · Secure · Simple
**This is not a generic chat clone.** Visual quality is the product. If it looks like a Tailwind dashboard template, it is wrong.

---

## 0. How to work in this repo

1. Read this file fully. Then open `src/styles/tokens.css` (or `src/index.css`) and the layout shell before touching a screen.
2. Match the attached design boards (desktop 1440+, mobile 390, settings, fingerprint, dashboard). Pixel-intent, not "inspired by".
3. Frontend is the priority. Motion, glass, typography, spacing, states — these ship before extra backend features.
4. Never invent a second design system. Never introduce a new color, radius, shadow, or font without updating the token file first.
5. Prefer editing existing components over creating new ones. One `Glass`, one `Button`, one `Avatar`, one `MessageBubble`.
6. After any UI change: check **1440×900** and **390×844**. No horizontal scroll. No clipped glass borders. No layout jump.
7. Do not drive-by refactor, do not add README noise, do not add comments that restate the code.

### Language

- **Code, commits, props, files:** English.
- **Product UI copy:** Ukrainian first, English via i18n (`uk` default, `en` fallback).
- **Agent replies to the user:** match the user's language.

---

## 1. Locked stack

Do not replace these. Do not add a second library that does the same job.

| Layer | Choice | Notes |
|---|---|---|
| UI | React 18+ + TypeScript (strict) | Function components only. No class components. |
| Styling | Tailwind CSS v4 + CSS variables | Tokens live in CSS, not scattered hex in JSX. |
| Motion | GSAP 3 + `@gsap/react` (`useGSAP`) | CSS transitions for micro-hover. GSAP for orchestration, mount, page, presence. |
| Auth | Clerk | Hosted components restyled to Cloudy glass. Sessions, passkeys, user profile. |
| Realtime | Socket.IO | Messages, typing, presence, read receipts, calls signaling. |
| State | Zustand (client) + TanStack Query (server/cache) | No Redux. No Context-for-everything. |
| Forms | React Hook Form + Zod | Clerk for identity; RHF for profile/settings. |
| Icons | Lucide React, **stroke 1.5–1.75**, 20px default | Outlined only. No filled icon soup. No emoji as UI icons. |
| Fonts | **Poppins** (display / logo / H1) + **Inter** (UI / chat / body) | Load via `fontsource` or Google, `font-display: swap`. |
| Avatars | Real photo-quality images or generated faces | Never initials-on-gray as the default look. |
| Backend (when needed) | Node + Socket.IO server | Keep API thin. UI must run against mocked data first. |

**Do not add:** Material UI, Chakra, Ant, Bootstrap, styled-components, Framer Motion (GSAP is the motion lib), another auth provider, another CSS-in-JS.

---

## 2. Design north star

Cloudy is a **cinematic dark glass OS for conversation**.

Think: Tesla UI × Telegram × a high-end DAW. Deep space-black canvas, cyan light as the only accent, frosted panels floating over a living atmosphere.

### Atmosphere (the thing behind the glass)

The app is never a flat `#000` slab.

```
Background stack (z from back to front):
1. Base      #070A0E
2. Cyan nebula    radial-gradient at 85% -10%, rgba(0,229,255,0.16), transparent 55%
3. Teal wash      radial-gradient at 10% 110%, rgba(0,194,199,0.08), transparent 50%
4. Fine noise     3–4% opacity, mix-blend overlay, pointer-events none
5. Chat wallpaper faint cloud silhouettes, #00E5FF at 3–5% opacity, large, repeating
6. Glass panels   sit on top of all of this
```

The second design board (the one with the glowing cyan arc and the 68% ring) is the **mood reference**. The first and third boards are the **product chrome reference**. Combine them: chrome from the messenger screens, atmosphere from the glassmorphism board.

### Glassmorphism — non-negotiable recipe

Every panel, card, dropdown, modal, composer, and sidebar is glass. There is no opaque `#1A1F24` brick unless it is a nested well inside glass.

```css
/* src/styles/glass.css — the only glass implementation */

.glass {
  background: linear-gradient(
    165deg,
    rgba(255, 255, 255, 0.055) 0%,
    rgba(255, 255, 255, 0.02) 48%,
    rgba(0, 229, 255, 0.025) 100%
  );
  background-color: rgba(12, 16, 22, 0.62);
  backdrop-filter: blur(28px) saturate(160%);
  -webkit-backdrop-filter: blur(28px) saturate(160%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    0 18px 50px rgba(0, 0, 0, 0.45),
    0 0 0 1px rgba(0, 229, 255, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.10),
    inset 0 -1px 0 rgba(0, 0, 0, 0.25);
  border-radius: var(--r-xl);
}

.glass-tight {
  /* denser, for sidebars and lists */
  background-color: rgba(10, 14, 20, 0.78);
  backdrop-filter: blur(36px) saturate(170%);
  -webkit-backdrop-filter: blur(36px) saturate(170%);
}

.glass-cyan {
  /* primary CTA surfaces, sent bubbles, active nav */
  background: linear-gradient(
    180deg,
    rgba(0, 229, 255, 0.92) 0%,
    rgba(0, 194, 199, 0.88) 100%
  );
  color: #041114;
  border: 1px solid rgba(255, 255, 255, 0.28);
  box-shadow:
    0 8px 28px rgba(0, 229, 255, 0.28),
    inset 0 1px 0 rgba(255, 255, 255, 0.35);
}

.glass-input {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(16px);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.glass-input:focus-within {
  border-color: rgba(0, 229, 255, 0.45);
  box-shadow:
    0 0 0 3px rgba(0, 229, 255, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);
}
```

**Glass rules:**

- Always a **1px top highlight** (`inset 0 1px 0 rgba(255,255,255,.10)`). Without it, glass looks like a gray box.
- Always **blur ≥ 20px**. 8px blur is not glass, it is a stain.
- Nested glass is allowed (card on sidebar) but inner glass uses *less* blur and *higher* opacity so it does not go muddy.
- Hover on glass: lift the highlight and add a 8% cyan border glow — do not raise brightness of the whole panel.
- Reduced-motion: keep the glass, drop the blur to 8px if `prefers-reduced-motion: reduce` (blur is expensive, not motion). Provide a `.glass-static` fallback.

### What "mega stylish" means here

| Do | Don't |
|---|---|
| Cyan as the *only* accent | Purple, indigo, or rainbow gradients |
| One strong glow per screen (nebula or active bubble) | Glow on every button |
| Hairline separators at 6–8% white | 1px solid #333 slabs |
| 12/16/20/24/28 radius scale | Random `rounded-md` / `rounded-3xl` mix |
| Poppins for the wordmark and hero | Poppins for chat messages (use Inter) |
| Status as a 7px cyan disc with 6px soft ring | A green Tailwind `bg-green-500` dot |
| Empty states illustrated with a faint cloud mark | "No data" gray text |
| Sent bubble = cyan glass, received = charcoal glass | Both bubbles the same gray |

---

## 3. Design tokens

Put these in `src/styles/tokens.css` and map them to Tailwind `@theme`. **Never hardcode hex in components.**

```css
@theme {
  --font-display: "Poppins", ui-sans-serif, system-ui, sans-serif;
  --font-sans:    "Inter", ui-sans-serif, system-ui, sans-serif;

  --color-cyan:        #00E5FF;
  --color-cyan-deep:   #00C2C7;
  --color-cyan-dim:    #00E5E5;
  --color-cyan-ink:    #041114;

  --color-bg:          #070A0E;
  --color-bg-1:        #0F131B;
  --color-bg-2:        #1A1F24;
  --color-bg-3:        #252A2E;
  --color-line:        #343A40;
  --color-muted:       #8A94A6;
  --color-text:        #FFFFFF;
  --color-danger:      #FF4D6A;
  --color-away:        #F5A524;
  --color-offline:     #5B6470;

  --r-sm: 10px;
  --r-md: 14px;
  --r-lg: 18px;
  --r-xl: 22px;
  --r-2xl: 28px;
  --r-pill: 999px;

  --pad-screen: 12px;     /* gap between floating glass panels */
  --h-topbar: 64px;
  --w-rail: 88px;         /* icon rail */
  --w-list: 340px;        /* chat list */
  --w-info: 320px;        /* right user-info */
  --h-composer: 76px;

  --shadow-glow: 0 8px 28px rgba(0, 229, 255, 0.28);
}
```

### Color usage

| Token | Use |
|---|---|
| `--color-cyan` | Primary buttons, sent bubbles, active nav, online, links, toggles ON, circular progress |
| `--color-cyan-deep` | Button gradient end, waveform, focus ring inner |
| `--color-bg` | Page canvas only |
| `--color-bg-1` | Tight glass fallback, list wells |
| `--color-muted` | Timestamps, secondary labels, inactive icons |
| `--color-danger` | Block User, Log Out All Sessions, destructive only |
| White | Primary text, wordmark, icon strokes |

Unread badge = cyan disc, **white number**, 18–20px. Not red. Not gray.

### Typography scale

```
Wordmark          Poppins 28–32 / 600–700, tracking -0.02em
H1 / screen title Poppins 22–24 / 600
Section label     Inter 11 / 600, uppercase, tracking 0.12em, color-muted
Body / message    Inter 14.5–15 / 400, line-height 1.55
Chat name         Inter 14.5 / 600
Preview line      Inter 13 / 400, color-muted, 1 line truncate
Timestamp         Inter 11.5 / 500, color-muted
Button            Inter 14 / 600
Caption / about   Inter 13 / 400, color-muted, line-height 1.5
```

Never set `letter-spacing` on Inter body. Slight negative tracking on Poppins display only.

---

## 4. Layout architecture

### Desktop ≥ 1280px — four floating columns

The shell is **not** a full-bleed table. It is a dark atmosphere with **rounded glass columns** inset `--pad-screen` from the viewport, gap 10–12px, height `100dvh - 24px`, vertically centered.

```
┌──────────┐  ┌─────────────┐  ┌──────────────────────────┐  ┌─────────────┐
│  RAIL    │  │  CHAT LIST  │  │  CONVERSATION            │  │  USER INFO  │
│  88px    │  │  340px      │  │  flex-1                  │  │  320px      │
│          │  │             │  │                          │  │  (toggle)   │
│  logo    │  │  "Chats"    │  │  header 64px             │  │  avatar     │
│  nav     │  │  search     │  │  messages (wallpaper)    │  │  actions    │
│  chats   │  │  All/Unread │  │  composer 76px           │  │  about      │
│  groups  │  │  / Groups   │  │                          │  │  stats      │
│  calls   │  │  rows       │  │                          │  │  block      │
│  contacts│  │             │  │                          │  │             │
│  saved   │  │             │  │                          │  │             │
│  settings│  │             │  │                          │  │             │
│          │  │             │  │                          │  │             │
│  me      │  │             │  │                          │  │             │
└──────────┘  └─────────────┘  └──────────────────────────┘  └─────────────┘
```

- Rail, list, conversation, info are **separate glass panels**, not one big card split by borders.
- User Info is collapsible. Closing it expands the conversation. Animate width with GSAP (0.35s, `power3.inOut`).
- Active rail item: cyan-tinted glass pill, cyan icon, no fat blue rectangle.
- Current user chip pinned to rail bottom: avatar 36px + online disc + name/status on hover expand (optional). Theme toggle (sun/moon) lives here.

### Tablet 768–1279

Hide User Info behind a header button. Rail stays 72px. List 300px.

### Mobile ≤ 767 — three roots, not a squeezed desktop

1. **Chats** — search, All/Unread/Groups, list, bottom tab bar (Chats / Calls / Contacts / Settings).
2. **Conversation** — back, identity, messages, composer. No right panel.
3. **Profile / Settings** — stacked screens, native-feeling headers.

Mobile chrome: status bar spacer, 44px min hit targets, bottom tab bar as a floating glass pill with 12px inset.

---

## 5. Screen inventory (build in this order)

Ship in this sequence so the product always looks complete:

1. **App shell + atmosphere + rail** (empty states already designed)
2. **Chat list** with search, filters, rows, unread, typing
3. **Conversation** with bubbles, wallpaper, composer, header actions
4. **User Info** panel
5. **Auth** (Clerk) — sign in / sign up restyled
6. **Fingerprint / passkey** interstitial
7. **Settings** + Account edit
8. **Groups / Contacts / Saved / Calls**
9. **Dashboard** (creative-team: messages count, active users, storage ring, now playing)
10. **Media messages** — audio waveform, file cards, images

### 5.1 Chat list row

Height 68–72px. Padding 12px 14px. Hover: inner glass wash, no hard fill.

```
[ Avatar 44 ]  Name              9:41 AM
               Preview…              [2]
```

- Name: Inter 14.5/600, 1 line.
- Preview: last message, muted. If **you** sent it, prefix nothing; if group, prefix `John:`.
- Typing: preview becomes `Typing…` in cyan, with a 3-dot GSAP bounce.
- Unread: cyan badge, hide timestamp emphasis, name stays white.
- Active row: left 2px cyan bar **or** full-row cyan wash at 6% — pick one, use everywhere.
- Group avatars: 2×2 micro-grid of 4 faces inside a 44px rounded-2xl.

Filters: pill group `All | Unread | Groups`. Active = `glass-cyan` pill. Inactive = ghost.

### 5.2 Conversation

**Header:** avatar 36, name, `Online` in cyan 12/500, then spacer, icons `search | phone | video | more` at 20px, muted, hover cyan.

**Date separator:** tiny centered capsule `Today`, muted, 11px.

**Bubbles:**

| | Received | Sent |
|---|---|---|
| Fill | charcoal glass `rgba(255,255,255,0.06)` | cyan gradient glass |
| Text | white | `#041114` |
| Radius | 18px, **tail on bottom-left 6px** | 18px, **tail on bottom-right 6px** |
| Max width | 62% desktop, 82% mobile | same |
| Meta | time 11px muted inside, right | time + double-check, ink at 55% |
| Pad | 10px 14px 8px | same |

Stack consecutive messages from the same author with 6px gap; new author 14px. Avatar only on the last received in a group.

**Composer:** glass pill, height 52–56, `+` (attach) left, input unstyled transparent, emoji + send right. Send is a **cyan circle 44px** with a paper-plane, glow on hover. Disabled send = muted circle, no glow.

Attach menu (click `+`): glass popover — Photo, File, Audio, Location.

### 5.3 User Info

Centered avatar 96 with 3px cyan online ring. Name Poppins 20/600. `Online` cyan.

Action grid: 4 glass squares `Call | Video | Mute | More`, icon + 11px label.

Then: About, Username (copy button), Notifications switch (cyan track), Shared Media / Files / Links rows with counts, **Block User** in danger color, no fill.

### 5.4 Fingerprint / passkey

Centered glass card. Giant cyan line-art fingerprint (SVG, not a photo). Title `Set Your Fingerprint` / `Встановіть відбиток`. Subtitle muted. Two buttons: ghost `Skip` + cyan `Continue`. This maps to **Clerk passkeys / WebAuthn**, not a fake finger scan.

### 5.5 Settings

Two-pane on desktop: nav list (Account, Privacy & Security, Notifications, Appearance, Chat, Data & Storage, Devices, Language, Help & Support) + detail.

Account detail: avatar, `@username`, fields in glass inputs (Name, Username, Email, Phone, Bio), cyan `Edit Profile` / `Save`.

**Active Sessions:** device icon, name, location, `Active now` in cyan or relative time. Danger button `Log Out All Sessions`.

**Storage:** track 6px, cyan fill, `2.34 GB of 10 GB · 23%`. Button `Manage Storage`.

### 5.6 Dashboard (creative team)

Glass stat cards: Messages, Active Users, Storage ring (68% SVG circle, cyan stroke, rounded caps, track at 8% white).

**Now Playing** card: title, artist, waveform (canvas or SVG, cyan), elapsed, transport.

**Active Users** card: stacked avatars + `+12`.

These cards are the **glassmorphism showcase**. Extra blur, extra highlight, slight inner cyan.

### 5.7 Auth (Clerk)

Do not leave default Clerk appearance. Map:

```ts
appearance: {
  variables: {
    colorPrimary: "#00E5FF",
    colorBackground: "rgba(15,19,27,0.72)",
    colorInputBackground: "rgba(255,255,255,0.04)",
    colorText: "#FFFFFF",
    colorTextSecondary: "#8A94A6",
    borderRadius: "14px",
    fontFamily: "Inter, sans-serif",
  },
  elements: {
    card: "glass",
    formButtonPrimary: "glass-cyan",
  },
}
```

Wrap Clerk in the same atmosphere (nebula + noise). Wordmark Cloudy + cloud icon above the card.

---

## 6. Component API (build these primitives first)

```
src/components/ui/
  Glass.tsx              as="div"|"section"|"aside" variant="default"|"tight"|"cyan"|"input"
  Button.tsx             variant="primary"|"secondary"|"ghost"|"danger"|"icon" size="sm"|"md"|"lg"
  IconButton.tsx         40–44 hit target, 20 icon, tooltip
  Input.tsx              glass-input, leftIcon, clearable
  Avatar.tsx             size 24|32|36|44|64|96, status online|away|offline|typing, group
  Badge.tsx              unread | device | filter
  Switch.tsx             cyan track, 32×18
  TabsPills.tsx          All / Unread / Groups
  Separator.tsx          1px, white 6%
  Tooltip.tsx
  Dropdown.tsx           glass, 8px offset, GSAP 0.16s fade+y
  Modal.tsx              dim 50% + blur 8px, glass card, ESC
  Progress.tsx           linear + circular
  Skeleton.tsx           shimmer on glass, never gray bars on white

src/components/chat/
  ChatRail.tsx
  ChatList.tsx
  ChatRow.tsx
  Conversation.tsx
  ChatHeader.tsx
  MessageList.tsx
  MessageBubble.tsx
  AudioMessage.tsx       waveform + play + duration
  FileMessage.tsx        type icon, name, size
  TypingIndicator.tsx    3 cyan dots, GSAP yoyo
  Composer.tsx
  UserInfo.tsx
  Wallpaper.tsx          cloud pattern, pointer-events none

src/components/media/
  Waveform.tsx
  NowPlaying.tsx
  StorageRing.tsx
  ActiveUsers.tsx

src/components/settings/
  SettingsLayout.tsx
  AccountForm.tsx
  SessionsList.tsx
```

**Button variants (from the boards):**

- **Primary** — `glass-cyan`, height 40, pad 16–20, radius pill or 12, Inter 14/600, ink color. Hover: brighter cyan + glow. Active: scale 0.98.
- **Secondary** — transparent, hairline `rgba(255,255,255,.14)`, white text. Hover: fill 6% white.
- **Icon** — 40×40 glass circle.
- **Danger** — text only, `--color-danger`, no red fill except `Log Out All Sessions` (solid danger, white text).

---

## 7. Motion (GSAP)

Motion is part of the brand. It must feel **expensive and quiet**, not bouncy.

### Global defaults

```ts
gsap.defaults({ ease: "power3.out", duration: 0.45 });
```

| Event | Animation |
|---|---|
| App first paint | Atmosphere opacity 0→1 700ms; panels y:16→0 stagger 60ms |
| Open conversation | Message list stagger in from y:8, 20ms per bubble, max 12 |
| New incoming message | y:12 + opacity, 0.32s; list `scrollTo` bottom |
| Send | bubble scale 0.92→1, composer input clears, send icon ticks |
| Open User Info | width 0→320, overlay fade, 0.35s `power3.inOut` |
| Rail hover | icon color → cyan, 0.16s |
| Unread badge appear | scale 0.5→1, `back.out(1.6)` 0.3s |
| Typing dots | y -3, stagger 0.12, yoyo, repeat -1 |
| Online disc | 2s pulse ring, opacity 0.6→0, scale 1→1.8, repeat |
| Modal | overlay fade 0.2, card scale 0.96→1 + y:8→0 |
| Toast | from top-right, y:-12 |
| Page / settings pane | x:12→0, 0.3s, previous x:0→-8 fade |

**Rules:**

- Use `useGSAP` from `@gsap/react` with a scoped `container` ref. Kill tweens on unmount (the hook does this).
- Do **not** GSAP layout that Tailwind can do (`hover:`, `transition-colors`). GSAP is for enter/leave/stagger/timeline.
- Honor `prefers-reduced-motion: reduce`: duration 0.01, no stagger, no pulse.
- Never animate `blur` or `backdrop-filter` (jank). Animate opacity, transform, color only.
- Cap concurrent tweens. Do not stagger 200 messages.

### Presence

Socket events drive UI, GSAP plays them:

`user:online` → disc cyan + pulse.
`user:typing` → row preview + thread indicator.
`message:new` → bubble enter + optional sound (user-gated).
`message:read` → check icon cyan.

---

## 8. Frontend architecture

```
src/
  main.tsx
  app/
    router.tsx                 # routes: /, /chats, /chats/:id, /settings/*, /calls, /contacts
    providers.tsx              # Clerk, Query, Socket, Theme, I18n
  styles/
    tokens.css
    glass.css
    atmosphere.css             # nebula, noise, wallpaper
    tailwind.css
  components/                  # see §6
  features/
    auth/
    chat/
    presence/
    settings/
    dashboard/
  stores/
    ui.ts                      # infoOpen, activeFilter, theme, composer
    presence.ts
  lib/
    socket.ts                  # typed events
    clerk.ts                   # appearance
    i18n.ts
    cn.ts                      # clsx + tailwind-merge
    format.ts                  # time, size, "Yesterday"
  mocks/
    users.ts
    threads.ts
    messages.ts                # enough to render the boards without a backend
  types/
    chat.ts
```

**Data first, pixels second — except on this project the pixels are the product.** Mock the full Mike / Anna / Design Team / SLMN Studio dataset so the UI is demoable with zero backend. Socket.IO can emit from a local mock server.

### Chat data shapes

```ts
type UserStatus = "online" | "away" | "offline" | "typing";

interface User {
  id: string;
  name: string;
  username: string;          // @mike.cloudy
  avatarUrl: string;
  about: string;
  status: UserStatus;
  email?: string;
  phone?: string;
}

interface Message {
  id: string;
  threadId: string;
  authorId: string;
  createdAt: string;         // ISO
  kind: "text" | "audio" | "file" | "image";
  text?: string;
  file?: { name: string; size: number; url: string; mime: string };
  audio?: { url: string; duration: number; peaks: number[] };
  status: "sending" | "sent" | "delivered" | "read";
}

interface Thread {
  id: string;
  kind: "dm" | "group" | "channel";
  title: string;
  avatarUrl?: string;
  members: string[];
  lastMessageAt: string;
  unread: number;
  pinned?: boolean;
}
```

---

## 9. Auth, security, realtime

### Clerk

- `<SignedIn>` / `<SignedOut>` gate the shell.
- After first sign-up, show the fingerprint/passkey screen once (`user.unsafeMetadata.passkeyPrompted`).
- Map Clerk user → Cloudy `User` in one adapter. Do not leak Clerk types into chat components.
- Active Sessions UI reads Clerk sessions and can revoke.
- Webhooks later; UI does not block on them.

### Security (product promises from the boards)

Surface these as **UI truth**, even before crypto is real:

- Lock icon + "End-to-end encryption" in empty conversation and in Settings → Privacy.
- Do not log message bodies.
- `Block User` is a first-class action.
- Never render untrusted HTML in messages. Text only + sanitized media.

When E2E is not actually implemented, label it honestly in settings (`In development`) — do not fake a padlock on plaintext and call it encrypted in copy that users will trust. The marketing boards can stay; the in-app privacy screen must not lie.

### Socket.IO

Typed event map in `src/lib/socket.ts`. Reconnect with exponential backoff. Show a quiet glass toast `Reconnecting…` — never a full-screen error.

Presence heartbeat 20s. Typing emit throttled 400ms, auto-clear 3s.

---

## 10. i18n copy (keep in dictionaries, not in JSX)

```
uk:
  app.tagline: "Швидко. Безпечно. Надійно."
  nav.chats: "Чати"
  nav.groups: "Групи"
  nav.calls: "Дзвінки"
  nav.contacts: "Контакти"
  nav.channels: "Канали"
  nav.files: "Файли"
  nav.saved: "Збережене"
  nav.settings: "Налаштування"
  chat.search: "Пошук у чатах"
  chat.compose: "Написати повідомлення…"
  chat.online: "Онлайн"
  chat.typing: "Друкує…"
  chat.today: "Сьогодні"
  chat.yesterday: "Вчора"
  info.about: "Про себе"
  info.block: "Заблокувати"
  settings.account: "Акаунт"
  settings.privacy: "Приватність і безпека"
  settings.sessions: "Активні сесії"
  settings.storage: "Сховище"
  auth.fingerprint.title: "Встановіть відбиток"
  auth.fingerprint.body: "Додайте відбиток, щоб захистити акаунт."
  auth.skip: "Пропустити"
  auth.continue: "Продовжити"
  features.e2e: "Наскрізне шифрування"
  features.sync: "Хмарна синхронізація"
  features.fast: "Миттєві повідомлення"

en:
  app.tagline: "Stay connected, securely."
  nav.chats: "Chats"
  chat.compose: "Type a message…"
  chat.online: "Online"
  chat.typing: "Typing…"
  info.block: "Block User"
  auth.fingerprint.title: "Set Your Fingerprint"
```

All/Unread/Groups, timestamps (`9:41 AM` vs `09:41`) follow the active locale.

---

## 11. Icon set (outlined, 1.5 stroke)

Use Lucide names. One size in a given toolbar.

`cloud` (wordmark) · `search` · `plus` · `paperclip` · `phone` · `video` · `user` · `users` · `lock` · `bell` · `bookmark` · `image` · `mic` · `ellipsis` · `send` · `smile` · `gear` · `sun` / `moon` · `fingerprint` · `file` · `link` · `monitor` · `smartphone` · `tablet` · `log-out` · `chevron-right` · `arrow-left` · `check-check`

Wordmark: cyan cloud + "Cloudy" in Poppins 700, white. Never recolor the cloud to white on dark.

---

## 12. Coding conventions

- TypeScript strict. No `any`. No `as` unless a Clerk/Socket boundary.
- `cn()` for class names. No string concat of Tailwind.
- Named exports. Files named after the component.
- No default export except the route entry the bundler requires.
- Hooks: `useChat`, `useThread`, `usePresence`, `useComposer` — one job each.
- Server/socket types shared via `src/types`.
- Accessible: every icon button has `aria-label`. Focus rings are cyan, 2px, offset 2. Keyboard: `j/k` optional later; Enter sends, Shift+Enter newline.
- Images: always `alt`, always `loading="lazy"` except the open thread avatar.
- Do not use `div` for buttons. Do not use `p` for headings.

### Tailwind

- Prefer token classes (`bg-bg-1`, `text-muted`, `rounded-xl`, `text-cyan`).
- No `bg-[#00E5FF]` in JSX.
- No `dark:` prefix — there is only dark glass. A future light theme is a token swap, not `dark:`.

### Performance

- Virtualize message lists (`@tanstack/react-virtual`) above ~80 bubbles.
- Atmosphere noise is a 128px tiled PNG or a CSS `feTurbulence` SVG, not a 4K image.
- `will-change: transform` only while a GSAP tween runs.
- Avatars served at 2x of display size, WebP.

---

## 13. Visual QA checklist (every UI PR)

An agent must not call a screen "done" unless all of these pass:

- [ ] Atmosphere (nebula + noise) is visible behind the glass, not a flat fill
- [ ] Panels use the glass recipe (blur, hairline, top highlight) — not opaque gray cards
- [ ] Cyan is the only accent; danger is only on destructive actions
- [ ] Poppins on wordmark/titles, Inter on UI/chat
- [ ] Chat wallpaper clouds are faint, not a texture fight with bubbles
- [ ] Sent bubbles cyan, received charcoal, tails correct
- [ ] Online / typing / offline states are distinct
- [ ] Unread badges cyan, not red
- [ ] Composer send is a glowing cyan circle
- [ ] Right info panel matches the board (actions, about, counts, block)
- [ ] 1440px: four columns, 12px gutters, 22–28 radius
- [ ] 390px: no horizontal scroll, bottom tabs, 44px targets
- [ ] Hover/focus/active/disabled/empty/loading/error all exist
- [ ] `prefers-reduced-motion` respected
- [ ] Clerk screens restyled, not purple default
- [ ] No Lorem, no `John Doe`, no gray placeholder avatars — use the Mike / Anna / SLMN cast
- [ ] Ukrainian strings render without overflow; English too

---

## 14. Demo data (use this cast)

Do not invent a random user list. The boards *are* the demo.

**DMs:** Mike (`@mike.cloudy`, online, about: "Life is what happens when you're busy making plans."), Anna, Alex, David, Emma.

**Groups:** Design Team, Marketing, Product Team, SLMN Studio, SoundCrew, DJ Flow, Code & Beats, Poznań Nights.

**Self (EN board):** Mike. **Self (UK board):** SLMN, Sound Engineer.

Seed messages must include: short greetings, a long cyan sent bubble, a received paragraph, a `new_track.wav` file card, an audio waveform message, a typing row.

Timestamps as on the boards: `9:41 AM`, `Yesterday`, `Saturday`, `Friday`, `10:42`.

---

## 15. Agent do / don't

**Do**

- Open the token file and `Glass.tsx` before any new screen.
- Implement the empty, loading, and hover states in the same pass as the happy path.
- Use GSAP timelines for anything with 3+ steps.
- Keep components dumb; stores and socket adapters own data.
- When unsure about a pixel: prefer *more restraint* (less glow, more space, thinner line).

**Don't**

- Don't add a light theme "while you're here".
- Don't use `blue-500`, `indigo-600`, `emerald-400`, or any default Tailwind palette color for brand.
- Don't drop in `react-chat-elements`, Stream, Chatscope, or any kit that brings its own look.
- Don't animate with both GSAP and Framer on the same node.
- Don't put drop-shadows on text.
- Don't use Inter for the wordmark or Poppins for a 200-character message.
- Don't ship Clerk's purple/white default modal.
- Don't create `Button2.tsx`, `GlassCard.tsx`, `Panel.tsx` that duplicate `Glass` / `Button`.
- Don't write comments like `// create the button`. Comments explain *why*, never *what*.
- Don't add README badges, license files, or folder dumps the user did not ask for.

---

## 16. Suggested implementation order for agents

A new agent session should pick the **next unfinished step**, not restart:

```
T0  tokens.css + glass.css + atmosphere.css + fonts
T1  Glass, Button, IconButton, Input, Avatar, Switch, Badge
T2  App shell (4 columns) + rail + dummy list
T3  ChatRow + filters + search
T4  Conversation + bubbles + composer (mocked messages)
T5  User Info panel + GSAP open/close
T6  Mobile shell + tabs
T7  Typing, presence, unread, wallpaper
T8  Clerk appearance + gated shell + passkey screen
T9  Settings / Account / Sessions / Storage
T10 Audio + file messages + waveform
T11 Dashboard glass cards (Now Playing, ring, active users)
T12 Socket.IO wiring against the existing stores
T13 i18n uk/en
T14 Virtualized list, reduced-motion, a11y pass
```

After each T: the app must still look intentional. Never leave a raw unstyled Clerk or a white flash of unstyled content (`FOUC`: load tokens in `index.html`).

---

## 17. Definition of done

A feature is done when:

1. It matches the boards at 1440 and 390.
2. It is glassmorphic (blur + highlight + cyan accent), not "dark mode gray".
3. Motion is present and quiet.
4. Types pass, no `any`, no console errors.
5. Keyboard and screen-reader labels work on new controls.
6. Mock data is enough to demo it without a backend.
7. Ukrainian and English both fit the layout.

If you have to choose between another feature and a more beautiful shell — **beautify the shell**. That is the assignment.
